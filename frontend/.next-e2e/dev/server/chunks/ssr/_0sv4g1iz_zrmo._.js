(()=>{"use strict";module.exports = [
"[project]/components/protocol-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProtocolProvider",
    ()=>ProtocolProvider,
    "states",
    ()=>states,
    "useActivity",
    ()=>useActivity,
    "useProtocol",
    ()=>useProtocol,
    "useVaultQuery",
    ()=>useVaultQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useWalletClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$decodeEventLog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/abi/decodeEventLog.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/constants/abis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/address/getAddress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/constants/address.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignVault$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/generated/SilentSovereignVault.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/generated/SilentSovereignFactory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/network.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/transaction.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/configuration.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ens.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
const states = [
    "Active",
    "Recovery pending",
    "Recovery authorized",
    "Releasing",
    "Completed"
];
function useVaultQuery(selected) {
    const { address } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnection"])();
    const { client } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReadTransport"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "vault",
            address,
            selected,
            client?.uid
        ],
        enabled: !!client && !!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"] && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["environmentIssues"].length === 0 && (!!address || !!selected),
        refetchInterval: 15000,
        queryFn: async ()=>{
            if (!client || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"]) throw new Error("Contract not configured");
            if (await client.getChainId() !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id) throw new Error("The configured RPC serves the wrong network.");
            if (!await client.getBytecode({
                address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"]
            })) throw new Error("No factory contract exists at the configured address on this network.");
            const block = await client.getBlock();
            const blockNumber = block.number;
            const owned = address ? await client.readContract({
                address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"],
                abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SilentSovereignFactoryAbi"],
                functionName: "getVaults",
                args: [
                    address
                ],
                blockNumber
            }) : [];
            const vault = selected ?? owned.at(-1);
            if (!vault) return {
                owned,
                vault: undefined,
                blockNumber,
                timestamp: block.timestamp
            };
            if (!await client.readContract({
                address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"],
                abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SilentSovereignFactoryAbi"],
                functionName: "isVault",
                args: [
                    vault
                ],
                blockNumber
            })) throw new Error("This address is not a vault registered by the configured factory.");
            const read = {
                address: vault,
                abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignVault$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SilentSovereignVaultAbi"],
                blockNumber
            };
            const [owner, state, rules, beneficiaries, guardians, assetAddresses, deadline, pendingAt, authorizedAt, recoveryNonce, approvalCount, emergencyApprovalCount, paused, eligible] = await Promise.all([
                client.readContract({
                    ...read,
                    functionName: "owner"
                }),
                client.readContract({
                    ...read,
                    functionName: "state"
                }),
                client.readContract({
                    ...read,
                    functionName: "rules"
                }),
                client.readContract({
                    ...read,
                    functionName: "getBeneficiaries"
                }),
                client.readContract({
                    ...read,
                    functionName: "getGuardians"
                }),
                client.readContract({
                    ...read,
                    functionName: "getAssets"
                }),
                client.readContract({
                    ...read,
                    functionName: "deadline"
                }),
                client.readContract({
                    ...read,
                    functionName: "pendingAt"
                }),
                client.readContract({
                    ...read,
                    functionName: "authorizedAt"
                }),
                client.readContract({
                    ...read,
                    functionName: "recoveryNonce"
                }),
                client.readContract({
                    ...read,
                    functionName: "approvalCount"
                }),
                client.readContract({
                    ...read,
                    functionName: "emergencyApprovalCount"
                }),
                client.readContract({
                    ...read,
                    functionName: "recoveryPaused"
                }),
                client.readContract({
                    ...read,
                    functionName: "eligibleAction"
                })
            ]);
            const assets = await Promise.all(assetAddresses.map(async (asset)=>{
                const token = {
                    address: asset,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$abis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["erc20Abi"],
                    blockNumber
                };
                const [balance, accounted, snapshot, remaining, scheduled, emergency, decimals, symbol] = await Promise.all([
                    asset === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroAddress"] ? client.getBalance({
                        address: vault,
                        blockNumber
                    }) : client.readContract({
                        ...token,
                        functionName: "balanceOf",
                        args: [
                            vault
                        ]
                    }),
                    client.readContract({
                        ...read,
                        functionName: "accounted",
                        args: [
                            asset
                        ]
                    }),
                    client.readContract({
                        ...read,
                        functionName: "snapshot",
                        args: [
                            asset
                        ]
                    }),
                    client.readContract({
                        ...read,
                        functionName: "remaining",
                        args: [
                            asset
                        ]
                    }),
                    client.readContract({
                        ...read,
                        functionName: "claimable",
                        args: [
                            address ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroAddress"],
                            asset,
                            false
                        ]
                    }),
                    client.readContract({
                        ...read,
                        functionName: "claimable",
                        args: [
                            address ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroAddress"],
                            asset,
                            true
                        ]
                    }),
                    asset === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroAddress"] ? 18 : client.readContract({
                        ...token,
                        functionName: "decimals"
                    }),
                    asset === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroAddress"] ? "ETH" : client.readContract({
                        ...token,
                        functionName: "symbol"
                    })
                ]);
                return {
                    address: asset,
                    balance,
                    accounted,
                    snapshot,
                    remaining,
                    scheduled,
                    emergency,
                    decimals,
                    symbol: symbol.slice(0, 20)
                };
            }));
            const config = {
                beneficiaries: beneficiaries.map((b, i)=>({
                        id: String(i),
                        identity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rememberedIdentity"])(b.account, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id),
                        resolvedIdentity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rememberedIdentity"])(b.account, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id) === b.account ? undefined : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rememberedIdentity"])(b.account, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id),
                        address: b.account,
                        allocationBps: b.allocationBps
                    })),
                guardians: [
                    ...guardians
                ],
                heartbeatInterval: Number(rules[0]),
                challengePeriod: Number(rules[1]),
                releaseInterval: Number(rules[2]),
                emergencyDelay: Number(rules[3]),
                initialBps: rules[4],
                trancheBps: rules[5],
                guardianThreshold: rules[6]
            };
            const [hasApproved, hasEmergencyApproved] = address ? await Promise.all([
                client.readContract({
                    ...read,
                    functionName: "approved",
                    args: [
                        recoveryNonce,
                        address
                    ]
                }),
                client.readContract({
                    ...read,
                    functionName: "emergencyApproved",
                    args: [
                        recoveryNonce,
                        address
                    ]
                })
            ]) : [
                false,
                false
            ];
            return {
                owned,
                vault,
                blockNumber,
                timestamp: block.timestamp,
                owner,
                state,
                config,
                assets,
                deadline,
                pendingAt,
                authorizedAt,
                recoveryNonce,
                approvalCount,
                emergencyApprovalCount,
                paused,
                eligible,
                hasApproved,
                hasEmergencyApproved
            };
        }
    });
}
const ProtocolContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function useProtocol() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ProtocolContext);
    if (!context) throw new Error("Protocol provider missing");
    return context;
}
function ProtocolProvider({ children }) {
    const [selected, select] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fromFragment = ()=>{
            const value = new URLSearchParams(window.location.hash.slice(1)).get("vault");
            if (value && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validAddress"])(value)) select((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAddress"])(value));
        };
        fromFragment();
        window.addEventListener("hashchange", fromFragment);
        return ()=>window.removeEventListener("hashchange", fromFragment);
    }, []);
    const query = useVaultQuery(selected);
    const [transaction, setTransaction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        phase: "idle"
    });
    const busy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const { address, chainId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnection"])();
    const { data: wallet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWalletClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWalletClient"])();
    const { client } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReadTransport"])();
    const cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const execute = async (label, request)=>{
        if (busy.current) return false;
        busy.current = true;
        setTransaction({
            phase: "signing",
            label
        });
        try {
            if (!wallet || !address) throw new Error("Connect your wallet to continue.");
            if (chainId !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id) throw new Error(`Wrong network. Switch your wallet to ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].name}.`);
            if (!client) throw new Error("Read transport is unavailable. Check Privacy & integrations.");
            if (await client.getChainId() !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id) throw new Error("The read RPC serves the wrong network. Correct its URL before signing.");
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["environmentIssues"].length) throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["environmentIssues"].join(" "));
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validAddress"])(request.to)) throw new Error("Invalid transaction destination.");
            const destinationCode = await client.getBytecode({
                address: request.to
            });
            if (!destinationCode || destinationCode === "0x") throw new Error("No deployed contract exists at this destination on the selected network. Check configuration before signing.");
            if (request.to === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"]) await client.readContract({
                address: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"],
                abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SilentSovereignFactoryAbi"],
                functionName: "vaultCount"
            });
            setTransaction({
                phase: "signing",
                label
            });
            // Simulate against real state before requesting a signature. Reads use the selected transport.
            await client.call({
                account: address,
                ...request
            });
            const estimatedGas = await client.estimateGas({
                account: address,
                ...request
            });
            const hash = await wallet.sendTransaction({
                account: address,
                chain: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"],
                ...request,
                gas: estimatedGas + estimatedGas / 5n
            });
            setTransaction({
                phase: "confirming",
                hash,
                label
            });
            let cancelled = false;
            let confirmedReceipt;
            const confirmed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["confirmTransaction"])(hash, async (hash)=>{
                const receipt = await client.waitForTransactionReceipt({
                    hash,
                    confirmations: 1,
                    timeout: 180000,
                    onReplaced: (replacement)=>{
                        cancelled = replacement.reason !== "repriced";
                        setTransaction({
                            phase: "confirming",
                            label,
                            hash: replacement.transaction.hash
                        });
                    }
                });
                if (cancelled) throw new Error("This transaction was cancelled in your wallet. The requested operation was not completed.");
                confirmedReceipt = receipt;
                return receipt;
            });
            if (request.to === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"] && confirmedReceipt) {
                let verifiedCreation = false;
                for (const log of confirmedReceipt.logs){
                    if (log.address.toLowerCase() !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["factoryAddress"]?.toLowerCase()) continue;
                    try {
                        const event = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$decodeEventLog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeEventLog"])({
                            abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SilentSovereignFactoryAbi"],
                            data: log.data,
                            topics: log.topics
                        });
                        if (event.eventName === "VaultCreated" && event.args.owner.toLowerCase() === address.toLowerCase()) {
                            verifiedCreation = true;
                            select((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAddress"])(event.args.vault));
                        }
                    } catch  {
                    /* Other logs are not factory creation events. */ }
                }
                if (!verifiedCreation) throw new Error("The transaction was mined, but no matching vault creation event was verified. Inspect its receipt and factory configuration before retrying.");
            }
            await Promise.allSettled([
                cache.invalidateQueries({
                    queryKey: [
                        "vault"
                    ]
                }),
                cache.invalidateQueries({
                    queryKey: [
                        "activity"
                    ]
                })
            ]);
            setTransaction({
                ...confirmed,
                label
            });
            return true;
        } catch (error) {
            setTransaction((t)=>({
                    ...t,
                    phase: "failed",
                    label,
                    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transactionError"])(error)
                }));
            return false;
        } finally{
            busy.current = false;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProtocolContext.Provider, {
        value: {
            selected,
            select,
            query,
            transaction,
            execute,
            dismissTransaction: ()=>{
                if (!busy.current) setTransaction({
                    phase: "idle"
                });
            }
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/protocol-provider.tsx",
        lineNumber: 409,
        columnNumber: 5
    }, this);
}
function useActivity(vault, earlierBlocks = 0) {
    const { client } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReadTransport"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "activity",
            vault,
            earlierBlocks,
            client?.uid
        ],
        enabled: !!client && !!vault,
        refetchInterval: 20000,
        queryFn: async ()=>{
            if (!client || !vault) throw new Error("Select a vault first.");
            const latest = await client.getBlockNumber();
            const window1 = BigInt(10000 + earlierBlocks);
            const start = latest > window1 ? latest - window1 : 0n;
            const from = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deploymentBlock"] > start ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deploymentBlock"] : start;
            const events = [];
            // Bounded chunks work with providers that reject broad eth_getLogs scans.
            for(let block = from; block <= latest; block += 2000n){
                const toBlock = block + 1999n < latest ? block + 1999n : latest;
                const logs = await client.getContractEvents({
                    address: vault,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generated$2f$SilentSovereignVault$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SilentSovereignVaultAbi"],
                    fromBlock: block,
                    toBlock
                });
                events.push(...logs);
            }
            return {
                events: events.reverse(),
                from,
                latest
            };
        }
    });
}
}),
"[project]/components/shell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Shell",
    ()=>Shell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.mjs [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs [app-ssr] (ecmascript) <export default as CircleHelp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fingerprint$2d$pattern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Fingerprint$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/fingerprint-pattern.mjs [app-ssr] (ecmascript) <export default as Fingerprint>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-branch.mjs [app-ssr] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$keyhole$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockKeyhole$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock-keyhole.mjs [app-ssr] (ecmascript) <export default as LockKeyhole>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.mjs [app-ssr] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vault$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Vault$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/vault.mjs [app-ssr] (ecmascript) <export default as Vault>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$protocol$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/protocol-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/network.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const navigation = [
    [
        "/dashboard",
        "Overview",
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    ],
    [
        "/vault",
        "My vault",
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vault$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Vault$3e$__["Vault"]
    ],
    [
        "/builder",
        "Inheritance builder",
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"]
    ],
    [
        "/beneficiaries",
        "Beneficiaries",
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
    ],
    [
        "/recovery",
        "Liveness & recovery",
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"]
    ],
    [
        "/activity",
        "Activity",
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    ],
    [
        "/notifications",
        "Email alerts",
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    ]
];
function ShellContent({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [menu, setMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { privacy } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReadTransport"])();
    const { transaction, dismissTransaction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$protocol$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProtocol"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `sidebar ${menu ? "mobile-open" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Brand"], {}, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button mobile-only",
                                onClick: ()=>setMenu(false),
                                "aria-label": "Close navigation",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/components/shell.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "workspace-selector",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "workspace-avatar",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$keyhole$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockKeyhole$3e$__["LockKeyhole"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/components/shell.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Personal workspace",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: "Testnet environment"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 60,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "nav-label",
                        children: "WORKSPACE"
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        children: navigation.map(([href, label, Icon])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                onClick: ()=>setMenu(false),
                                className: `nav-item ${pathname === href ? "active" : ""}`,
                                href: href,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        size: 17,
                                        strokeWidth: 1.7
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this),
                                    label,
                                    href === "/builder" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-new",
                                        children: "VISUAL"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 75,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, href, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "nav-label second",
                        children: "PROTOCOL"
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                className: `nav-item ${pathname === "/privacy" ? "active" : ""}`,
                                href: "/privacy",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fingerprint$2d$pattern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Fingerprint$3e$__["Fingerprint"], {
                                        size: 17
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this),
                                    "Privacy & integrations"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                className: `nav-item ${pathname === "/settings" ? "active" : ""}`,
                                href: "/settings",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                                        size: 17
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    "Settings"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-bottom",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "quiet-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Sovereignty is a plan."
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Give the people you trust a path forward."
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/create",
                                        children: [
                                            "Create an inheritance plan ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                                size: 13
                                            }, void 0, false, {
                                                fileName: "[project]/components/shell.tsx",
                                                lineNumber: 102,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                className: "nav-item",
                                href: "/settings",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__["CircleHelp"], {
                                        size: 17
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this),
                                    "Setup & documentation"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-footer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "status-dot"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this),
                                    " ETHGlobal Mumbai 2026",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "v0.1"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shell.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "app-main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "app-topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "breadcrumb",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "icon-button mobile-only",
                                        onClick: ()=>setMenu(true),
                                        "aria-label": "Open navigation",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/components/shell.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Workspace"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: [
                                            ...navigation.map((n)=>[
                                                    n[0],
                                                    n[1]
                                                ]),
                                            [
                                                "/privacy",
                                                "Privacy & integrations"
                                            ],
                                            [
                                                "/settings",
                                                "Settings"
                                            ],
                                            [
                                                "/create",
                                                "Create a vault"
                                            ]
                                        ].find((n)=>n[0] === pathname)?.[1] || "Workspace"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "topbar-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/privacy",
                                        className: "transport-indicator",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `status-dot ${privacy.mode === "anonymous" ? "green-dot" : "amber-dot"}`
                                            }, void 0, false, {
                                                fileName: "[project]/components/shell.tsx",
                                                lineNumber: 138,
                                                columnNumber: 15
                                            }, this),
                                            privacy.mode === "anonymous" ? "Anon-RPC" : privacy.mode === "public" ? "Public RPC" : privacy.mode === "failed" ? "RPC unavailable" : "Connecting RPC"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        tone: "violet",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].name
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WalletButton"], {}, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: `workspace-content ${pathname === "/builder" ? "builder-content" : ""}`,
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "app-footer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$keyhole$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockKeyhole$3e$__["LockKeyhole"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, this),
                                    " Noncustodial by design"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Unaudited · Testnet only"
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shell.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            transaction.phase !== "idle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `transaction-toast ${transaction.phase}`,
                role: "status",
                "aria-live": "polite",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: transaction.label
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                tone: transaction.phase === "confirmed" ? "green" : transaction.phase === "failed" ? "red" : "violet",
                                children: transaction.phase
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            (transaction.phase === "confirmed" || transaction.phase === "failed") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                "aria-label": "Dismiss transaction notification",
                                onClick: dismissTransaction,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/components/shell.tsx",
                                    lineNumber: 191,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 186,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 171,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: transaction.phase === "signing" ? "Check the details and approve in your wallet." : transaction.phase === "confirming" ? "Waiting for an onchain receipt…" : transaction.phase === "confirmed" ? `Confirmed in block ${transaction.block?.toString()}.` : transaction.error
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    transaction.hash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["External"], {
                        hash: transaction.hash,
                        children: "View transaction"
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 205,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shell.tsx",
                lineNumber: 166,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/shell.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function Shell({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$protocol$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProtocolProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ShellContent, {
            children: children
        }, void 0, false, {
            fileName: "[project]/components/shell.tsx",
            lineNumber: 215,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shell.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "Brand",
    ()=>Brand,
    "Empty",
    ()=>Empty,
    "External",
    ()=>External,
    "Field",
    ()=>Field,
    "Notice",
    ()=>Notice,
    "PageHeader",
    ()=>PageHeader,
    "Panel",
    ()=>Panel,
    "StepIcon",
    ()=>StepIcon,
    "WalletButton",
    ()=>WalletButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.mjs [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as CircleAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-ssr] (ecmascript) <export default as LoaderCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.mjs [app-ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnectors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnectors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useConnection.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useDisconnect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useDisconnect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wagmi/dist/esm/hooks/useSwitchChain.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/network.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/configuration.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/transaction.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function Brand({ compact = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: "/",
        className: "brand",
        "aria-label": "SilentSovereign home",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "brand-mark",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                    size: 22,
                    strokeWidth: 1.7
                }, void 0, false, {
                    fileName: "[project]/components/ui.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    "Silent",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "brand-light",
                        children: "Sovereign"
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        children: "A FUTURE, PROTECTED"
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function Badge({ children, tone = "neutral" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `badge ${tone}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "status-dot"
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
function Panel({ title, description, action, children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `panel ${className}`,
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "panel-heading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/ui.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/components/ui.tsx",
                                lineNumber: 79,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    action
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
function PageHeader({ eyebrow, title, description, action }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-heading",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "eyebrow",
                        children: eyebrow || "YOUR LEGACY, BY DESIGN"
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            action
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
function Empty({ icon, title, description, action }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "empty-state",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "empty-icon",
                children: icon || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                    size: 27,
                    strokeWidth: 1.4
                }, void 0, false, {
                    fileName: "[project]/components/ui.tsx",
                    lineNumber: 124,
                    columnNumber: 18
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: title
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: description
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            action
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
function Notice({ children, danger = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `notice ${danger ? "danger" : ""}`,
        role: danger ? "alert" : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleAlert$3e$__["CircleAlert"], {
                size: 17
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
function Field({ label, children, hint }) {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const control = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(children) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(children, {
        "aria-labelledby": `${id}-label`,
        "aria-describedby": hint ? `${id}-hint` : undefined
    }) : children;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "field",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                id: `${id}-label`,
                children: label
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this),
            control,
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                id: `${id}-hint`,
                children: hint
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 175,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 172,
        columnNumber: 5
    }, this);
}
function External({ hash, kind = "tx", children }) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["explorer"])(hash, kind);
    return url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        className: "inline-link",
        href: url,
        target: "_blank",
        rel: "noreferrer",
        children: [
            children || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shortAddress"])(hash),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                size: 13
            }, void 0, false, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 190,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "mono",
        children: children || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shortAddress"])(hash)
    }, void 0, false, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
function WalletButton() {
    const { address, chainId, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnection"])();
    const connectors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnectors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnectors"])();
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useConnect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnect"])();
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useDisconnect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDisconnect"])();
    const switchChain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useSwitchChain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSwitchChain"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "wallet-control",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: isConnected ? "button wallet-button" : "button primary",
                onClick: ()=>setOpen(!open),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this),
                    isConnected ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shortAddress"])(address) : "Connect wallet"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "wallet-popover",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: isConnected ? "Your wallet" : "Connect securely"
                            }, void 0, false, {
                                fileName: "[project]/components/ui.tsx",
                                lineNumber: 218,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "icon-button",
                                "aria-label": "Close wallet menu",
                                onClick: ()=>setOpen(false),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/components/ui.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ui.tsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Your wallet keeps control of every signature."
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 227,
                        columnNumber: 11
                    }, this),
                    isConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "address-wrap mono",
                                children: address
                            }, void 0, false, {
                                fileName: "[project]/components/ui.tsx",
                                lineNumber: 230,
                                columnNumber: 15
                            }, this),
                            chainId !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "button primary full",
                                onClick: async ()=>{
                                    try {
                                        await switchChain.mutateAsync({
                                            chainId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].id
                                        });
                                        setError("");
                                    } catch (e) {
                                        setError((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transactionError"])(e));
                                    }
                                },
                                children: [
                                    "Switch to ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui.tsx",
                                lineNumber: 232,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "button full",
                                onClick: ()=>{
                                    disconnect.mutate();
                                    setOpen(false);
                                },
                                children: "Disconnect wallet"
                            }, void 0, false, {
                                fileName: "[project]/components/ui.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 229,
                        columnNumber: 13
                    }, this) : connectors.map((connector)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "button full",
                            disabled: connect.isPending,
                            onClick: async ()=>{
                                try {
                                    await connect.mutateAsync({
                                        connector
                                    });
                                    setOpen(false);
                                    setError("");
                                } catch (e) {
                                    setError((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$transaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transactionError"])(e));
                                }
                            },
                            children: [
                                connect.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__["LoaderCircle"], {
                                    className: "spin",
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/components/ui.tsx",
                                    lineNumber: 273,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/components/ui.tsx",
                                    lineNumber: 275,
                                    columnNumber: 19
                                }, this),
                                connector.name === "Injected" ? "Browser wallet" : connector.name
                            ]
                        }, connector.uid, true, {
                            fileName: "[project]/components/ui.tsx",
                            lineNumber: 258,
                            columnNumber: 15
                        }, this)),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "error-text",
                        role: "alert",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 284,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        children: [
                            "Use an EIP-1193 browser wallet. ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$network$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chain"].name,
                            " testnet only."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}
function StepIcon({ done, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `step-icon ${done ? "done" : ""}`,
        children: done ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
            size: 15
        }, void 0, false, {
            fileName: "[project]/components/ui.tsx",
            lineNumber: 305,
            columnNumber: 15
        }, this) : children
    }, void 0, false, {
        fileName: "[project]/components/ui.tsx",
        lineNumber: 304,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/ens.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addressRecordCall",
    ()=>addressRecordCall,
    "ensV2Root",
    ()=>ensV2Root,
    "ethAddressResource",
    ()=>ethAddressResource,
    "findSubregistry",
    ()=>findSubregistry,
    "inspectIdentity",
    ()=>inspectIdentity,
    "registryAbi",
    ()=>registryAbi,
    "registryEntry",
    ()=>registryEntry,
    "rememberIdentity",
    ()=>rememberIdentity,
    "rememberedIdentity",
    ()=>rememberedIdentity,
    "resolverAbi",
    ()=>resolverAbi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/address/getAddress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/address/isAddress.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$abitype$2f$dist$2f$esm$2f$human$2d$readable$2f$parseAbi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/abitype/dist/esm/human-readable/parseAbi.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/constants/address.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$encodeFunctionData$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/abi/encodeFunctionData.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$encodeAbiParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/abi/encodeAbiParameters.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$hash$2f$keccak256$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/hash/keccak256.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$encoding$2f$toHex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/encoding/toHex.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/ens/normalize.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$packetToBytes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/ens/packetToBytes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/configuration.ts [app-ssr] (ecmascript)");
;
;
;
const registryAbi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$abitype$2f$dist$2f$esm$2f$human$2d$readable$2f$parseAbi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseAbi"])([
    "function getSubregistry(string label) view returns (address)",
    "function findOwner(string label) view returns (address)",
    "function findExpiry(string label) view returns (uint64)",
    "function hasRootRoles(uint256 roleBitmap, address account) view returns (bool)",
    "function hasRoles(uint256 resource,uint256 roleBitmap,address account) view returns (bool)",
    "function register(string label,address owner,address registry,address resolver,uint256 roleBitmap,uint64 expiry) returns (uint256)"
]);
const resolverAbi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$abitype$2f$dist$2f$esm$2f$human$2d$readable$2f$parseAbi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseAbi"])([
    "function setAddress(bytes name,uint256 coinType,bytes value)",
    "function grantSetterRoles(bytes setter,address account)",
    "function revokeRoles(uint256 resource,uint256 roleBitmap,address account)",
    "function hasRootRoles(uint256 roleBitmap,address account) view returns (bool)",
    "function hasRoles(uint256 resource,uint256 roleBitmap,address account) view returns (bool)"
]);
const ethAddressResource = BigInt((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$hash$2f$keccak256$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keccak256"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$encodeAbiParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodeAbiParameters"])([
    {
        type: "uint256"
    }
], [
    60n
])));
function addressRecordCall(name, account) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$abi$2f$encodeFunctionData$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodeFunctionData"])({
        abi: resolverAbi,
        functionName: "setAddress",
        args: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$encoding$2f$toHex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$packetToBytes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["packetToBytes"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(name))),
            60n,
            account
        ]
    });
}
async function registryEntry(client, name) {
    const labels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(name).split(".");
    const label = labels[0];
    const parent = labels.slice(1).join(".");
    const registry = parent ? await findSubregistry(client, parent) : await ensV2Root(client);
    const [owner, expiry] = await Promise.all([
        client.readContract({
            address: registry,
            abi: registryAbi,
            functionName: "findOwner",
            args: [
                label
            ]
        }),
        client.readContract({
            address: registry,
            abi: registryAbi,
            functionName: "findExpiry",
            args: [
                label
            ]
        })
    ]);
    return {
        registry,
        owner,
        expiry
    };
}
function rememberIdentity(name, account, chainId) {
    // Local labels are advisory. They never replace an onchain beneficiary address.
    try {
        localStorage.setItem(`silent:identity:${chainId}:${account.toLowerCase()}`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(name));
    } catch  {
    /* Storage is optional. */ }
}
function rememberedIdentity(account, chainId) {
    try {
        return localStorage.getItem(`silent:identity:${chainId}:${account.toLowerCase()}`) || account;
    } catch  {
        return account;
    }
}
const universalAbi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$abitype$2f$dist$2f$esm$2f$human$2d$readable$2f$parseAbi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseAbi"])([
    "function ROOT_REGISTRY() view returns (address)",
    "function isENSv2() view returns (bool)"
]);
async function ensV2Root(client) {
    const universal = client.chain.contracts?.ensUniversalResolver?.address;
    if (!universal || client.chain.id !== 11155111) throw new Error("ENSv2 integration is configured for Sepolia only.");
    const v2 = await client.readContract({
        address: universal,
        abi: universalAbi,
        functionName: "isENSv2"
    });
    if (!v2) throw new Error("This Universal Resolver does not report ENSv2 support.");
    return client.readContract({
        address: universal,
        abi: universalAbi,
        functionName: "ROOT_REGISTRY"
    });
}
async function findSubregistry(client, parent) {
    let registry = await ensV2Root(client);
    for (const label of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(parent).split(".").reverse()){
        registry = await client.readContract({
            address: registry,
            abi: registryAbi,
            functionName: "getSubregistry",
            args: [
                label
            ]
        });
        if (registry === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$constants$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroAddress"]) throw new Error(`${parent} has no active ENSv2 subregistry. Its owner must create and attach one using Sepolia ENS Explorer first.`);
    }
    return registry;
}
async function inspectIdentity(client, input) {
    if (client.chain.id !== 11155111) throw new Error("ENS lookup is supported on Sepolia; local tests use addresses.");
    const name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAddress"])(input) ? await client.getEnsName({
        address: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAddress"])(input)
    }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(input);
    if (!name) return {
        address: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAddress"])(input),
        name: null,
        resolver: undefined,
        owner: undefined,
        version: "Unknown"
    };
    const address = await client.getEnsAddress({
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(name)
    });
    if (!address || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$configuration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validAddress"])(address)) throw new Error("This name has no Ethereum address record. Add an address record in its resolver first.");
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAddress"])(input) && address.toLowerCase() !== input.toLowerCase()) throw new Error("Primary name failed forward verification.");
    const resolver = await client.getEnsResolver({
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(name)
    });
    let owner;
    let version = "ENS · Universal Resolver";
    try {
        const labels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(name).split(".");
        const parent = labels.slice(1).join(".");
        const registry = parent ? await findSubregistry(client, parent) : await ensV2Root(client);
        owner = await client.readContract({
            address: registry,
            abi: registryAbi,
            functionName: "findOwner",
            args: [
                labels[0]
            ]
        });
        version = "ENSv2 · verified registry";
    } catch  {
    /* Migrated and legacy names may resolve without a v2 ownership entry. */ }
    return {
        address,
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$ens$2f$normalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalize"])(name),
        resolver,
        owner,
        version
    };
}
}),
"[project]/lib/generated/SilentSovereignFactory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Generated by npm run compile. Do not hand edit.
__turbopack_context__.s([
    "SilentSovereignFactoryAbi",
    ()=>SilentSovereignFactoryAbi
]);
const SilentSovereignFactoryAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "vault",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "VaultCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint16",
                        "name": "allocationBps",
                        "type": "uint16"
                    }
                ],
                "internalType": "struct SilentSovereignVault.Beneficiary[]",
                "name": "beneficiaries",
                "type": "tuple[]"
            },
            {
                "internalType": "address[]",
                "name": "guardians",
                "type": "address[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint64",
                        "name": "heartbeatInterval",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "challengePeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "releaseInterval",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "emergencyDelay",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint16",
                        "name": "initialBps",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "trancheBps",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint8",
                        "name": "guardianThreshold",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct SilentSovereignVault.Rules",
                "name": "rules",
                "type": "tuple"
            }
        ],
        "name": "createVault",
        "outputs": [
            {
                "internalType": "address",
                "name": "vault",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "getVaults",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isVault",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "vaultAt",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "vaultCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
}),
"[project]/lib/generated/SilentSovereignVault.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Generated by npm run compile. Do not hand edit.
__turbopack_context__.s([
    "SilentSovereignVaultAbi",
    ()=>SilentSovereignVaultAbi
]);
const SilentSovereignVaultAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner_",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint16",
                        "name": "allocationBps",
                        "type": "uint16"
                    }
                ],
                "internalType": "struct SilentSovereignVault.Beneficiary[]",
                "name": "beneficiaries_",
                "type": "tuple[]"
            },
            {
                "internalType": "address[]",
                "name": "guardians_",
                "type": "address[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint64",
                        "name": "heartbeatInterval",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "challengePeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "releaseInterval",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "emergencyDelay",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint16",
                        "name": "initialBps",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "trancheBps",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint8",
                        "name": "guardianThreshold",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct SilentSovereignVault.Rules",
                "name": "rules_",
                "type": "tuple"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "InvalidAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidConfiguration",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidState",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotEligible",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NothingToClaim",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TransferFailed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Unauthorized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UnsupportedAsset",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "asset",
                "type": "address"
            }
        ],
        "name": "AssetSupported",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "emergency",
                "type": "bool"
            }
        ],
        "name": "Claimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "configHash",
                "type": "bytes32"
            }
        ],
        "name": "ConfigurationUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Deposited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "guardian",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "emergency",
                "type": "bool"
            }
        ],
        "name": "GuardianApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "Heartbeat",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "paused",
                "type": "bool"
            }
        ],
        "name": "RecoveryPaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "challengeEnds",
                "type": "uint256"
            }
        ],
        "name": "RecoveryRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "SnapshotTaken",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "enum SilentSovereignVault.State",
                "name": "previousState",
                "type": "uint8"
            },
            {
                "indexed": true,
                "internalType": "enum SilentSovereignVault.State",
                "name": "newState",
                "type": "uint8"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "name": "StateChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdrawn",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "accounted",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "addSupportedToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "approvalCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "emergency",
                "type": "bool"
            }
        ],
        "name": "approveRecovery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "approved",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "authorizedAt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "cancelRecovery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "emergency",
                "type": "bool"
            }
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "emergency",
                "type": "bool"
            }
        ],
        "name": "claimable",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "claimed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint16",
                        "name": "allocationBps",
                        "type": "uint16"
                    }
                ],
                "internalType": "struct SilentSovereignVault.Beneficiary[]",
                "name": "b",
                "type": "tuple[]"
            },
            {
                "internalType": "address[]",
                "name": "g",
                "type": "address[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint64",
                        "name": "heartbeatInterval",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "challengePeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "releaseInterval",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "emergencyDelay",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint16",
                        "name": "initialBps",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "trancheBps",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint8",
                        "name": "guardianThreshold",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct SilentSovereignVault.Rules",
                "name": "r",
                "type": "tuple"
            }
        ],
        "name": "configure",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deadline",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "depositNative",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "depositToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eligibleAction",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyApprovalCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "emergencyApproved",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "asset",
                "type": "address"
            }
        ],
        "name": "entitlement",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "finalizeRecovery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAssets",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBeneficiaries",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint16",
                        "name": "allocationBps",
                        "type": "uint16"
                    }
                ],
                "internalType": "struct SilentSovereignVault.Beneficiary[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGuardians",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "heartbeat",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isGuardian",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastHeartbeat",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pendingAt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "action",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "expectedNonce",
                "type": "uint256"
            }
        ],
        "name": "performUpkeep",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "recoveryNonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "recoveryPaused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "remaining",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "requestRecovery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rules",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "heartbeatInterval",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "challengePeriod",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "releaseInterval",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "emergencyDelay",
                "type": "uint64"
            },
            {
                "internalType": "uint16",
                "name": "initialBps",
                "type": "uint16"
            },
            {
                "internalType": "uint16",
                "name": "trancheBps",
                "type": "uint16"
            },
            {
                "internalType": "uint8",
                "name": "guardianThreshold",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "paused",
                "type": "bool"
            }
        ],
        "name": "setRecoveryPaused",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "snapshot",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "state",
        "outputs": [
            {
                "internalType": "enum SilentSovereignVault.State",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "supportedToken",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "vestedBps",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "asset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];
}),
"[project]/lib/transaction.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "confirmTransaction",
    ()=>confirmTransaction,
    "transactionError",
    ()=>transactionError
]);
function transactionError(error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/reject|denied|4001/i.test(message)) return "You declined the request in your wallet. No transaction was confirmed.";
    if (/insufficient funds|exceeds.*balance/i.test(message)) return "Your wallet needs more test ETH to cover this amount and network fees.";
    if (/chain|network/i.test(message) && /wrong|mismatch|switch/i.test(message)) return "Switch your wallet to the supported network and try again.";
    if (/timeout|timed out/i.test(message)) return "Confirmation timed out. Check the transaction in the explorer before retrying.";
    return message.split("\n").filter(Boolean).slice(0, 2).join(" ").slice(0, 500);
}
async function confirmTransaction(hash, wait) {
    const receipt = await wait(hash);
    if (receipt.status !== "success") throw new Error("The transaction reverted. No requested changes were applied.");
    return {
        phase: "confirmed",
        hash: receipt.transactionHash,
        block: receipt.blockNumber
    };
}
}),
];})()

//# sourceMappingURL=_0sv4g1iz_zrmo._.js.map