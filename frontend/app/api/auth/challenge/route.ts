import { challenge } from "@/lib/server/auth";
import { endpoint } from "@/lib/server/config";
export const POST = (request: Request) => endpoint(() => challenge(request));
