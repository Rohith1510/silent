// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {SilentSovereignVault} from "./SilentSovereignVault.sol";

/// @notice No administrators, fees, proxies or cross-vault asset permissions.
contract SilentSovereignFactory {
    mapping(address => address[]) private ownerVaults;
    mapping(address => bool) public isVault;
    address[] private allVaults;
    event VaultCreated(address indexed owner, address indexed vault, uint256 index);

    function createVault(SilentSovereignVault.Beneficiary[] calldata beneficiaries, address[] calldata guardians, SilentSovereignVault.Rules calldata rules) external returns (address vault) {
        vault = address(new SilentSovereignVault(msg.sender, beneficiaries, guardians, rules));
        ownerVaults[msg.sender].push(vault);
        allVaults.push(vault);
        isVault[vault] = true;
        emit VaultCreated(msg.sender, vault, allVaults.length - 1);
    }
    function getVaults(address owner) external view returns (address[] memory) { return ownerVaults[owner]; }
    function vaultCount() external view returns (uint256) { return allVaults.length; }
    function vaultAt(uint256 index) external view returns (address) { return allVaults[index]; }
}
