import "server-only";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new HttpError(503, `Service not configured: ${name}.`);
  return value;
}
export function appOrigin() {
  const url = new URL(required("APP_ORIGIN"));
  if (
    url.protocol !== "https:" &&
    !(
      process.env.NODE_ENV !== "production" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
  )
    throw new HttpError(
      503,
      "APP_ORIGIN must use HTTPS outside local development.",
    );
  return url.origin;
}
export function assertOrigin(request: Request) {
  if (request.headers.get("origin") !== appOrigin())
    throw new HttpError(403, "Request origin is not allowed.");
}
export async function rawBody(request: Request, max = 8192): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new HttpError(413, "Request is too large.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
export async function jsonBody(
  request: Request,
  max = 8192,
): Promise<Record<string, unknown>> {
  const text = await rawBody(request, max);
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new HttpError(400, "Invalid JSON object.");
  }
}
export function response(body: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}
export async function endpoint(action: () => Promise<Response>) {
  try {
    return await action();
  } catch (error) {
    if (error instanceof HttpError)
      return response({ error: error.message }, error.status);
    // Never expose database/provider errors, credentials or contact details to visitors.
    console.error(
      "silent server request failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return response(
      {
        error:
          "Service request failed. Check server configuration and try again.",
      },
      503,
    );
  }
}
