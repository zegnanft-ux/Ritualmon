// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RitualGacha is ERC721, Ownable {
    uint256 public constant PULL_COST = 0.0001 ether;

    uint16 public constant LEGENDARY_BP = 500;
    uint16 public constant EPIC_BP = 1200;
    uint16 public constant RARE_BP = 2800;

    uint8 public constant TIER_COMMON = 0;
    uint8 public constant TIER_RARE = 1;
    uint8 public constant TIER_EPIC = 2;
    uint8 public constant TIER_LEGENDARY = 3;

    uint16[4] public memberCount;

    struct Card {
        uint8 tier;
        uint16 memberIdx;
    }
    mapping(uint256 => Card) public cards;

    struct Commit {
        uint64 blockNumber;
        bool exists;
    }
    mapping(address => Commit) public pendingCommit;

    uint256 public nextTokenId = 1;

    event PullCommitted(address indexed player, uint64 revealBlock);
    event PullRevealed(address indexed player, uint256 indexed tokenId, uint8 tier, uint16 memberIdx);

    constructor() ERC721("Ritual Gacha", "RGACHA") Ownable(msg.sender) {}

    function setMemberCounts(uint16 common, uint16 rare, uint16 epic, uint16 legendary) external onlyOwner {
        memberCount[TIER_COMMON] = common;
        memberCount[TIER_RARE] = rare;
        memberCount[TIER_EPIC] = epic;
        memberCount[TIER_LEGENDARY] = legendary;
    }

    function commitPull() external payable {
        require(msg.value == PULL_COST, "wrong pull cost");
        Commit memory c = pendingCommit[msg.sender];
        if (c.exists) {
            require(block.number > uint256(c.blockNumber) + 256, "reveal pending pull first");
        }
        uint64 revealBlock = uint64(block.number + 1);
        pendingCommit[msg.sender] = Commit(revealBlock, true);
        emit PullCommitted(msg.sender, revealBlock);
    }

    function revealPull() external {
        Commit memory c = pendingCommit[msg.sender];
        require(c.exists, "no pending pull");
        require(block.number > c.blockNumber, "wait one block");

        bytes32 seed = blockhash(c.blockNumber);
        require(seed != bytes32(0), "commit expired, pull again");

        delete pendingCommit[msg.sender];

        uint256 rand = uint256(keccak256(abi.encode(seed, msg.sender)));
        uint16 tierRoll = uint16(rand % 10000);

        uint8 tier;
        if (tierRoll < LEGENDARY_BP) tier = TIER_LEGENDARY;
        else if (tierRoll < LEGENDARY_BP + EPIC_BP) tier = TIER_EPIC;
        else if (tierRoll < LEGENDARY_BP + EPIC_BP + RARE_BP) tier = TIER_RARE;
        else tier = TIER_COMMON;

        uint16 count = memberCount[tier];
        require(count > 0, "tier has no members yet");
        uint16 memberIdx = uint16((rand >> 16) % count);

        uint256 tokenId = nextTokenId++;
        cards[tokenId] = Card(tier, memberIdx);
        _safeMint(msg.sender, tokenId);

        emit PullRevealed(msg.sender, tokenId, tier, memberIdx);
    }

    function withdraw() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "withdraw failed");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return "";
    }
}
