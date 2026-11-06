import { endpoint, response } from "@/lib/server/config";
export const GET = () =>
  endpoint(async () => {
    const names = [
      "APP_ORIGIN",
      "SUPABASE_URL",
      "SUPABASE_SECRET_KEY",
      "SERVER_RPC_URL",
      "NOTIFICATION_ENCRYPTION_KEY",
      "RESEND_API_KEY",
      "EMAIL_FROM",
    ];
    return response({
      notificationSetup: names.filter((name) => !process.env[name]?.trim()),
      automation:
        "Not verified as deployed. CLI simulations run only when launched; no continuous monitoring is implied.",
      externalCalls:
        "Notification enrollment and delivery use the app server, Supabase and the email provider. These calls are outside Anon-RPC.",
    });
  });
