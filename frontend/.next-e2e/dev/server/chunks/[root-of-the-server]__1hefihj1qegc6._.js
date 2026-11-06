module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/status/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/config.ts [app-route] (ecmascript)");
;
const GET = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["endpoint"])(async ()=>{
        const names = [
            "APP_ORIGIN",
            "SUPABASE_URL",
            "SUPABASE_SECRET_KEY",
            "SERVER_RPC_URL",
            "NOTIFICATION_ENCRYPTION_KEY",
            "RESEND_API_KEY",
            "EMAIL_FROM"
        ];
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["response"])({
            notificationSetup: names.filter((name)=>!process.env[name]?.trim()),
            automation: "Not verified as deployed. CLI simulations run only when launched; no continuous monitoring is implied.",
            externalCalls: "Notification enrollment and delivery use the app server, Supabase and the email provider. These calls are outside Anon-RPC."
        });
    });
}),
"[project]/lib/server/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HttpError",
    ()=>HttpError,
    "appOrigin",
    ()=>appOrigin,
    "assertOrigin",
    ()=>assertOrigin,
    "endpoint",
    ()=>endpoint,
    "jsonBody",
    ()=>jsonBody,
    "rawBody",
    ()=>rawBody,
    "required",
    ()=>required,
    "response",
    ()=>response
]);
;
class HttpError extends Error {
    status;
    constructor(status, message){
        super(message), this.status = status;
    }
}
function required(name) {
    const value = process.env[name]?.trim();
    if (!value) throw new HttpError(503, `Service not configured: ${name}.`);
    return value;
}
function appOrigin() {
    const url = new URL(required("APP_ORIGIN"));
    if (url.protocol !== "https:" && !(("TURBOPACK compile-time value", "development") !== "production" && [
        "localhost",
        "127.0.0.1"
    ].includes(url.hostname))) throw new HttpError(503, "APP_ORIGIN must use HTTPS outside local development.");
    return url.origin;
}
function assertOrigin(request) {
    if (request.headers.get("origin") !== appOrigin()) throw new HttpError(403, "Request origin is not allowed.");
}
async function rawBody(request, max = 8192) {
    const reader = request.body?.getReader();
    if (!reader) throw new HttpError(400, "A request body is required.");
    const chunks = [];
    let size = 0;
    for(;;){
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
async function jsonBody(request, max = 8192) {
    const text = await rawBody(request, max);
    try {
        const body = JSON.parse(text);
        if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
        return body;
    } catch  {
        throw new HttpError(400, "Invalid JSON object.");
    }
}
function response(body, status = 200, headers) {
    return Response.json(body, {
        status,
        headers: {
            "Cache-Control": "no-store",
            ...headers
        }
    });
}
async function endpoint(action) {
    try {
        return await action();
    } catch (error) {
        if (error instanceof HttpError) return response({
            error: error.message
        }, error.status);
        // Never expose database/provider errors, credentials or contact details to visitors.
        console.error("SilentSovereign server request failed", error instanceof Error ? error.name : "UnknownError");
        return response({
            error: "Service request failed. Check server configuration and try again."
        }, 503);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1hefihj1qegc6._.js.map