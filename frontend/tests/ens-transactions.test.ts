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
  profileMulticall,
  resolverAbi,
  roleSetText,
  textRecordCall,
  textRecordResource,
  textSetterPermissionCall,
} from "../lib/ens";
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
