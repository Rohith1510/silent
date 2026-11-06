// Standalone read-only integration probe; never signs or broadcasts.
import {
  publicReadClient,
  startAnonymousClient,
} from "../frontend/lib/privacy";
import { ensV2Root, inspectIdentity } from "../frontend/lib/ens";
import { factoryAddress } from "../frontend/lib/network";
import { SilentSovereignFactoryAbi } from "../frontend/lib/generated/SilentSovereignFactory";

const output: Record<string, unknown> = {};
declare global {
  interface Window {
    integrationProbe?: Record<string, unknown>;
    probeFinished?: boolean;
  }
}
window.integrationProbe = output;
async function probe() {
  try {
    const client = publicReadClient();
    output.ensV2Root = await ensV2Root(client);
    output.ensIdentity = await inspectIdentity(client, "bamboo.eth");
  } catch (error) {
    output.ensError = String(error);
  }
  if (process.env.SILENT_PROBE_ENS_ONLY === "true") {
    window.probeFinished = true;
    document.body.textContent = JSON.stringify(output, null, 2);
    return;
  }
  let connection: Awaited<ReturnType<typeof startAnonymousClient>> | undefined;
  try {
    connection = await startAnonymousClient(
      (status) => {
        output.privacy = status;
        document.body.textContent = JSON.stringify(output, null, 2);
      },
      process.env.SILENT_PROBE_NETWORK === "nym" ? "nym" : "nox",
    );
    output.anonymousBalance = (
      await connection.client.getBalance({
        address: factoryAddress || "0x0000000000000000000000000000000000000000",
      })
    ).toString();
    if (factoryAddress)
      output.anonymousVaultCount = (
        await connection.client.readContract({
          address: factoryAddress,
          abi: SilentSovereignFactoryAbi,
          functionName: "vaultCount",
        })
      ).toString();
    output.anonymousBlock = (
      await connection.client.getBlockNumber()
    ).toString();
  } catch (error) {
    output.anonymousError = String(error);
  } finally {
    connection?.close();
    window.probeFinished = true;
    document.body.textContent = JSON.stringify(output, null, 2);
  }
}
probe();
