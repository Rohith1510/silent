import { dispatch } from "@/lib/server/notifications";
import { endpoint } from "@/lib/server/config";
export const maxDuration = 60;
export const POST = (request: Request) => endpoint(() => dispatch(request));
