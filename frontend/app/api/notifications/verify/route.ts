import { verifyEmail } from "@/lib/server/notifications";
import { endpoint } from "@/lib/server/config";
export const POST = (request: Request) => endpoint(() => verifyEmail(request));
