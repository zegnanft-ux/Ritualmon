// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RitualGacha is Ownable {
    uint256 public constant PULL_COST = 0.0001 ether;

    event Pulled(address indexed player);

    constructor() Ownable(msg.sender) {}

    function pull() external payable {
        require(msg.value == PULL_COST, "wrong pull cost");
        emit Pulled(msg.sender);
    }

    function withdraw() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "withdraw failed");
    }
}
