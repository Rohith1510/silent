(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/notification-settings.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationSettings",
    ()=>NotificationSettings,
    "VerifyEmail",
    ()=>VerifyEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useWalletClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$protocol$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/protocol-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/transaction.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
async function api(path, body, method = body ? "POST" : "GET") {
    const reply = await fetch(path, {
        method,
        credentials: "same-origin",
        headers: body ? {
            "Content-Type": "application/json"
        } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store"
    });
    const data = await reply.json();
    if (!reply.ok) throw new Error(data.error || "Request failed.");
    return data;
}
function NotificationSettings() {
    _s();
    const { address } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConnection"])();
    const { data: wallet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletClient"])();
    const { query } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$protocol$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProtocol"])();
    const vault = query.data?.vault;
    const [signedWallet, setSignedWallet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [consent, setConsent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const setup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "notification-status"
        ],
        queryFn: {
            "NotificationSettings.useQuery[setup]": ()=>api("/api/status")
        }["NotificationSettings.useQuery[setup]"],
        retry: false
    });
    const prefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "notification-preferences",
            vault,
            signedWallet,
            address
        ],
        enabled: !!vault && !!address && signedWallet.toLowerCase() === address.toLowerCase(),
        queryFn: {
            "NotificationSettings.useQuery[prefs]": ()=>api(`/api/notifications/preferences?vault=${vault}`)
        }["NotificationSettings.useQuery[prefs]"],
        retry: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationSettings.useEffect": ()=>{
            let active = true;
            api("/api/auth/session").then({
                "NotificationSettings.useEffect": (s)=>{
                    if (active) setSignedWallet(s.wallet);
                }
            }["NotificationSettings.useEffect"]).catch({
                "NotificationSettings.useEffect": ()=>{}
            }["NotificationSettings.useEffect"]);
            return ({
                "NotificationSettings.useEffect": ()=>{
                    active = false;
                }
            })["NotificationSettings.useEffect"];
        }
    }["NotificationSettings.useEffect"], []);
    async function run(action) {
        setBusy(true);
        setError("");
        setMessage("");
        try {
            await action();
        } catch (e) {
            setError((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transactionError"])(e));
        } finally{
            setBusy(false);
        }
    }
    const signedIn = !!address && signedWallet.toLowerCase() === address.toLowerCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "A warning. Time to respond.",
                description: "Optional email alerts for your vault. Signing in manages private preferences; it never approves a transaction."
            }, void 0, false, {
                fileName: "[project]/components/notification-settings.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "two-column notification-columns",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                        className: "notification-panel",
                        title: "Email alerts",
                        description: "Register your own email as a vault owner, guardian or beneficiary.",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "notification-symbol",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                        size: 25
                                    }, void 0, false, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: prefs.data?.verified ? "green" : "amber",
                                        children: prefs.data?.verified ? "Email verified" : "Optional"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            !address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletButton"], {}, void 0, false, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 106,
                                columnNumber: 24
                            }, this),
                            address && !signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "button primary",
                                disabled: busy || !wallet,
                                onClick: ()=>run(async ()=>{
                                        const challenge = await api("/api/auth/challenge", {
                                            address
                                        });
                                        const signature = await wallet.signMessage({
                                            message: challenge.message
                                        });
                                        const s = await api("/api/auth/session", {
                                            challenge: challenge.challenge,
                                            signature
                                        });
                                        setSignedWallet(s.wallet);
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this),
                                    " Sign in with wallet"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, this),
                            !vault && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                                children: "Open a vault on Overview first. You can inspect public vault data without signing in."
                            }, void 0, false, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "small muted",
                                        children: [
                                            "Signed in as ",
                                            signedWallet,
                                            ".",
                                            " ",
                                            prefs.data?.role && `Vault role: ${prefs.data.role}.`
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    prefs.data?.subscribed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                                                children: prefs.data.verified ? "Alerts are enabled for your verified address. Delivery depends on workflow execution and the email provider." : "Check your inbox for the verification link. No recovery alerts are sent until verified."
                                            }, void 0, false, {
                                                fileName: "[project]/components/notification-settings.tsx",
                                                lineNumber: 144,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "button",
                                                disabled: busy,
                                                onClick: ()=>run(async ()=>{
                                                        await api("/api/notifications/preferences", {
                                                            vault
                                                        }, "DELETE");
                                                        await prefs.refetch();
                                                        setMessage("Subscription and delivery history deleted.");
                                                    }),
                                                children: "Delete alerts & contact data"
                                            }, void 0, false, {
                                                fileName: "[project]/components/notification-settings.tsx",
                                                lineNumber: 149,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "notification-form",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                                                label: "Your email address",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    autoComplete: "email",
                                                    value: email,
                                                    onChange: (e)=>setEmail(e.target.value),
                                                    placeholder: "you@example.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/notification-settings.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/notification-settings.tsx",
                                                lineNumber: 171,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "consent-line",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: consent,
                                                        onChange: (e)=>setConsent(e.target.checked)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notification-settings.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ",
                                                    "I consent to vault email alerts and the association of this address with my wallet. I can delete this preference."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/notification-settings.tsx",
                                                lineNumber: 180,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "button primary",
                                                disabled: busy || !consent || !email || !vault || !!setup.data?.notificationSetup?.length,
                                                onClick: ()=>run(async ()=>{
                                                        await api("/api/notifications/preferences", {
                                                            vault,
                                                            email,
                                                            consent
                                                        });
                                                        setEmail("");
                                                        await prefs.refetch();
                                                        setMessage("Verification email accepted by the provider. Check your inbox; delivery is not guaranteed.");
                                                    }),
                                                children: "Send verification email"
                                            }, void 0, false, {
                                                fileName: "[project]/components/notification-settings.tsx",
                                                lineNumber: 189,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 170,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "button small-button",
                                        disabled: busy,
                                        onClick: ()=>run(async ()=>{
                                                await api("/api/auth/session", {}, "DELETE");
                                                setSignedWallet("");
                                            }),
                                        children: "Sign out of private settings"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this),
                            (error || prefs.error) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                                danger: true,
                                children: error || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transactionError"])(prefs.error)
                            }, void 0, false, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 232,
                                columnNumber: 13
                            }, this),
                            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                                children: message
                            }, void 0, false, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 234,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notification-settings.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                        className: "notification-panel",
                        title: "What will you receive?",
                        description: "Messages are reminders. Your wallet and vault enforce every permission.",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "notification-types",
                                children: [
                                    [
                                        "Owner",
                                        "Check-in reminder within 24 hours; pending recovery warning."
                                    ],
                                    [
                                        "Guardian",
                                        "A request needs review while quorum is missing."
                                    ],
                                    [
                                        "Beneficiary",
                                        "Recovery is authorized; review your available allocation."
                                    ]
                                ].map(([role, copy])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/components/notification-settings.tsx",
                                                lineNumber: 254,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: role
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notification-settings.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: copy
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notification-settings.tsx",
                                                        lineNumber: 257,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/notification-settings.tsx",
                                                lineNumber: 255,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, role, true, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                                children: setup.data?.automation || "Automation deployment has not been verified."
                            }, void 0, false, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            !!setup.data?.notificationSetup?.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                                children: [
                                    "Notifications are not configured. Email alerts will become available when the operator completes setup.",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/settings",
                                        children: "View setup details"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notification-settings.tsx",
                                        lineNumber: 270,
                                        columnNumber: 15
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "muted small",
                                children: "Email contacts are encrypted in storage. The app server and email provider still process the destination. Notification enrollment is outside anonymous RPC transport."
                            }, void 0, false, {
                                fileName: "[project]/components/notification-settings.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notification-settings.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/notification-settings.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                className: "notification-panel",
                title: "Delivery history",
                description: "Accepted means the provider accepted the email. Delivered requires a verified provider webhook.",
                children: prefs.data?.deliveries?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "delivery-list",
                    children: prefs.data.deliveries.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: d.kind.replaceAll("_", " ")
                                }, void 0, false, {
                                    fileName: "[project]/components/notification-settings.tsx",
                                    lineNumber: 289,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                    tone: d.status === "delivered" ? "green" : "amber",
                                    children: d.status
                                }, void 0, false, {
                                    fileName: "[project]/components/notification-settings.tsx",
                                    lineNumber: 290,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: new Date(d.created_at).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/components/notification-settings.tsx",
                                    lineNumber: 293,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, `${d.created_at}-${i}`, true, {
                            fileName: "[project]/components/notification-settings.tsx",
                            lineNumber: 288,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/notification-settings.tsx",
                    lineNumber: 286,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "muted",
                    children: "No delivery records available for your signed-in subscription."
                }, void 0, false, {
                    fileName: "[project]/components/notification-settings.tsx",
                    lineNumber: 298,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/notification-settings.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/notification-settings.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(NotificationSettings, "4Lfk2JCh4OTWGxStuHa2Is72fD0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConnection"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$protocol$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProtocol"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = NotificationSettings;
function VerifyEmail() {
    _s1();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "Confirm your email.",
                description: "This verifies notification consent only. It does not change your vault or authorize asset transfers."
            }, void 0, false, {
                fileName: "[project]/components/notification-settings.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Panel"], {
                title: "Finish verification",
                className: "notification-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Confirm only if you requested alerts for this address."
                    }, void 0, false, {
                        fileName: "[project]/components/notification-settings.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "button primary",
                        disabled: busy || !!message,
                        onClick: async ()=>{
                            setBusy(true);
                            setError("");
                            try {
                                const token = window.location.hash.slice(1);
                                await api("/api/notifications/verify", {
                                    token
                                });
                                window.history.replaceState(null, "", window.location.pathname);
                                setMessage("Email verified. Return to notifications to review your subscription.");
                            } catch (e) {
                                setError((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transactionError"])(e));
                            } finally{
                                setBusy(false);
                            }
                        },
                        children: "Confirm email alerts"
                    }, void 0, false, {
                        fileName: "[project]/components/notification-settings.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/components/notification-settings.tsx",
                        lineNumber: 340,
                        columnNumber: 21
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
                        danger: true,
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/notification-settings.tsx",
                        lineNumber: 341,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/notification-settings.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/notification-settings.tsx",
        lineNumber: 311,
        columnNumber: 5
    }, this);
}
_s1(VerifyEmail, "A3dDSa+WJAz/7FH/+qT56IwoS0s=");
_c1 = VerifyEmail;
var _c, _c1;
__turbopack_context__.k.register(_c, "NotificationSettings");
__turbopack_context__.k.register(_c1, "VerifyEmail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Mail
]);
/**
 * @license lucide-react v1.62.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "mail",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
                key: "132q7q"
            }
        ],
        [
            "rect",
            {
                x: "2",
                y: "4",
                width: "20",
                height: "16",
                rx: "2",
                key: "izxlao"
            }
        ]
    ]
};
__iconData.node;
const Mail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript)");
}),
]);})()

//# sourceMappingURL=_16_i-vdjxva8z._.js.map