import {
  getAddress,
  isAddress,
  parseAbi,
  zeroAddress,
  type Address,
  encodeFunctionData,
  encodeAbiParameters,
  keccak256,
  toHex,
} from "viem";
import { normalize, packetToBytes } from "viem/ens";
import type { ReadClient } from "./privacy";
import { validAddress } from "./configuration";

export const registryAbi = parseAbi([
  "function getSubregistry(string label) view returns (address)",
  "function findOwner(string label) view returns (address)",
  "function findExpiry(string label) view returns (uint64)",
  "function hasRootRoles(uint256 roleBitmap, address account) view returns (bool)",
  "function hasRoles(uint256 resource,uint256 roleBitmap,address account) view returns (bool)",
  "function register(string label,address owner,address registry,address resolver,uint256 roleBitmap,uint64 expiry) returns (uint256)",
]);
export const resolverAbi = parseAbi([
  "function setAddress(bytes name,uint256 coinType,bytes value)",
  "function grantSetterRoles(bytes setter,address account)",
  "function revokeRoles(uint256 resource,uint256 roleBitmap,address account)",
  "function hasRootRoles(uint256 roleBitmap,address account) view returns (bool)",
  "function hasRoles(uint256 resource,uint256 roleBitmap,address account) view returns (bool)",
]);
export const ethAddressResource = BigInt(
  keccak256(encodeAbiParameters([{ type: "uint256" }], [60n])),
);
export function addressRecordCall(name: string, account: Address) {
  return encodeFunctionData({
    abi: resolverAbi,
    functionName: "setAddress",
    args: [toHex(packetToBytes(normalize(name))), 60n, account],
  });
}
export async function registryEntry(client: ReadClient, name: string) {
  const labels = normalize(name).split(".");
  const label = labels[0];
  const parent = labels.slice(1).join(".");
  const registry = parent
    ? await findSubregistry(client, parent)
    : await ensV2Root(client);
  const [owner, expiry] = await Promise.all([
    client.readContract({
      address: registry,
      abi: registryAbi,
      functionName: "findOwner",
      args: [label],
    }),
    client.readContract({
      address: registry,
      abi: registryAbi,
      functionName: "findExpiry",
      args: [label],
    }),
  ]);
  return { registry, owner, expiry };
}
export function rememberIdentity(
  name: string,
  account: Address,
  chainId: number,
) {
  // Local labels are advisory. They never replace an onchain beneficiary address.
  try {
    localStorage.setItem(
      `silent:identity:${chainId}:${account.toLowerCase()}`,
      normalize(name),
    );
  } catch {
    /* Storage is optional. */
  }
}
export function rememberedIdentity(account: Address, chainId: number) {
  try {
    return (
      localStorage.getItem(
        `silent:identity:${chainId}:${account.toLowerCase()}`,
      ) || account
    );
  } catch {
    return account;
  }
}
const universalAbi = parseAbi([
  "function ROOT_REGISTRY() view returns (address)",
  "function isENSv2() view returns (bool)",
]);
export async function ensV2Root(client: ReadClient) {
  const universal = client.chain.contracts?.ensUniversalResolver?.address;
  if (!universal || client.chain.id !== 11155111)
    throw new Error("ENSv2 integration is configured for Sepolia only.");
  const v2 = await client.readContract({
    address: universal,
    abi: universalAbi,
    functionName: "isENSv2",
  });
  if (!v2)
    throw new Error("This Universal Resolver does not report ENSv2 support.");
  return client.readContract({
    address: universal,
    abi: universalAbi,
    functionName: "ROOT_REGISTRY",
  });
}
export async function findSubregistry(client: ReadClient, parent: string) {
  let registry = await ensV2Root(client);
  for (const label of normalize(parent).split(".").reverse()) {
    registry = await client.readContract({
      address: registry,
      abi: registryAbi,
      functionName: "getSubregistry",
      args: [label],
    });
    if (registry === zeroAddress)
      throw new Error(
        `${parent} has no active ENSv2 subregistry. Its owner must create and attach one using Sepolia ENS Explorer first.`,
      );
  }
  return registry;
}
export async function inspectIdentity(client: ReadClient, input: string) {
  if (client.chain.id !== 11155111)
    throw new Error(
      "ENS lookup is supported on Sepolia; local tests use addresses.",
    );
  const name = isAddress(input)
    ? await client.getEnsName({ address: getAddress(input) })
    : normalize(input);
  if (!name)
    return {
      address: getAddress(input),
      name: null,
      resolver: undefined,
      owner: undefined,
      version: "Unknown",
    };
  const address = await client.getEnsAddress({ name: normalize(name) });
  if (!address || !validAddress(address))
    throw new Error(
      "This name has no Ethereum address record. Add an address record in its resolver first.",
    );
  if (isAddress(input) && address.toLowerCase() !== input.toLowerCase())
    throw new Error("Primary name failed forward verification.");
  const resolver = await client.getEnsResolver({ name: normalize(name) });
  let owner: Address | undefined;
  let version = "ENS · Universal Resolver";
  try {
    const labels = normalize(name).split(".");
    const parent = labels.slice(1).join(".");
    const registry = parent
      ? await findSubregistry(client, parent)
      : await ensV2Root(client);
    owner = await client.readContract({
      address: registry,
      abi: registryAbi,
      functionName: "findOwner",
      args: [labels[0]],
    });
    version = "ENSv2 · verified registry";
  } catch {
    /* Migrated and legacy names may resolve without a v2 ownership entry. */
  }
  return { address, name: normalize(name), resolver, owner, version };
}
