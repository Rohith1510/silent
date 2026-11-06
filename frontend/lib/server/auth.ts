import "server-only";
import { createSiweMessage } from "viem/siwe";
import { type Hex } from "viem";
import {
  appOrigin,
  assertOrigin,
  HttpError,
  jsonBody,
  response,
} from "./config";
import { checked, database, rateLimit } from "./database";
import { digest, token } from "./cryptography";
import { addressInput, serverClient } from "./chain";
const cookieName = () =>
  process.env.NODE_ENV === "production"
    ? "__Host-silent_session"
    : "silent_session";
function cookie(value: string, maxAge: number) {
  return `${cookieName()}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export async function session(request: Request) {
  const value = request.headers
    .get("cookie")
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(`${cookieName()}=`))
    ?.split("=")[1];
  if (!value || !/^[a-f0-9]{64}$/.test(value))
    throw new HttpError(
      401,
      "Sign a wallet login message to manage private settings.",
    );
  const row = checked(
    await database()
      .from("silent_sessions")
      .select("wallet")
      .eq("token_hash", digest(value))
      .gt("expires_at", new Date().toISOString())
      .maybeSingle(),
  );
  if (!row)
    throw new HttpError(
      401,
      "Your private-settings session expired. Sign in again.",
    );
  return { wallet: row.wallet as string, hash: digest(value) };
}
export async function challenge(request: Request) {
  assertOrigin(request);
  const address = addressInput((await jsonBody(request)).address);
  const client = serverClient();
  const origin = new URL(appOrigin());
  const nonce = token();
  await rateLimit(
    `challenge:${digest(request.headers.get("x-forwarded-for")?.split(",")[0] || "local")}`,
    30,
    600,
  );
  await rateLimit(`wallet-challenge:${address.toLowerCase()}`, 8, 600);
  const expires = new Date(Date.now() + 5 * 60000);
  const message = createSiweMessage({
    address,
    chainId: client.chain.id,
    domain: origin.host,
    uri: origin.origin,
    version: "1",
    nonce,
    issuedAt: new Date(),
    expirationTime: expires,
    statement:
      "Sign in to SilentSovereign notification preferences. This does not authorize any blockchain transaction.",
  });
  checked(
    await database()
      .from("silent_challenges")
      .insert({
        token_hash: digest(nonce),
        wallet: address.toLowerCase(),
        message,
        expires_at: expires.toISOString(),
      }),
  );
  return response({ message, challenge: nonce });
}
export async function login(request: Request) {
  assertOrigin(request);
  const body = await jsonBody(request);
  if (
    typeof body.challenge !== "string" ||
    !/^[a-f0-9]{64}$/.test(body.challenge) ||
    typeof body.signature !== "string" ||
    !/^0x[0-9a-f]+$/i.test(body.signature)
  )
    throw new HttpError(400, "Invalid challenge or wallet signature.");
  // Atomic consumption prevents parallel replay. The server reconstructs the trusted message from storage.
  const rows = checked(
    await database().rpc("silent_consume_challenge", {
      p_hash: digest(body.challenge),
    }),
  );
  const row = rows?.[0];
  if (!row) throw new HttpError(401, "Challenge expired or already used.");
  if (
    !(await serverClient().verifyMessage({
      address: row.wallet,
      message: row.message,
      signature: body.signature as Hex,
    }))
  )
    throw new HttpError(401, "Wallet signature verification failed.");
  const value = token();
  checked(
    await database()
      .from("silent_sessions")
      .insert({
        token_hash: digest(value),
        wallet: row.wallet,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
      }),
  );
  return response({ wallet: row.wallet }, 200, {
    "Set-Cookie": cookie(value, 3600),
  });
}
export async function logout(request: Request) {
  assertOrigin(request);
  const current = await session(request);
  checked(
    await database()
      .from("silent_sessions")
      .delete()
      .eq("token_hash", current.hash),
  );
  return response({ signedOut: true }, 200, { "Set-Cookie": cookie("", 0) });
}
