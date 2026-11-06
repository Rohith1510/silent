import "server-only";
import {
  appOrigin,
  assertOrigin,
  HttpError,
  jsonBody,
  required,
  response,
  rawBody,
} from "./config";
import { checked, database, rateLimit } from "./database";
import { session } from "./auth";
import { addressInput, vaultRole, vaultState } from "./chain";
import {
  contactHash,
  decryptContact,
  digest,
  encryptContact,
  equalSecret,
  token,
} from "./cryptography";
import {
  accountLink,
  emailClient,
  sendEmail,
  EmailAcceptanceError,
} from "./email";
import {
  notificationKey,
  notificationKinds,
  notificationText,
  type NotificationRole,
} from "../notification-policy";

export async function preferences(request: Request) {
  const { wallet } = await session(request);
  const state = await vaultState(
    new URL(request.url).searchParams.get("vault"),
  );
  const role = vaultRole(state, wallet);
  const db = database();
  const row = checked(
    await db
      .from("silent_subscriptions")
      .select("id,verified_at,consent_at")
      .eq("chain_id", state.chainId)
      .eq("vault", state.vault.toLowerCase())
      .eq("wallet", wallet)
      .maybeSingle(),
  );
  const deliveries = row
    ? checked(
        await db
          .from("silent_deliveries")
          .select("kind,status,created_at,provider_id")
          .eq("subscription_id", row.id)
          .order("created_at", { ascending: false })
          .limit(20),
      )
    : [];
  return response({
    wallet,
    role,
    subscribed: !!row,
    verified: !!row?.verified_at,
    consentAt: row?.consent_at,
    deliveries,
  });
}
export async function subscribe(request: Request) {
  assertOrigin(request);
  const { wallet } = await session(request);
  const body = await jsonBody(request);
  if (body.consent !== true || typeof body.email !== "string")
    throw new HttpError(400, "Email notification consent is required.");
  const email = body.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
    throw new HttpError(400, "Enter a valid email address.");
  // Fail closed before creating preferences if external services are not configured.
  required("RESEND_API_KEY");
  required("EMAIL_FROM");
  const secret = required("NOTIFICATION_ENCRYPTION_KEY");
  const state = await vaultState(body.vault);
  const role = vaultRole(state, wallet);
  await rateLimit(`subscribe:${wallet}`, 3, 3600);
  await rateLimit(`recipient:${contactHash(email, secret)}`, 5, 86400);
  const verification = token();
  const db = database();
  const existing = checked(
    await db
      .from("silent_subscriptions")
      .select("id,email_hash,verified_at")
      .eq("chain_id", state.chainId)
      .eq("vault", state.vault.toLowerCase())
      .eq("wallet", wallet)
      .maybeSingle(),
  );
  if (existing?.verified_at)
    throw new HttpError(
      409,
      "Notifications are already enabled. Delete the subscription before changing its address.",
    );
  if (existing)
    checked(
      await db.from("silent_subscriptions").delete().eq("id", existing.id),
    );
  const inserted = checked(
    await db
      .from("silent_subscriptions")
      .insert({
        chain_id: state.chainId,
        vault: state.vault.toLowerCase(),
        wallet,
        email_ciphertext: encryptContact(email, secret),
        email_hash: contactHash(email, secret),
        role,
        verification_hash: digest(verification),
        verification_expires: new Date(Date.now() + 30 * 60000).toISOString(),
      })
      .select("id")
      .single(),
  );
  // Fragment keeps the verification token out of server URL/access logs. GET never verifies.
  try {
    await sendEmail(
      email,
      "Confirm your silent email alerts",
      `You requested optional vault email alerts. Confirm within 30 minutes:\n\n${appOrigin()}/notifications/verify#${verification}\n\nIf you did not request this, ignore it. No assets or permissions change.`,
      `verify-${inserted.id}`,
    );
  } catch (error) {
    // Remove a definitively rejected enrollment so the UI does not claim a verification message is waiting.
    // Preserve ambiguous timeouts: the provider may still have accepted the message.
    if (error instanceof EmailAcceptanceError && error.definitelyRejected)
      checked(
        await db
          .from("silent_subscriptions")
          .delete()
          .eq("id", inserted.id)
          .eq("verification_hash", digest(verification))
          .is("verified_at", null),
      );
    throw error;
  }
  return response({ verificationSent: true });
}
export async function unsubscribe(request: Request) {
  assertOrigin(request);
  const { wallet } = await session(request);
  const body = await jsonBody(request);
  const vault = addressInput(body.vault).toLowerCase();
  checked(
    await database()
      .from("silent_subscriptions")
      .delete()
      .eq("wallet", wallet)
      .eq("vault", vault)
      .eq("chain_id", Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111)),
  );
  return response({ deleted: true });
}
export async function verifyEmail(request: Request) {
  assertOrigin(request);
  const body = await jsonBody(request);
  if (typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token))
    throw new HttpError(400, "Invalid verification token.");
  if (
    !checked(
      await database().rpc("silent_verify_email", {
        p_hash: digest(body.token),
      }),
    )
  )
    throw new HttpError(400, "Verification link expired or already used.");
  return response({ verified: true });
}
export async function dispatch(request: Request) {
  const expected = required("CRE_NOTIFICATION_TOKEN");
  if (expected.length < 32)
    throw new HttpError(
      503,
      "CRE_NOTIFICATION_TOKEN must have at least 32 random characters.",
    );
  if (
    !equalSecret(
      request.headers.get("authorization") || "",
      `Bearer ${expected}`,
    )
  )
    throw new HttpError(401, "Invalid workflow authorization.");
  const body = await jsonBody(request);
  const state = await vaultState(body.vault);
  // Treat CRE observations as hints only. Derive recipients, templates and eligibility from current chain state.
  if (body.chainId !== state.chainId)
    throw new HttpError(400, "Workflow network mismatch.");
  required("RESEND_API_KEY");
  required("EMAIL_FROM");
  const encryption = required("NOTIFICATION_ENCRYPTION_KEY");
  const db = database();
  await rateLimit(
    `dispatch:${state.chainId}:${state.vault.toLowerCase()}`,
    30,
    60,
  );
  const subscriptions = checked(
    await db
      .from("silent_subscriptions")
      .select("id,wallet,email_ciphertext")
      .eq("chain_id", state.chainId)
      .eq("vault", state.vault.toLowerCase())
      .not("verified_at", "is", null)
      .limit(100),
  );
  let failed = false;
  for (const sub of subscriptions) {
    let role: NotificationRole;
    try {
      role = vaultRole(state, sub.wallet);
    } catch {
      continue;
    } // Former participants lose notifications immediately.
    for (const kind of notificationKinds(state, role)) {
      const key = digest(
        notificationKey(state.chainId, state.vault, sub.id, kind, state),
      );
      const lease = checked(
        await db.rpc("silent_acquire_delivery", {
          p_key: key,
          p_subscription: sub.id,
          p_kind: kind,
        }),
      );
      if (!lease?.length) continue;
      try {
        const template = notificationText[kind];
        const id = await sendEmail(
          decryptContact(sub.email_ciphertext, encryption),
          template.subject,
          `${template.text}\n\n${accountLink()}#vault=${state.vault}\n\nManage or delete alerts at the link above after signing in. Transactions require your wallet. No private keys are ever requested.`,
          `silent-${key}`,
        );
        checked(
          await db
            .from("silent_deliveries")
            .update({
              status: "accepted",
              provider_id: id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", lease[0].id)
            .eq("status", "processing"),
        );
      } catch {
        failed = true;
        checked(
          await db
            .from("silent_deliveries")
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", lease[0].id)
            .eq("status", "processing"),
        );
      }
    }
  }
  // Stable body permits CRE consensus across duplicate node requests; detailed evidence stays in authenticated history.
  if (failed)
    throw new HttpError(
      502,
      "At least one notification was not confirmed; retry after the delivery lease expires.",
    );
  return response({ processed: true });
}
export async function webhook(request: Request) {
  // Resend verifies the raw bytes with Svix signatures and timestamp tolerance.
  if (Number(request.headers.get("content-length") || 0) > 65536)
    throw new HttpError(413, "Webhook is too large.");
  const raw = await rawBody(request, 65536);
  const id = request.headers.get("svix-id") || "";
  const verifier = emailClient();
  const webhookSecret = required("RESEND_WEBHOOK_SECRET");
  let event;
  try {
    event = verifier.webhooks.verify({
      payload: raw,
      headers: {
        id,
        timestamp: request.headers.get("svix-timestamp") || "",
        signature: request.headers.get("svix-signature") || "",
      },
      webhookSecret,
    });
  } catch {
    throw new HttpError(400, "Invalid email webhook signature.");
  }
  const db = database();
  const statuses: Record<string, string> = {
    "email.delivered": "delivered",
    "email.bounced": "bounced",
    "email.complained": "complained",
    "email.failed": "failed",
  };
  const status = statuses[event.type];
  if (status && "email_id" in event.data) {
    const applied = checked(
      await db.rpc("silent_apply_webhook", {
        p_event: id,
        p_provider: event.data.email_id,
        p_status: status,
      }),
    );
    // An early webhook can beat the send response that stores provider_id. Ask the provider to retry.
    if (!applied)
      throw new HttpError(
        503,
        "Delivery record is not ready; retry this webhook.",
      );
  }
  return response({ received: true });
}
