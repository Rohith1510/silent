module.exports = [
(()=>{"use strict";return[
"[project]/components/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers,
    "useReadTransport",
    ()=>useReadTransport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/network.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$privacy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/privacy.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ReadContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    privacy: {
        mode: "starting",
        detail: "Initializing read transport"
    },
    network: "nox",
    retry: ()=>{},
    chooseAnonymous: ()=>{},
    choosePublic: ()=>{}
});
const useReadTransport = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ReadContext);
function ReadProvider({ children }) {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$privacy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["anonEnabled"] ? "anonymous" : "public");
    const [network, setNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("nox");
    const [attempt, setAttempt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [transport, setTransport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$privacy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["anonEnabled"] ? {
            privacy: {
                mode: "starting",
                detail: "Starting the official Nox browser worker…"
            }
        } : {
            client: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$privacy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicReadClient"])(),
            privacy: {
                mode: "public",
                detail: "Public RPC · network metadata is visible"
            }
        });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let disposed = false;
        let close;
        if (mode === "public") return;
        const status = (privacy)=>{
            if (!disposed) setTransport((t)=>({
                    ...t,
                    privacy
                }));
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$privacy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startAnonymousClient"])(status, network).then((result)=>{
            close = result.close;
            if (disposed) return close();
            setTransport((t)=>({
                    ...t,
                    client: result.client
                }));
        }).catch((error)=>{
            if (!disposed) setTransport({
                privacy: {
                    mode: "failed",
                    detail: String(error)
                }
            });
        });
        return ()=>{
            disposed = true;
            close?.();
        };
    }, [
        mode,
        network,
        attempt
    ]);
    const choosePublic = ()=>{
        setMode("public");
        setAttempt((a)=>a + 1);
        setTransport({
            client: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$privacy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicReadClient"])(),
            privacy: {
                mode: "public",
                detail: "Public RPC selected explicitly · source IP and query metadata may be visible"
            }
        });
    };
    const chooseAnonymous = (value)=>{
        setTransport({
            privacy: {
                mode: "starting",
                detail: `Connecting to ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$privacy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["anonymousNetworks"][value].name}. App reads wait for a real chain response.`
            }
        });
        setNetwork(value);
        setMode("anonymous");
        setAttempt((a)=>a + 1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReadContext.Provider, {
        value: {
            ...transport,
            network,
            retry: ()=>chooseAnonymous(network),
            choosePublic,
            chooseAnonymous
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    retry: 1,
                    refetchOnWindowFocus: false
                }
            }
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WagmiProvider"], {
        config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["walletConfig"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReadProvider, {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/providers.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/providers.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/providers.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/configuration.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildGraph",
    ()=>buildGraph,
    "defaultConfiguration",
    ()=>defaultConfiguration,
    "secondsLabel",
    ()=>secondsLabel,
    "serializeConfiguration",
    ()=>serializeConfiguration,
    "shortAddress",
    ()=>shortAddress,
    "validAddress",
    ()=>validAddress,
    "validateConfiguration",
    ()=>validateConfiguration,
    "validateGraph",
    ()=>validateGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/address/getAddress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/address/isAddress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/constants/address.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/ens/normalize.js [app-ssr] (ecmascript)");
;
;
const defaultConfiguration = {
    beneficiaries: [],
    guardians: [],
    heartbeatInterval: 30 * 86400,
    challengePeriod: 7 * 86400,
    releaseInterval: 30 * 86400,
    emergencyDelay: 90 * 86400,
    initialBps: 1000,
    trancheBps: 1000,
    guardianThreshold: 0
};
const secondsLabel = (s)=>s === 0 ? "Disabled" : s >= 86400 ? `${+(s / 86400).toFixed(1)} days` : s >= 3600 ? `${+(s / 3600).toFixed(1)} hours` : `${+(s / 60).toFixed(1)} min`;
const shortAddress = (a)=>a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "Not connected";
function validAddress(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAddress"])(value) && value.toLowerCase() !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroAddress"];
}
function validateConfiguration(config, owner) {
    const errors = [];
    const add = (node, message)=>errors.push({
            node,
            message
        });
    if (config.beneficiaries.length < 1 || config.beneficiaries.length > 16) add("vault", "Add between 1 and 16 beneficiaries.");
    if (config.beneficiaries.reduce((n, b)=>n + b.allocationBps, 0) !== 10000) add("vault", "Beneficiary allocations must total exactly 100%.");
    const addresses = new Set();
    const ids = new Set();
    for (const b of config.beneficiaries){
        const node = `beneficiary:${b.id}`;
        if (!b.id || ids.has(b.id)) add(node, "Beneficiary IDs must be unique.");
        ids.add(b.id);
        if (!validAddress(b.address)) add(node, "Resolve an ENS name or enter a valid, nonzero address.");
        if (!Number.isInteger(b.allocationBps) || b.allocationBps < 1 || b.allocationBps > 10000) add(node, "Allocation must be between 0.01% and 100%.");
        const address = b.address.toLowerCase();
        if (addresses.has(address)) add(node, "Each beneficiary must have a different address.");
        addresses.add(address);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAddress"])(b.identity)) {
            try {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(b.identity) !== b.resolvedIdentity) add(node, "Resolve this ENS identity before saving.");
            } catch  {
                add(node, "This ENS name is invalid.");
            }
        } else if (b.identity.toLowerCase() !== address) add(node, "The identity and pinned address disagree.");
    }
    const guardianSet = new Set();
    if (config.guardians.length > 16) add("guardians", "At most 16 guardians are supported.");
    for (const g of config.guardians){
        if (!validAddress(g) || g.toLowerCase() === owner?.toLowerCase()) add("guardians", "Guardians must be nonzero addresses different from the owner.");
        if (guardianSet.has(g.toLowerCase())) add("guardians", "Remove duplicate guardians.");
        guardianSet.add(g.toLowerCase());
    }
    if (!Number.isInteger(config.guardianThreshold) || (config.guardians.length === 0 ? config.guardianThreshold !== 0 : config.guardianThreshold < 1 || config.guardianThreshold > config.guardians.length)) add("guardians", "Set a guardian threshold between 1 and the guardian count; use 0 only with no guardians.");
    for (const [field, node] of [
        [
            "heartbeatInterval",
            "heartbeat"
        ],
        [
            "challengePeriod",
            "challenge"
        ],
        [
            "releaseInterval",
            "allowance"
        ]
    ]){
        if (!Number.isSafeInteger(config[field]) || config[field] < 60 || config[field] > 315360000) add(node, "Duration must be a whole number of seconds from 60 to 315360000.");
    }
    if (!Number.isSafeInteger(config.emergencyDelay) || config.emergencyDelay !== 0 && (config.emergencyDelay < 60 || config.emergencyDelay > 315360000)) add("emergency", "Emergency delay must be 0 (disabled), or between 60 and 315360000 seconds.");
    if (!Number.isInteger(config.initialBps) || config.initialBps < 0 || config.initialBps > 10000) add("allowance", "Initial release must be between 0% and 100%.");
    if (!Number.isInteger(config.trancheBps) || config.trancheBps < 1 || config.trancheBps > 10000) add("allowance", "Each tranche must be between 0.01% and 100%.");
    return errors;
}
function buildGraph(c, owner) {
    const nodes = [
        {
            id: "owner",
            type: "protocol",
            position: {
                x: 0,
                y: 0
            },
            data: {
                kind: "owner",
                label: "Vault owner",
                detail: shortAddress(owner)
            }
        },
        {
            id: "vault",
            type: "protocol",
            position: {
                x: 280,
                y: 0
            },
            data: {
                kind: "vault",
                label: "Your sovereign vault",
                detail: `${c.beneficiaries.length} beneficiaries · isolated custody`
            }
        },
        {
            id: "heartbeat",
            type: "protocol",
            position: {
                x: 560,
                y: 0
            },
            data: {
                kind: "heartbeat",
                label: "Liveness condition",
                detail: `No check-in for ${secondsLabel(c.heartbeatInterval)}`
            }
        },
        {
            id: "guardians",
            type: "protocol",
            position: {
                x: 560,
                y: 190
            },
            data: {
                kind: "guardians",
                label: "Guardian approval",
                detail: c.guardianThreshold ? `${c.guardianThreshold} of ${c.guardians.length} signatures` : "No quorum · recovery disabled"
            }
        },
        {
            id: "challenge",
            type: "protocol",
            position: {
                x: 280,
                y: 190
            },
            data: {
                kind: "challenge",
                label: "Owner challenge",
                detail: `${secondsLabel(c.challengePeriod)} to respond`
            }
        },
        {
            id: "allowance",
            type: "protocol",
            position: {
                x: 0,
                y: 380
            },
            data: {
                kind: "allowance",
                label: "Scheduled allowance",
                detail: `${c.initialBps / 100}% initially · ${c.trancheBps / 100}% / ${secondsLabel(c.releaseInterval)}`
            }
        },
        {
            id: "emergency",
            type: "protocol",
            position: {
                x: 0,
                y: 570
            },
            data: {
                kind: "emergency",
                label: "Emergency release",
                detail: c.emergencyDelay ? `${secondsLabel(c.emergencyDelay)} + fresh guardian quorum` : "Accelerated release disabled"
            }
        },
        ...c.beneficiaries.map((b, i)=>({
                id: `beneficiary:${b.id}`,
                type: "protocol",
                position: {
                    x: 560,
                    y: 380 + i * 190
                },
                data: {
                    kind: "beneficiary",
                    beneficiaryId: b.id,
                    label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAddress"])(b.identity) ? shortAddress(b.identity) : b.identity || "New beneficiary",
                    detail: `${b.allocationBps / 100}% allocation · pinned address`
                }
            }))
    ];
    const pairs = [
        [
            "owner",
            "vault"
        ],
        [
            "vault",
            "heartbeat"
        ],
        [
            "heartbeat",
            "guardians"
        ],
        [
            "guardians",
            "challenge"
        ],
        [
            "challenge",
            "allowance"
        ],
        [
            "challenge",
            "emergency"
        ],
        ...c.beneficiaries.flatMap((b)=>[
                [
                    "allowance",
                    `beneficiary:${b.id}`
                ],
                [
                    "emergency",
                    `beneficiary:${b.id}`
                ]
            ])
    ];
    const issues = validateConfiguration(c, owner);
    return {
        nodes: nodes.map((n)=>({
                ...n,
                data: {
                    ...n.data,
                    invalid: issues.some((e)=>e.node === n.id)
                }
            })),
        edges: pairs.map(([source, target])=>({
                id: `${source}->${target}`,
                source,
                target,
                animated: true
            }))
    };
}
function validateGraph(c, graph, owner) {
    const errors = validateConfiguration(c, owner);
    const expected = buildGraph(c, owner);
    if (new Set(graph.nodes.map((n)=>n.id)).size !== graph.nodes.length) errors.push({
        node: "vault",
        message: "Duplicate node IDs are unsupported."
    });
    if (graph.nodes.length !== expected.nodes.length || graph.nodes.some((n)=>!expected.nodes.some((e)=>e.id === n.id && e.data.kind === n.data.kind && e.data.beneficiaryId === n.data.beneficiaryId))) errors.push({
        node: "vault",
        message: "Restore the required protocol nodes. Custom conditions cannot be enforced by this contract."
    });
    const edges = graph.edges.map((e)=>`${e.source}->${e.target}`).sort();
    const canonical = expected.edges.map((e)=>`${e.source}->${e.target}`).sort();
    if (JSON.stringify(edges) !== JSON.stringify(canonical)) errors.push({
        node: "vault",
        message: "Connections must preserve the owner, liveness, quorum, challenge and release paths. Use Auto-layout & restore to repair."
    });
    return errors;
}
function serializeConfiguration(c, graph = buildGraph(c), owner) {
    const issues = validateGraph(c, graph, owner);
    if (issues.length) throw new Error(issues.map((e)=>e.message).join(" "));
    return [
        c.beneficiaries.map((b)=>({
                account: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAddress"])(b.address),
                allocationBps: b.allocationBps
            })),
        c.guardians.map((g)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAddress"])(g)),
        {
            heartbeatInterval: BigInt(c.heartbeatInterval),
            challengePeriod: BigInt(c.challengePeriod),
            releaseInterval: BigInt(c.releaseInterval),
            emergencyDelay: BigInt(c.emergencyDelay),
            initialBps: c.initialBps,
            trancheBps: c.trancheBps,
            guardianThreshold: c.guardianThreshold
        }
    ];
}
}),
"[project]/lib/network.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chain",
    ()=>chain,
    "deploymentBlock",
    ()=>deploymentBlock,
    "environmentIssues",
    ()=>environmentIssues,
    "explorer",
    ()=>explorer,
    "factoryAddress",
    ()=>factoryAddress,
    "requestedChainId",
    ()=>requestedChainId,
    "rpcUrl",
    ()=>rpcUrl,
    "walletConfig",
    ()=>walletConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$createConfig$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/node_modules/@wagmi/core/dist/esm/createConfig.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/clients/transports/http.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$connectors$2f$injected$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/node_modules/@wagmi/core/dist/esm/connectors/injected.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$chain$2f$defineChain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/chain/defineChain.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/address/getAddress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/chains/definitions/sepolia.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/configuration.ts [app-ssr] (ecmascript)");
;
;
;
;
const local = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$chain$2f$defineChain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineChain"])({
    id: 31337,
    name: "Local test chain",
    nativeCurrency: {
        name: "Test Ether",
        symbol: "ETH",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "http://127.0.0.1:8545"
            ]
        }
    },
    testnet: true
});
const requestedChainId = Number(("TURBOPACK compile-time value", "31337") || 11155111);
const chain = requestedChainId === 31337 ? local : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sepolia"];
const rpcUrl = ("TURBOPACK compile-time value", "http://127.0.0.1:8545") || (requestedChainId === 31337 ? "http://127.0.0.1:8545" : "https://ethereum-sepolia-rpc.publicnode.com");
const factoryAddress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validAddress"])(("TURBOPACK compile-time value", "0x7a2e98591d2cabaf5bf2b5c8b826800c8bb83a9a") || "") ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAddress"])(("TURBOPACK compile-time value", "0x7a2e98591d2cabaf5bf2b5c8b826800c8bb83a9a")) : undefined;
const deploymentBlock = BigInt(/^\d+$/.test(("TURBOPACK compile-time value", "1") || "") ? ("TURBOPACK compile-time value", "1") : "0");
const environmentIssues = [
    ...![
        11155111,
        31337
    ].includes(requestedChainId) ? [
        "Only Sepolia (11155111) and local tests (31337) are supported."
    ] : [],
    ...!factoryAddress ? [
        "Contract not configured. Deploy SilentSovereignFactory in Remix, then set NEXT_PUBLIC_VAULT_FACTORY_ADDRESS in frontend/.env.local."
    ] : []
];
const walletConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$createConfig$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createConfig"])({
    chains: [
        chain
    ],
    connectors: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$connectors$2f$injected$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["injected"])({
            shimDisconnect: true
        })
    ],
    transports: {
        [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sepolia"].id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["http"])(rpcUrl),
        [local.id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["http"])(rpcUrl)
    },
    ssr: true
});
const explorer = (hash, kind = "tx")=>chain.blockExplorers ? `${chain.blockExplorers.default.url}/${kind}/${hash}` : undefined;
}),
"[project]/lib/privacy.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "anonEnabled",
    ()=>anonEnabled,
    "anonymousNetworks",
    ()=>anonymousNetworks,
    "noxSpecifier",
    ()=>noxSpecifier,
    "publicReadClient",
    ()=>publicReadClient,
    "startAnonymousClient",
    ()=>startAnonymousClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$track$2d$dynamic$2d$import$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/track-dynamic-import.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createPublicClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/clients/createPublicClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$custom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/clients/transports/custom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/clients/transports/http.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/network.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$mainnet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/chains/definitions/mainnet.js [app-ssr] (ecmascript)");
;
;
;
;
const anonEnabled = ("TURBOPACK compile-time value", "false") !== "false" && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id !== 31337;
const noxSpecifier = "0x35133267A8F7EC35046a83DCA0f4Ca8A6e1b7A9A";
const anonymousNetworks = {
    nox: {
        name: "Nox",
        address: noxSpecifier,
        chainId: 11155111
    },
    nym: {
        name: "Nym",
        address: "0x3aCD9742C68F6d993066Ae25533e09b9e1f60eD0",
        chainId: 1
    }
};
const anonymousRpcUrl = ("TURBOPACK compile-time value", "https://ethereum-sepolia-rpc.publicnode.com") || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rpcUrl"];
const READ_METHODS = new Set([
    "eth_chainId",
    "eth_call",
    "eth_getBalance",
    "eth_getCode",
    "eth_getLogs",
    "eth_blockNumber",
    "eth_getBlockByNumber",
    "eth_getBlockByHash",
    "eth_getTransactionReceipt",
    "eth_getTransactionByHash",
    "eth_getTransactionCount",
    "eth_estimateGas",
    "eth_gasPrice",
    "eth_maxPriorityFeePerGas",
    "eth_feeHistory"
]);
function publicReadClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createPublicClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPublicClient"])({
        chain: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"],
        transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["http"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rpcUrl"]),
        cacheTime: 0,
        ccipRead: false
    });
}
async function startAnonymousClient(onStatus, network = "nox") {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id !== 11155111) throw new Error("This verified Nox specifier is supported only on Sepolia.");
    const { AnonRpcWorker } = await /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$track$2d$dynamic$2d$import$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackDynamicImport"])(__turbopack_context__.A("[project]/node_modules/@anon-rpc/browser-harness/dist/host.js [app-ssr] (ecmascript, async loader)"));
    const selected = anonymousNetworks[network];
    const bootstrap = selected.chainId === 1 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createPublicClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPublicClient"])({
        chain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$mainnet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mainnet"],
        transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["http"])(("TURBOPACK compile-time value", "https://ethereum-rpc.publicnode.com") || "https://ethereum-rpc.publicnode.com")
    }) : publicReadClient();
    // The official harness owns integrity verification and the null-origin iframe / worker.
    const worker = new AnonRpcWorker({
        address: selected.address,
        preExisting: {
            rpcProvider: {
                request: async ({ method, params })=>bootstrap.request({
                        method,
                        params
                    })
            }
        }
    });
    const bounded = async (promise, ms)=>{
        let id;
        try {
            return await Promise.race([
                promise,
                new Promise((_, reject)=>{
                    id = setTimeout(()=>reject(new Error("Anon-RPC network timed out; public fallback is disabled.")), ms);
                })
            ]);
        } finally{
            clearTimeout(id);
        }
    };
    try {
        await bounded(worker.ready, 90000);
        let requestId = 0;
        let successfulRequests = 0;
        const provider = {
            request: async ({ method, params })=>{
                if (!READ_METHODS.has(method)) throw new Error("Signing and broadcasting are not permitted on the anonymous read client.");
                try {
                    const started = performance.now();
                    const response = await bounded(worker.fetch(anonymousRpcUrl, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            jsonrpc: "2.0",
                            id: ++requestId,
                            method,
                            params: params ?? []
                        }),
                        signal: AbortSignal.timeout(60000)
                    }), 65000);
                    if (!response.ok) throw new Error(`Anon-RPC upstream HTTP ${response.status}`);
                    const body = await response.json();
                    if (!body || typeof body !== "object" || body.jsonrpc !== "2.0" || !("result" in body || "error" in body)) throw new Error("Invalid JSON-RPC response from anonymizing network");
                    if (method === "eth_chainId" && body.result && Number(body.result) !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id) throw new Error("Anon-RPC returned the wrong chain.");
                    onStatus({
                        mode: "anonymous",
                        detail: `${selected.name} · hash-verified worker · no public fallback`,
                        lastVerifiedAt: new Date().toISOString(),
                        lastMethod: method,
                        latencyMs: Math.round(performance.now() - started),
                        successfulRequests: ++successfulRequests
                    });
                    if (body.error) throw Object.assign(new Error(body.error.message || "Anon-RPC JSON-RPC error"), {
                        code: typeof body.error.code === "number" ? body.error.code : -32000,
                        data: body.error.data,
                        rpcResponseError: true
                    });
                    if (!("result" in body)) throw new Error("Invalid JSON-RPC response from anonymizing network");
                    return body.result;
                } catch (error) {
                    // Contract reverts are application errors; they do not imply a transport downgrade.
                    if (!(error && typeof error === "object" && "rpcResponseError" in error && error.rpcResponseError === true)) onStatus({
                        mode: "failed",
                        detail: error instanceof Error ? error.message : String(error)
                    });
                    throw error;
                }
            }
        };
        const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createPublicClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPublicClient"])({
            chain: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"],
            batch: {
                multicall: {
                    batchSize: 4096,
                    wait: 20
                }
            },
            transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$custom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["custom"])(provider, {
                retryCount: 0
            }),
            cacheTime: 0,
            ccipRead: false
        });
        if (await client.getChainId() !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id) throw new Error("Anon-RPC returned the wrong chain.");
        return {
            client: client,
            close: ()=>worker.close()
        };
    } catch (error) {
        worker.close();
        throw error;
    }
}
}),
]})(),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/module-loading/track-module-loading.external.js [external] (next/dist/server/app-render/module-loading/track-module-loading.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/module-loading/track-module-loading.external.js", () => require("next/dist/server/app-render/module-loading/track-module-loading.external.js"));

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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1eteb_su-c1p5._.js.map