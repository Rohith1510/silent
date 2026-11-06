// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IERC165} from "@openzeppelin/contracts@5.4.0/utils/introspection/IERC165.sol";
import {ISilentAutomation} from "./interfaces/ISilentAutomation.sol";

interface IReceiver is IERC165 { function onReport(bytes calldata metadata, bytes calldata report) external; }
interface IVaultFactory { function isVault(address vault) external view returns (bool); }

/// @notice CRE delivery adapter; it never owns a vault or transfers assets.
contract SilentSovereignCREReceiver is IReceiver {
    address public immutable forwarder;
    address public immutable workflowOwner;
    IVaultFactory public immutable factory;
    mapping(bytes32 => bool) public consumed;
    error InvalidReport();
    event AutomationDelivered(address indexed vault, uint8 action, uint256 nonce, bool changed);

    constructor(address factory_, address forwarder_, address workflowOwner_) {
        if (factory_.code.length == 0 || forwarder_ == address(0) || workflowOwner_ == address(0)) revert InvalidReport();
        factory = IVaultFactory(factory_);
        forwarder = forwarder_;
        workflowOwner = workflowOwner_;
    }
    function supportsInterface(bytes4 id) external pure returns (bool) { return id == type(IReceiver).interfaceId || id == type(IERC165).interfaceId; }
    function onReport(bytes calldata metadata, bytes calldata report) external {
        if (msg.sender != forwarder || metadata.length < 62 || address(bytes20(metadata[42:62])) != workflowOwner) revert InvalidReport();
        (uint256 chainId, address targetReceiver, address vault, uint8 action, uint256 nonce) = abi.decode(report, (uint256,address,address,uint8,uint256));
        if (chainId != block.chainid || targetReceiver != address(this) || !factory.isVault(vault)) revert InvalidReport();
        bytes32 key = keccak256(report);
        if (consumed[key]) return;
        consumed[key] = true;
        bool changed = ISilentAutomation(vault).performUpkeep(action, nonce);
        // Ineligible delivery can be retried after time or quorum changes.
        if (!changed) consumed[key] = false;
        emit AutomationDelivered(vault, action, nonce, changed);
    }
}
