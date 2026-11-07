import {
  concat,
  encodeAbiParameters,
  encodeFunctionData,
  getAddress,
  getCreate2Address,
  keccak256,
  namehash,
  parseAbi,
  stringToHex,
  zeroAddress,
  zeroHash,
  type Address,
  type Hex,
} from "viem";
import { normalize } from "viem/ens";
import { addressRecordCall } from "./ens";
import type { ReadClient } from "./privacy";

// Official ENSv2 Sepolia deployment published by ENS. Keeping these in one
// versioned boundary makes a future test deployment reset easy to review.
export const ensV2Sepolia = {
  ethRegistrar: getAddress("0xf633e7fc17e2bbe0d0965d18ec1821dcb754a3d3"),
  ethRegistry: getAddress("0xd4ebcbbdf463c9c45784603db0ddd499bc44a8b4"),
  verifiableFactory: getAddress(
    "0xda70306c98e97ece36f997a21368e53298572991",
  ),
  permissionedResolverImpl: getAddress(
    "0x115eb53f0c60696633855f90b138178fb40b2b2c",
  ),
  userRegistryImpl: getAddress(
    "0x9bd8a88719068d09ecee662f36c0e3856708366a",
  ),
  paymentTokens: [
    {
      address: getAddress("0x240b0316df57887dbbe58b586508b19e633a14aa"),
      label: "Sepolia Mock USDC",
    },
    {
      address: getAddress("0xf6fac8a58a0be13b9197f27c41b73162fe32572b"),
      label: "Sepolia Mock DAI",
    },
  ],
} as const;

export const ethRegistrarAbi = parseAbi([
  "function isAvailable(string label) view returns (bool)",
  "function getRegisterPrice(string label,uint64 duration,address paymentToken) view returns (uint256 base,uint256 premium)",
  "function makeCommitment(string label,address owner,bytes32 secret,address subregistry,address resolver,uint64 duration,bytes32 referrer) view returns (bytes32)",
  "function commit(bytes32 commitment)",
  "function commitmentAt(bytes32 commitment) view returns (uint256)",
  "function MIN_COMMITMENT_AGE() view returns (uint256)",
  "function MAX_COMMITMENT_AGE() view returns (uint256)",
  "function register(string label,address owner,bytes32 secret,address subregistry,address resolver,uint64 duration,address paymentToken,bytes32 referrer) returns (uint256 tokenId)",
]);

export const verifiableFactoryAbi = parseAbi([
  "function deployProxy(address implementation,uint256 salt,bytes data) returns (address proxy)",
  "function proxyLogic() view returns (address)",
  "function verifyContract(address proxy) view returns (address implementation)",
  "event ProxyDeployed(address indexed sender,address indexed proxyAddress,uint256 salt,address implementation)",
]);

export const resolverInitAbi = parseAbi([
  "function initialize((address account,uint256 roleBitmap)[] grants,bytes[] calls)",
]);

export const registryInitAbi = parseAbi([
  "function initialize((address account,uint256 roleBitmap)[] grants)",
]);

export const parentRegistryWriteAbi = parseAbi([
  "function setResolver(uint256 anyId,address resolver)",
  "function setSubregistry(uint256 anyId,address subregistry)",
  "function getResolver(string label) view returns (address)",
  "function getSubregistry(string label) view returns (address)",
]);

export const allEnsRoles = BigInt(
  "0x1111111111111111111111111111111111111111111111111111111111111111",
);
export const ensReferrer = zeroHash;
export const yearSeconds = 365 * 24 * 60 * 60;

export function normalizeParentName(value: string) {
  const input = value.trim().toLowerCase();
  const full = input.endsWith(".eth") ? input : `${input}.eth`;
  const name = normalize(full);
  const labels = name.split(".");
  if (labels.length !== 2 || labels[1] !== "eth" || !labels[0])
    throw new Error("Choose a second-level name such as your-family.eth.");
  return { name, label: labels[0] };
}

export function resolverSalt(owner: Address) {
  return BigInt(
    keccak256(
      encodeAbiParameters(
        [{ type: "bytes32" }, { type: "address" }, { type: "uint256" }],
        [keccak256(stringToHex("OwnedResolver")), owner, 0n],
      ),
    ),
  );
}

export function registrySalt(name: string) {
  return BigInt(
    keccak256(
      encodeAbiParameters(
        [{ type: "bytes32" }, { type: "bytes32" }, { type: "uint256" }],
        [keccak256(stringToHex("UserRegistry")), namehash(normalize(name)), 0n],
      ),
    ),
  );
}

export function labelId(label: string) {
  return BigInt(keccak256(stringToHex(label)));
}

export function predictProxyAddress(args: {
  factory: Address;
  proxyLogic: Address;
  deployer: Address;
  salt: bigint;
}) {
  const outerSalt = keccak256(
    encodeAbiParameters(
      [{ type: "address" }, { type: "uint256" }],
      [args.deployer, args.salt],
    ),
  );
  const initCode = concat([
    "0x3d604d80600a3d3981f3363d3d373d3d3d363d73",
    args.proxyLogic,
    "0x5af43d82803e903d91602b57fd5bf3",
    outerSalt,
  ]);
  return getCreate2Address({
    from: args.factory,
    salt: outerSalt,
    bytecodeHash: keccak256(initCode),
  });
}

export async function predictEnsInfrastructure(
  client: ReadClient,
  owner: Address,
  name: string,
) {
  const proxyLogic = await client.readContract({
    address: ensV2Sepolia.verifiableFactory,
    abi: verifiableFactoryAbi,
    functionName: "proxyLogic",
  });
  const resolver = predictProxyAddress({
    factory: ensV2Sepolia.verifiableFactory,
    proxyLogic,
    deployer: owner,
    salt: resolverSalt(owner),
  });
  const registry = predictProxyAddress({
    factory: ensV2Sepolia.verifiableFactory,
    proxyLogic,
    deployer: owner,
    salt: registrySalt(name),
  });
  return { proxyLogic, resolver, registry };
}

export function resolverDeploymentCall(
  owner: Address,
  name: string,
  resolver: Address,
) {
  const init = encodeFunctionData({
    abi: resolverInitAbi,
    functionName: "initialize",
    args: [
      [{ account: owner, roleBitmap: allEnsRoles }],
      [addressRecordCall(name, owner)],
    ],
  });
  return {
    to: ensV2Sepolia.verifiableFactory,
    data: encodeFunctionData({
      abi: verifiableFactoryAbi,
      functionName: "deployProxy",
      args: [
        ensV2Sepolia.permissionedResolverImpl,
        resolverSalt(owner),
        init,
      ],
    }),
    predicted: resolver,
  } as const;
}

export function registryDeploymentCall(
  owner: Address,
  name: string,
  registry: Address,
) {
  const init = encodeFunctionData({
    abi: registryInitAbi,
    functionName: "initialize",
    args: [[{ account: owner, roleBitmap: allEnsRoles }]],
  });
  return {
    to: ensV2Sepolia.verifiableFactory,
    data: encodeFunctionData({
      abi: verifiableFactoryAbi,
      functionName: "deployProxy",
      args: [ensV2Sepolia.userRegistryImpl, registrySalt(name), init],
    }),
    predicted: registry,
  } as const;
}

export function registrationCommitmentCall(args: {
  label: string;
  owner: Address;
  secret: Hex;
  registry: Address;
  resolver: Address;
  duration: bigint;
}) {
  return {
    address: ensV2Sepolia.ethRegistrar,
    abi: ethRegistrarAbi,
    functionName: "makeCommitment",
    args: [
      args.label,
      args.owner,
      args.secret,
      args.registry,
      args.resolver,
      args.duration,
      ensReferrer,
    ],
  } as const;
}

export type EnsRegistrationDraft = {
  name: string;
  label: string;
  owner: Address;
  secret: Hex;
  registry: Address;
  resolver: Address;
  duration: string;
  paymentToken: Address;
  commitment: Hex;
};

const registrationDraftKey = "silent:ensv2-registration:11155111";
export function saveRegistrationDraft(draft: EnsRegistrationDraft) {
  localStorage.setItem(registrationDraftKey, JSON.stringify(draft));
}
export function loadRegistrationDraft() {
  try {
    const value = localStorage.getItem(registrationDraftKey);
    return value ? (JSON.parse(value) as EnsRegistrationDraft) : undefined;
  } catch {
    return undefined;
  }
}
export function clearRegistrationDraft() {
  localStorage.removeItem(registrationDraftKey);
}

export type ActiveEnsFamily = {
  name: string;
  owner: Address;
  resolver: Address;
  registry: Address;
};
const activeFamilyKey = (owner: Address) =>
  `silent:ensv2-family:11155111:${owner.toLowerCase()}`;
export function saveActiveEnsFamily(value: ActiveEnsFamily) {
  localStorage.setItem(activeFamilyKey(value.owner), JSON.stringify(value));
}
export function loadActiveEnsFamily(owner: Address) {
  try {
    const value = localStorage.getItem(activeFamilyKey(owner));
    return value ? (JSON.parse(value) as ActiveEnsFamily) : undefined;
  } catch {
    return undefined;
  }
}

export function registrationCall(draft: EnsRegistrationDraft) {
  return encodeFunctionData({
    abi: ethRegistrarAbi,
    functionName: "register",
    args: [
      draft.label,
      draft.owner,
      draft.secret,
      draft.registry,
      draft.resolver,
      BigInt(draft.duration),
      draft.paymentToken,
      ensReferrer,
    ],
  });
}

export function emptyInfrastructureAddress(value?: Address) {
  return !value || value === zeroAddress;
}
