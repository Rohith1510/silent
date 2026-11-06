// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts@5.4.0/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/utils/SafeERC20.sol";
import {Math} from "@openzeppelin/contracts@5.4.0/utils/math/Math.sol";
import {AllocationMath} from "./libraries/AllocationMath.sol";

/// @notice Unaudited testnet inheritance vault. Only deposited, accounted assets are inherited.
contract SilentSovereignVault is ReentrancyGuard {
    using SafeERC20 for IERC20;
    enum State { ACTIVE, RECOVERY_PENDING, RECOVERY_AUTHORIZED, RELEASING, COMPLETED }
    struct Beneficiary { address account; uint16 allocationBps; }
    struct Rules {
        uint64 heartbeatInterval;
        uint64 challengePeriod;
        uint64 releaseInterval;
        uint64 emergencyDelay; // Zero disables accelerated emergency claims.
        uint16 initialBps;
        uint16 trancheBps;
        uint8 guardianThreshold; // Zero only with no guardians: recovery is disabled.
    }
    address public immutable owner;
    State public state;
    Rules public rules;
    Beneficiary[] private beneficiaries;
    address[] private guardians;
    address[] private assets;
    mapping(address => bool) public isGuardian;
    mapping(address => bool) public supportedToken;
    mapping(address => uint256) public accounted;
    mapping(address => uint256) public snapshot;
    mapping(address => uint256) public remaining;
    mapping(address => mapping(address => uint256)) public claimed;
    mapping(uint256 => mapping(address => bool)) public approved;
    mapping(uint256 => mapping(address => bool)) public emergencyApproved;
    uint256 public lastHeartbeat;
    uint256 public pendingAt;
    uint256 public authorizedAt;
    uint256 public recoveryNonce;
    uint256 public approvalCount;
    uint256 public emergencyApprovalCount;
    bool public recoveryPaused;

    error Unauthorized();
    error InvalidConfiguration();
    error InvalidState();
    error NotEligible();
    error UnsupportedAsset();
    error InvalidAmount();
    error TransferFailed();
    error NothingToClaim();
    event StateChanged(State indexed previousState, State indexed newState, uint256 indexed nonce);
    event ConfigurationUpdated(bytes32 indexed configHash);
    event Heartbeat(uint256 timestamp, uint256 deadline);
    event RecoveryRequested(uint256 indexed nonce, uint256 challengeEnds);
    event GuardianApproved(uint256 indexed nonce, address indexed guardian, bool emergency);
    event RecoveryPaused(bool paused);
    event AssetSupported(address indexed asset);
    event Deposited(address indexed asset, address indexed sender, uint256 amount);
    event Withdrawn(address indexed asset, uint256 amount);
    event SnapshotTaken(address indexed asset, uint256 amount);
    event Claimed(address indexed asset, address indexed beneficiary, uint256 amount, bool emergency);

    modifier onlyOwner() { if (msg.sender != owner) revert Unauthorized(); _; }
    modifier active() { if (state != State.ACTIVE) revert InvalidState(); _; }

    constructor(address owner_, Beneficiary[] memory beneficiaries_, address[] memory guardians_, Rules memory rules_) {
        if (owner_ == address(0)) revert InvalidConfiguration();
        owner = owner_;
        assets.push(address(0));
        _configure(beneficiaries_, guardians_, rules_);
    }

    function getBeneficiaries() external view returns (Beneficiary[] memory) { return beneficiaries; }
    function getGuardians() external view returns (address[] memory) { return guardians; }
    function getAssets() external view returns (address[] memory) { return assets; }
    function deadline() public view returns (uint256) { return lastHeartbeat + rules.heartbeatInterval; }

    function configure(Beneficiary[] calldata b, address[] calldata g, Rules calldata r) external onlyOwner active {
        _configure(b, g, r);
    }

    function _configure(Beneficiary[] memory b, address[] memory g, Rules memory r) private {
        if (b.length == 0 || b.length > 16 || g.length > 16 ||
            r.heartbeatInterval < 60 || r.challengePeriod < 60 || r.releaseInterval < 60 ||
            r.initialBps > 10_000 || r.trancheBps == 0 || r.trancheBps > 10_000 ||
            (r.emergencyDelay != 0 && r.emergencyDelay < 60) ||
            (g.length == 0 ? r.guardianThreshold != 0 : (r.guardianThreshold == 0 || r.guardianThreshold > g.length))) {
            revert InvalidConfiguration();
        }
        uint256 sum;
        for (uint256 i; i < b.length; ++i) {
            if (b[i].account == address(0) || b[i].account == address(this) || b[i].allocationBps == 0) revert InvalidConfiguration();
            for (uint256 j; j < i; ++j) if (b[i].account == b[j].account) revert InvalidConfiguration();
            sum += b[i].allocationBps;
        }
        if (sum != 10_000) revert InvalidConfiguration();
        for (uint256 i; i < guardians.length; ++i) isGuardian[guardians[i]] = false;
        delete guardians;
        for (uint256 i; i < g.length; ++i) {
            if (g[i] == address(0) || g[i] == owner || g[i] == address(this) || isGuardian[g[i]]) revert InvalidConfiguration();
            isGuardian[g[i]] = true;
            guardians.push(g[i]);
        }
        delete beneficiaries;
        for (uint256 i; i < b.length; ++i) beneficiaries.push(b[i]);
        rules = r;
        lastHeartbeat = block.timestamp;
        emit ConfigurationUpdated(keccak256(abi.encode(b, g, r)));
        emit Heartbeat(lastHeartbeat, deadline());
    }

    function heartbeat() external onlyOwner {
        if (state != State.ACTIVE && state != State.RECOVERY_PENDING) revert InvalidState();
        if (state == State.RECOVERY_PENDING) _cancel();
        lastHeartbeat = block.timestamp;
        emit Heartbeat(lastHeartbeat, deadline());
    }

    function setRecoveryPaused(bool paused) external onlyOwner {
        if (state != State.ACTIVE && state != State.RECOVERY_PENDING) revert InvalidState();
        if (paused && state == State.RECOVERY_PENDING) _cancel();
        recoveryPaused = paused;
        emit RecoveryPaused(paused);
    }

    function cancelRecovery() external onlyOwner {
        if (state != State.RECOVERY_PENDING) revert InvalidState();
        _cancel();
    }

    function _cancel() private {
        pendingAt = 0;
        approvalCount = 0;
        lastHeartbeat = block.timestamp;
        _transition(State.ACTIVE);
        emit Heartbeat(lastHeartbeat, deadline());
    }

    function requestRecovery() external {
        if (eligibleAction() != 1) revert NotEligible();
        _request();
    }

    function _request() private {
        ++recoveryNonce;
        approvalCount = 0;
        emergencyApprovalCount = 0;
        pendingAt = block.timestamp;
        _transition(State.RECOVERY_PENDING);
        emit RecoveryRequested(recoveryNonce, pendingAt + rules.challengePeriod);
    }

    function approveRecovery(uint256 nonce, bool emergency) external {
        if (!isGuardian[msg.sender] || nonce != recoveryNonce) revert Unauthorized();
        if (emergency) {
            if ((state != State.RECOVERY_AUTHORIZED && state != State.RELEASING) || rules.emergencyDelay == 0) revert InvalidState();
            if (emergencyApproved[nonce][msg.sender]) revert NotEligible();
            emergencyApproved[nonce][msg.sender] = true;
            ++emergencyApprovalCount;
        } else {
            if (state != State.RECOVERY_PENDING) revert InvalidState();
            if (approved[nonce][msg.sender]) revert NotEligible();
            approved[nonce][msg.sender] = true;
            ++approvalCount;
        }
        emit GuardianApproved(nonce, msg.sender, emergency);
    }

    function finalizeRecovery() external nonReentrant {
        if (eligibleAction() != 2) revert NotEligible();
        _finalize();
    }

    function _finalize() private {
        authorizedAt = block.timestamp;
        for (uint256 i; i < assets.length; ++i) {
            address asset = assets[i];
            // Reject insolvency; direct unsolicited token transfers are never counted.
            if (_balance(asset) < accounted[asset]) revert InvalidAmount();
            snapshot[asset] = accounted[asset];
            remaining[asset] = accounted[asset];
            emit SnapshotTaken(asset, snapshot[asset]);
        }
        _transition(State.RECOVERY_AUTHORIZED);
        _completeIfEmpty();
    }

    /// @notice Anyone, including CRE, may progress only independently eligible transitions.
    function eligibleAction() public view returns (uint8) {
        if (recoveryPaused || rules.guardianThreshold == 0) return 0;
        if (state == State.ACTIVE && block.timestamp > deadline()) return 1;
        if (state == State.RECOVERY_PENDING && block.timestamp >= pendingAt + rules.challengePeriod && approvalCount >= rules.guardianThreshold) return 2;
        return 0;
    }

    /// @dev Nonce binding prevents delayed automation from acting on a later recovery request.
    function performUpkeep(uint8 action, uint256 expectedNonce) external nonReentrant returns (bool) {
        if (expectedNonce != recoveryNonce || action == 0 || action != eligibleAction()) return false;
        if (action == 1) _request();
        else _finalize();
        return true;
    }

    /// @notice Owner explicitly opts standard, non-rebasing, non-taxed tokens into this vault.
    function addSupportedToken(address token) external onlyOwner active {
        if (token == address(0) || token.code.length == 0 || supportedToken[token] || assets.length >= 16) revert UnsupportedAsset();
        supportedToken[token] = true;
        assets.push(token);
        emit AssetSupported(token);
    }

    receive() external payable active { _depositNative(); }
    function depositNative() external payable active { _depositNative(); }
    function _depositNative() private {
        if (msg.value == 0) revert InvalidAmount();
        accounted[address(0)] += msg.value;
        emit Deposited(address(0), msg.sender, msg.value);
    }

    function depositToken(address token, uint256 amount) external active nonReentrant {
        if (!supportedToken[token]) revert UnsupportedAsset();
        if (amount == 0) revert InvalidAmount();
        uint256 beforeBalance = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        if (IERC20(token).balanceOf(address(this)) != beforeBalance + amount) revert InvalidAmount();
        accounted[token] += amount;
        emit Deposited(token, msg.sender, amount);
    }

    function withdraw(address asset, uint256 amount) external onlyOwner active nonReentrant {
        if (amount == 0 || amount > accounted[asset]) revert InvalidAmount();
        accounted[asset] -= amount;
        _send(asset, owner, amount);
        emit Withdrawn(asset, amount);
    }

    function vestedBps() public view returns (uint256) {
        if (authorizedAt == 0) return 0;
        uint256 periods = (block.timestamp - authorizedAt) / rules.releaseInterval;
        // Clamp before multiplication so even unbounded passage of time is safe.
        uint256 periodsToFull = (10_000 - rules.initialBps + rules.trancheBps - 1) / rules.trancheBps;
        if (periods >= periodsToFull) return 10_000;
        return rules.initialBps + periods * rules.trancheBps;
    }

    function entitlement(address beneficiary, address asset) public view returns (uint256) {
        uint256 start;
        for (uint256 i; i < beneficiaries.length; ++i) {
            Beneficiary memory b = beneficiaries[i];
            if (b.account == beneficiary) return AllocationMath.portion(snapshot[asset], start, b.allocationBps);
            start += b.allocationBps;
        }
        return 0;
    }

    function claimable(address beneficiary, address asset, bool emergency) public view returns (uint256) {
        if (state != State.RECOVERY_AUTHORIZED && state != State.RELEASING) return 0;
        uint256 share = entitlement(beneficiary, asset);
        if (emergency) {
            if (rules.emergencyDelay == 0 || block.timestamp < authorizedAt + rules.emergencyDelay || emergencyApprovalCount < rules.guardianThreshold) return 0;
        } else share = Math.mulDiv(share, vestedBps(), 10_000);
        uint256 paid = claimed[beneficiary][asset];
        return share > paid ? share - paid : 0;
    }

    function claim(address asset, bool emergency) external nonReentrant {
        uint256 amount = claimable(msg.sender, asset, emergency);
        if (amount == 0) revert NothingToClaim();
        claimed[msg.sender][asset] += amount;
        remaining[asset] -= amount;
        if (state == State.RECOVERY_AUTHORIZED) _transition(State.RELEASING);
        _send(asset, msg.sender, amount);
        emit Claimed(asset, msg.sender, amount, emergency);
        _completeIfEmpty();
    }

    function _balance(address asset) private view returns (uint256) {
        return asset == address(0) ? address(this).balance : IERC20(asset).balanceOf(address(this));
    }

    function _send(address asset, address to, uint256 amount) private {
        if (asset == address(0)) {
            (bool ok,) = payable(to).call{value: amount}("");
            if (!ok) revert TransferFailed();
        } else {
            uint256 beforeBalance = IERC20(asset).balanceOf(address(this));
            uint256 recipientBalance = IERC20(asset).balanceOf(to);
            IERC20(asset).safeTransfer(to, amount);
            if (IERC20(asset).balanceOf(address(this)) != beforeBalance - amount || IERC20(asset).balanceOf(to) != recipientBalance + amount) revert InvalidAmount();
        }
    }

    function _completeIfEmpty() private {
        for (uint256 i; i < assets.length; ++i) if (remaining[assets[i]] != 0) return;
        if (state == State.RECOVERY_AUTHORIZED) _transition(State.RELEASING);
        _transition(State.COMPLETED);
    }

    function _transition(State next) private {
        State previous = state;
        state = next;
        emit StateChanged(previous, next, recoveryNonce);
    }
}
