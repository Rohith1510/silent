import { login, logout, session } from "@/lib/server/auth";
import { endpoint, response } from "@/lib/server/config";
export const POST = (request: Request) => endpoint(() => login(request));
export const DELETE = (request: Request) => endpoint(() => logout(request));
export const GET = (request: Request) =>
  endpoint(async () =>
    response(await session(request).then(({ wallet }) => ({ wallet }))),
  );
