// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("Test asset", "TEST") { _mint(msg.sender, 1_000_000 ether); }
    function mint(address to, uint256 amount) external { _mint(to, amount); }
    function burn(address from, uint256 amount) external { _burn(from, amount); }
}
contract TaxToken is ERC20 {
    constructor() ERC20("Unsupported tax", "TAX") { _mint(msg.sender, 1_000_000 ether); }
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            super._update(from, to, value - value / 10);
            super._update(from, address(0), value / 10);
        } else super._update(from, to, value);
    }
}
interface IClaimVault { function claim(address asset, bool emergency) external; }
contract ReentrantHeir {
    IClaimVault public vault;
    uint256 public attempts;
    bool public reentered;
    function setVault(address target) external { vault = IClaimVault(target); }
    function take() external { vault.claim(address(0), false); }
    receive() external payable {
        ++attempts;
        (bool ok,) = address(vault).call(abi.encodeCall(IClaimVault.claim, (address(0), false)));
        reentered = ok;
    }
}
