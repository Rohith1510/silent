import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeFunctionData, encodeAbiParameters, keccak256 } from "viem";
import { addressRecordCall, resolverAbi, ethAddressResource } from "../lib/ens";
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
