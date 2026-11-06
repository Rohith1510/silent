"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConfig } from "@/lib/network";
import {
  anonEnabled,
  publicReadClient,
  startAnonymousClient,
  type PrivacyStatus,
  type ReadClient,
  type AnonymousNetwork,
  anonymousNetworks,
} from "@/lib/privacy";

const ReadContext = createContext<{
  client?: ReadClient;
  privacy: PrivacyStatus;
  network: AnonymousNetwork;
  retry: () => void;
  chooseAnonymous: (network: AnonymousNetwork) => void;
  choosePublic: () => void;
}>({
  privacy: { mode: "starting", detail: "Initializing read transport" },
  network: "nox",
  retry: () => {},
  chooseAnonymous: () => {},
  choosePublic: () => {},
});
export const useReadTransport = () => useContext(ReadContext);
function ReadProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"anonymous" | "public">(
    anonEnabled ? "anonymous" : "public",
  );
  const [network, setNetwork] = useState<AnonymousNetwork>("nox");
  const [attempt, setAttempt] = useState(0);
  const [transport, setTransport] = useState<{
    client?: ReadClient;
    privacy: PrivacyStatus;
  }>(() =>
    anonEnabled
      ? {
          privacy: {
            mode: "starting",
            detail: "Starting the official Nox browser worker…",
          },
        }
      : {
          client: publicReadClient(),
          privacy: {
            mode: "public",
            detail: "Public RPC · network metadata is visible",
          },
        },
  );
  useEffect(() => {
    let disposed = false;
    let close: (() => void) | undefined;
    if (mode === "public") return;
    const status = (privacy: PrivacyStatus) => {
      if (!disposed) setTransport((t) => ({ ...t, privacy }));
    };
    startAnonymousClient(status, network)
      .then((result) => {
        close = result.close;
        if (disposed) return close();
        setTransport((t) => ({ ...t, client: result.client }));
      })
      .catch((error) => {
        if (!disposed)
          setTransport({ privacy: { mode: "failed", detail: String(error) } });
      });
    return () => {
      disposed = true;
      close?.();
    };
  }, [mode, network, attempt]);
  const choosePublic = () => {
    setMode("public");
    setAttempt((a) => a + 1);
    setTransport({
      client: publicReadClient(),
      privacy: {
        mode: "public",
        detail:
          "Public RPC selected explicitly · source IP and query metadata may be visible",
      },
    });
  };
  const chooseAnonymous = (value: AnonymousNetwork) => {
    setTransport({
      privacy: {
        mode: "starting",
        detail: `Connecting to ${anonymousNetworks[value].name}. App reads wait for a real chain response.`,
      },
    });
    setNetwork(value);
    setMode("anonymous");
    setAttempt((a) => a + 1);
  };
  return (
    <ReadContext.Provider
      value={{
        ...transport,
        network,
        retry: () => chooseAnonymous(network),
        choosePublic,
        chooseAnonymous,
      }}
    >
      {children}
    </ReadContext.Provider>
  );
}
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      }),
  );
  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <ReadProvider>{children}</ReadProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
