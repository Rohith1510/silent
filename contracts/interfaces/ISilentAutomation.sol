// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISilentAutomation {
    function eligibleAction() external view returns (uint8);
    function performUpkeep(uint8 action, uint256 expectedNonce) external returns (bool);
}
