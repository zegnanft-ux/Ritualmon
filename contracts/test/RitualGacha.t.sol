// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";
import {RitualGacha} from "../src/RitualGacha.sol";

contract RitualGachaTest is Test {
    RitualGacha gacha;
    address owner = address(0xA11CE);
    address player = address(0xB0B);

    function setUp() public {
        vm.prank(owner);
        gacha = new RitualGacha();

        vm.prank(owner);
        gacha.setMemberCounts(42, 20, 10, 5);

        vm.deal(player, 1 ether);
    }

    function test_commitAndReveal_mintsCard() public {
        vm.prank(player);
        gacha.commitPull{value: 0.0001 ether}();

        vm.roll(block.number + 2);

        vm.prank(player);
        gacha.revealPull();

        assertEq(gacha.balanceOf(player), 1, "player should own 1 card");
        assertEq(gacha.ownerOf(1), player, "token 1 should belong to player");

        (uint8 tier, uint16 memberIdx) = gacha.cards(1);
        assertLt(tier, 4, "tier must be 0..3");
        assertLt(memberIdx, gacha.memberCount(tier), "memberIdx within tier count");
    }

    function test_commitPull_revertsOnWrongCost() public {
        vm.prank(player);
        vm.expectRevert(bytes("wrong pull cost"));
        gacha.commitPull{value: 0.0002 ether}();
    }

    function test_revealPull_revertsBeforeNextBlock() public {
        vm.prank(player);
        gacha.commitPull{value: 0.0001 ether}();

        vm.prank(player);
        vm.expectRevert(bytes("wait one block"));
        gacha.revealPull();
    }

    function test_revealPull_revertsAfter256Blocks() public {
        vm.prank(player);
        gacha.commitPull{value: 0.0001 ether}();

        vm.roll(block.number + 300);

        vm.prank(player);
        vm.expectRevert(bytes("commit expired, pull again"));
        gacha.revealPull();
    }

    function test_doubleCommit_revertsWhilePending() public {
        vm.prank(player);
        gacha.commitPull{value: 0.0001 ether}();

        vm.prank(player);
        vm.expectRevert(bytes("reveal pending pull first"));
        gacha.commitPull{value: 0.0001 ether}();
    }

    function test_doubleCommit_allowedAfterExpiry() public {
        vm.prank(player);
        gacha.commitPull{value: 0.0001 ether}();

        vm.roll(block.number + 300);

        vm.prank(player);
        gacha.commitPull{value: 0.0001 ether}();

        (uint64 revealBlock, bool exists) = gacha.pendingCommit(player);
        assertTrue(exists);
        assertEq(revealBlock, uint64(block.number + 1));
    }

    function test_setMemberCounts_onlyOwner() public {
        vm.prank(player);
        vm.expectRevert();
        gacha.setMemberCounts(1, 1, 1, 1);
    }

    function test_withdraw_sendsBalanceToOwner() public {
        vm.prank(player);
        gacha.commitPull{value: 0.0001 ether}();

        uint256 ownerBefore = owner.balance;

        vm.prank(owner);
        gacha.withdraw();

        assertEq(address(gacha).balance, 0, "contract drained");
        assertEq(owner.balance, ownerBefore + 0.0001 ether, "owner received fee");
    }

    function test_withdraw_onlyOwner() public {
        vm.prank(player);
        vm.expectRevert();
        gacha.withdraw();
    }

    function test_distribution_acrossManyPulls() public {
        uint256 pulls = 200;
        uint256[4] memory tierHits;

        for (uint256 i = 0; i < pulls; i++) {
            address p = address(uint160(0x1000 + i));
            vm.deal(p, 1 ether);

            vm.prank(p);
            gacha.commitPull{value: 0.0001 ether}();

            vm.roll(block.number + 2);

            vm.prank(p);
            gacha.revealPull();

            (uint8 tier, ) = gacha.cards(i + 1);
            tierHits[tier]++;
        }

        emit log_named_uint("Common", tierHits[0]);
        emit log_named_uint("Rare", tierHits[1]);
        emit log_named_uint("Epic", tierHits[2]);
        emit log_named_uint("Legendary", tierHits[3]);

        assertEq(tierHits[0] + tierHits[1] + tierHits[2] + tierHits[3], pulls);
        assertGt(tierHits[0], 0, "at least 1 Common in 200 pulls");
    }
}
