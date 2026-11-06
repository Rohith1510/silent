import {
  preferences,
  subscribe,
  unsubscribe,
} from "@/lib/server/notifications";
import { endpoint } from "@/lib/server/config";
export const GET = (request: Request) => endpoint(() => preferences(request));
export const POST = (request: Request) => endpoint(() => subscribe(request));
export const DELETE = (request: Request) =>
  endpoint(() => unsubscribe(request));
