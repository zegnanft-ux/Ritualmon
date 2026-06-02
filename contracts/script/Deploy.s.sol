// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import {RitualGacha} from "../src/RitualGacha.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console2.log("Deployer:", deployer);
        console2.log("Balance: ", deployer.balance);

        vm.startBroadcast(deployerKey);

        RitualGacha gacha = new RitualGacha();
        console2.log("RitualGacha deployed at:", address(gacha));

        vm.stopBroadcast();
    }
}
