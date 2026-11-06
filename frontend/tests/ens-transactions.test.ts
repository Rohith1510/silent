import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decodeFunctionData,
  encodeAbiParameters,
  keccak256,
  toHex,
  type Hex,
} from "viem";
import {
  addressRecordCall,
  avatarPreviewUrl,
  ethAddressResource,
  identityProfileMulticall,
  profileMulticall,
  resolverAbi,
  roleSetText,
  textRecordCall,
  textRecordResource,
  textSetterPermissionCall,
} from "../lib/ens";
import {
  allEnsRoles,
  ensV2Sepolia,
  normalizeParentName,
  predictProxyAddress,
  registryDeploymentCall,
  registryInitAbi,
  resolverDeploymentCall,
  resolverInitAbi,
  verifiableFactoryAbi,
} from "../lib/ens-setup";
test("ENSv2 address writes use DNS encoding and coin type 60; delegation scope is coin-type-wide", () => {
  const address = "0x1111111111111111111111111111111111111111";
  const decoded = decodeFunctionData({
    abi: resolverAbi,
    data: addressRecordCall("heir.bamboo.eth", address),
  });
  assert.equal(decoded.functionName, "setAddress");
  assert.deepEqual(decoded.args, [
    "0x04686569720662616d626f6f0365746800",
    60n,
    address,
  ]);
  assert.equal(
    ethAddressResource,
    BigInt(keccak256(encodeAbiParameters([{ type: "uint256" }], [60n]))),
  );
  assert.throws(() => addressRecordCall("invalid..eth", address));
});

test("ENSv2 profile writes use DNS names and a single resolver multicall", () => {
  const data = profileMulticall("heir.bamboo.eth", {
    avatar: "ipfs://bafy-avatar",
    description: "Verified beneficiary identity",
  });
  const outer = decodeFunctionData({ abi: resolverAbi, data });
  assert.equal(outer.functionName, "multicall");
  const calls = outer.args[0] as readonly Hex[];
  assert.equal(calls.length, 2);
  const avatar = decodeFunctionData({ abi: resolverAbi, data: calls[0] });
  const description = decodeFunctionData({ abi: resolverAbi, data: calls[1] });
  assert.equal(avatar.functionName, "setText");
  assert.deepEqual(avatar.args, [
    "0x04686569720662616d626f6f0365746800",
    "avatar",
    "ipfs://bafy-avatar",
  ]);
  assert.equal(description.functionName, "setText");
  assert.deepEqual(description.args, [
    "0x04686569720662616d626f6f0365746800",
    "description",
    "Verified beneficiary identity",
  ]);
  assert.throws(() =>
    textRecordCall("heir.bamboo.eth", "description", "x".repeat(161)),
  );
});

test("guided ENSv2 setup batches the Ethereum address and optional profile records", () => {
  const account = "0x1111111111111111111111111111111111111111";
  const data = identityProfileMulticall("heir.bamboo.eth", account, {
    description: "Verified beneficiary",
    url: "https://example.com",
  });
  const outer = decodeFunctionData({ abi: resolverAbi, data });
  assert.equal(outer.functionName, "multicall");
  const calls = outer.args[0] as readonly Hex[];
  assert.equal(calls.length, 3);
  assert.equal(
    decodeFunctionData({ abi: resolverAbi, data: calls[0] }).functionName,
    "setAddress",
  );
  assert.deepEqual(
    calls.slice(1).map(
      (call) => decodeFunctionData({ abi: resolverAbi, data: call }).functionName,
    ),
    ["setText", "setText"],
  );
});

test("ENSv2 profile delegation is scoped to one text key", () => {
  const setter = decodeFunctionData({
    abi: resolverAbi,
    data: textSetterPermissionCall("avatar"),
  });
  assert.equal(setter.functionName, "setText");
  assert.deepEqual(setter.args, ["0x", "avatar", ""]);
  assert.equal(roleSetText, 1n << 4n);
  assert.equal(
    textRecordResource("avatar"),
    BigInt(keccak256(toHex("avatar"))),
  );
});

test("raw ENS avatar previews accept HTTPS and map IPFS while ENSIP-12 resolution handles NFT references", () => {
  assert.equal(
    avatarPreviewUrl("https://example.com/avatar.png"),
    "https://example.com/avatar.png",
  );
  assert.equal(
    avatarPreviewUrl("ipfs://bafy/avatar.png"),
    "https://ipfs.io/ipfs/bafy/avatar.png",
  );
  assert.equal(
    avatarPreviewUrl(
      "eip155:1/erc721:0x0000000000000000000000000000000000000000/1",
    ),
    undefined,
  );
});

test("ENSv2 family names are restricted to safe second-level .eth names", () => {
  assert.deepEqual(normalizeParentName("Bamboo"), {
    name: "bamboo.eth",
    label: "bamboo",
  });
  assert.deepEqual(normalizeParentName("bamboo.eth"), {
    name: "bamboo.eth",
    label: "bamboo",
  });
  assert.throws(() => normalizeParentName("heir.bamboo.eth"));
  assert.throws(() => normalizeParentName(".eth"));
});

test("ENSv2 official proxy deployments initialize ownership and parent records", () => {
  const owner = "0x1111111111111111111111111111111111111111";
  const resolver = "0x2222222222222222222222222222222222222222";
  const registry = "0x3333333333333333333333333333333333333333";
  const resolverCall = resolverDeploymentCall(
    owner,
    "bamboo.eth",
    resolver,
  );
  const resolverOuter = decodeFunctionData({
    abi: verifiableFactoryAbi,
    data: resolverCall.data,
  });
  assert.equal(resolverOuter.functionName, "deployProxy");
  assert.equal(
    resolverOuter.args[0],
    ensV2Sepolia.permissionedResolverImpl,
  );
  const resolverInner = decodeFunctionData({
    abi: resolverInitAbi,
    data: resolverOuter.args[2],
  });
  assert.equal(resolverInner.functionName, "initialize");
  assert.equal(resolverInner.args[0][0].account, owner);
  assert.equal(resolverInner.args[0][0].roleBitmap, allEnsRoles);
  assert.equal(resolverInner.args[1].length, 1);

  const registryCall = registryDeploymentCall(owner, "bamboo.eth", registry);
  const registryOuter = decodeFunctionData({
    abi: verifiableFactoryAbi,
    data: registryCall.data,
  });
  assert.equal(registryOuter.functionName, "deployProxy");
  const registryInner = decodeFunctionData({
    abi: registryInitAbi,
    data: registryOuter.args[2],
  });
  assert.equal(registryInner.functionName, "initialize");
  assert.equal(registryInner.args[0][0].account, owner);
  assert.equal(registryInner.args[0][0].roleBitmap, allEnsRoles);
});

test("ENSv2 proxy prediction is deterministic and scoped to its deployer", () => {
  const common = {
    factory: ensV2Sepolia.verifiableFactory,
    proxyLogic: "0x4444444444444444444444444444444444444444" as const,
    salt: 123n,
  };
  const first = predictProxyAddress({
    ...common,
    deployer: "0x1111111111111111111111111111111111111111",
  });
  const repeat = predictProxyAddress({
    ...common,
    deployer: "0x1111111111111111111111111111111111111111",
  });
  const other = predictProxyAddress({
    ...common,
    deployer: "0x2222222222222222222222222222222222222222",
  });
  assert.equal(first, repeat);
  assert.notEqual(first, other);
});
