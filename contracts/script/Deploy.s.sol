// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import {RitualGacha} from "../src/RitualGacha.sol";

contract Deploy is Script {
    uint16 constant COMMON_COUNT = 51;
    uint16 constant RARE_COUNT = 14;
    uint16 constant EPIC_COUNT = 7;
    uint16 constant LEGENDARY_COUNT = 5;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console2.log("Deployer:", deployer);
        console2.log("Balance: ", deployer.balance);

        vm.startBroadcast(deployerKey);

        RitualGacha gacha = new RitualGacha();
        console2.log("RitualGacha deployed at:", address(gacha));

        gacha.setMemberCounts(COMMON_COUNT, RARE_COUNT, EPIC_COUNT, LEGENDARY_COUNT);
        console2.log("Member counts set: Common=%d Rare=%d", COMMON_COUNT, RARE_COUNT);
        console2.log("                   Epic=%d Legendary=%d", EPIC_COUNT, LEGENDARY_COUNT);

        vm.stopBroadcast();
    }
}
