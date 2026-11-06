// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Math} from "@openzeppelin/contracts@5.4.0/utils/math/Math.sol";

library AllocationMath {
    /// @dev Cumulative rounding assigns every last wei, even for tiny snapshots.
    function portion(uint256 amount, uint256 startBps, uint256 shareBps) internal pure returns (uint256) {
        return Math.mulDiv(amount, startBps + shareBps, 10_000) - Math.mulDiv(amount, startBps, 10_000);
    }
}
