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
  "function setText(bytes name,string key,string value)",
  "function multicall(bytes[] data) returns (bytes[])",
  "function grantSetterRoles(bytes setter,address account)",
  "function revokeRoles(uint256 resource,uint256 roleBitmap,address account)",
  "function hasRootRoles(uint256 roleBitmap,address account) view returns (bool)",
  "function hasRoles(uint256 resource,uint256 roleBitmap,address account) view returns (bool)",
]);
export const ensProfileKeys = [
  "avatar",
  "description",
  "url",
  "com.twitter",
  "com.github",
] as const;
export type EnsProfileKey = (typeof ensProfileKeys)[number];
export type EnsProfileRecords = Record<EnsProfileKey, string>;
export const emptyEnsProfile = (): EnsProfileRecords => ({
  avatar: "",
  description: "",
  url: "",
  "com.twitter": "",
  "com.github": "",
});
export const roleSetText = 1n << 4n;
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
export function textRecordResource(key: EnsProfileKey) {
  return BigInt(keccak256(toHex(key)));
}
export function textRecordCall(
  name: string,
  key: EnsProfileKey,
  value: string,
) {
  const normalized = normalize(name);
  if (key === "description" && value.length > 160)
    throw new Error("ENS descriptions must be 160 characters or fewer.");
  if (value.length > 2048)
    throw new Error(`${key} is too long for this profile editor.`);
  return encodeFunctionData({
    abi: resolverAbi,
    functionName: "setText",
    args: [toHex(packetToBytes(normalized)), key, value],
  });
}
export function textSetterPermissionCall(key: EnsProfileKey) {
  return encodeFunctionData({
    abi: resolverAbi,
    functionName: "setText",
    // ENSv2 derives the role from the selector and key. Name and value are ignored.
    args: ["0x", key, ""],
  });
}
export function profileMulticall(
  name: string,
  records: Partial<EnsProfileRecords>,
) {
  const calls = ensProfileKeys
    .filter((key) => records[key] !== undefined)
    .map((key) => textRecordCall(name, key, records[key]!));
  if (!calls.length) throw new Error("Choose at least one ENS profile record.");
  return encodeFunctionData({
    abi: resolverAbi,
    functionName: "multicall",
    args: [calls],
  });
}
export function identityProfileMulticall(
  name: string,
  account: Address,
  records: Partial<EnsProfileRecords>,
) {
  const calls = [
    addressRecordCall(name, account),
    ...ensProfileKeys
      .filter((key) => records[key] !== undefined && records[key] !== "")
      .map((key) => textRecordCall(name, key, records[key]!)),
  ];
  return encodeFunctionData({
    abi: resolverAbi,
    functionName: "multicall",
    args: [calls],
  });
}
export function avatarPreviewUrl(value: string) {
  const avatar = value.trim();
  if (/^https:\/\//i.test(avatar)) return avatar;
  if (/^ipfs:\/\//i.test(avatar))
    return `https://ipfs.io/ipfs/${avatar.slice("ipfs://".length).replace(/^ipfs\//, "")}`;
  return undefined;
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
export type EnsIdentityHealth = {
  name: string;
  address: Address;
  resolver?: Address;
  owner?: Address;
  expiry?: string;
};
export function rememberIdentityHealth(
  health: EnsIdentityHealth,
  chainId: number,
) {
  try {
    localStorage.setItem(
      `silent:identity-health:${chainId}:${normalize(health.name)}`,
      JSON.stringify(health),
    );
  } catch {
    /* Storage is optional and never authorizes a vault action. */
  }
}
export function rememberedIdentityHealth(name: string, chainId: number) {
  try {
    const value = localStorage.getItem(
      `silent:identity-health:${chainId}:${normalize(name)}`,
    );
    return value ? (JSON.parse(value) as EnsIdentityHealth) : undefined;
  } catch {
    return undefined;
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
        `${parent} has no active ENSv2 subregistry. Complete the in-app family identity setup first.`,
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
export async function inspectEnsProfile(client: ReadClient, input: string) {
  const identity = await inspectIdentity(client, input);
  if (!identity.name)
    throw new Error("An ENS name is required to load public profile records.");
  const values = await Promise.all(
    ensProfileKeys.map((key) =>
      client.getEnsText({ name: identity.name!, key }),
    ),
  );
  const records = Object.fromEntries(
    ensProfileKeys.map((key, index) => [key, values[index] || ""]),
  ) as EnsProfileRecords;
  let avatarUrl = avatarPreviewUrl(records.avatar);
  if (records.avatar) {
    try {
      avatarUrl =
        (await client.getEnsAvatar({ name: identity.name })) || avatarUrl;
    } catch {
      // The raw onchain record remains valid even if NFT metadata or a remote image is unavailable.
    }
  }
  return {
    identity,
    records,
    avatarUrl,
  };
}
