import "server-only";
import { Resend } from "resend";
import { appOrigin, HttpError, required } from "./config";
import { emailFailure } from "../email-errors";
export class EmailAcceptanceError extends HttpError {
  definitelyRejected: boolean;
  constructor(failure: ReturnType<typeof emailFailure>) {
    super(failure.status, failure.message);
    this.definitelyRejected = failure.definitelyRejected;
  }
}
export function emailClient() {
  return new Resend(required("RESEND_API_KEY"));
}
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  key: string,
) {
  const { data, error } = await emailClient().emails.send(
    { from: required("EMAIL_FROM"), to: [to], subject, text },
    { idempotencyKey: key },
  );
  if (error || !data?.id) {
    const failure = emailFailure(error);
    console.warn("silent email acceptance failed", {
      reason: failure.reason,
      status: error?.statusCode ?? null,
    });
    throw new EmailAcceptanceError(failure);
  }
  return data.id;
}
export const accountLink = () => `${appOrigin()}/notifications`;
