// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract ThetaCollectibles is ERC721,ERC721Pausable, AccessControl,Ownable {

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    // Reflection pool address
    address internal reflectionPoolAddress;
    // Birthday baby pool address
    address internal birthdayBabyPoolAddress;
    // House fee address
    address internal houseFeeAddress;

    // Constants
    uint256 public constant MINT_PRICE = 0.0011 ether;
    uint8 internal  constant MINT_TAX_PERCENTAGE = 15;
    uint8 internal constant REFLECTION_POOL_PERCENTAGE = 5;
    uint8 internal constant BIRTHDAY_BABY_POOL_PERCENTAGE = 5;
    uint8 internal constant HOUSE_FEE_PERCENTAGE = 5;

    struct AstroData {
        bytes32 url;
        address owner;
    }

    struct BirthDateStruct {
        address lastUser;
        bytes32 birthdate;
        uint256 counter;
    }

    mapping (bytes32 => BirthDateStruct) public birthDateStruct;
    // Mapping from address to birthday
    mapping(address => uint256) public userBirthdays;
    // Mapping to check if a user has set their birthday
    mapping(address => bool) public isBirthdaySet;
    // Mapping from tokenId to astrological data
    mapping(uint256 => AstroData) public astroData;


    constructor(address _reflectionPoolAddress, address _birthdayBabyPoolAddress, address _houseFeeAddress) ERC721("ThetaCollectibles", "THETA") Ownable(msg.sender) {
        reflectionPoolAddress = _reflectionPoolAddress;
        birthdayBabyPoolAddress = _birthdayBabyPoolAddress;
        houseFeeAddress = _houseFeeAddress;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }


    // Prevent confliction
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return (ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId));
    }

    function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721, ERC721Pausable)
    returns (address)
    {
        return super._update(to, tokenId, auth);
    }



    // Events
    event NFTGifted(address indexed owner, uint256 indexed tokenId, AstroData);
    event ThetaMinted(address indexed owner, uint256 indexed tokenId, AstroData);


    // Modifiers
    modifier thetaMintable() {
        require(!isBirthdaySet[msg.sender], "User already set birthday");
        require(msg.value >= MINT_PRICE, "Insufficient ETH sent");
        _;
    }



    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }


    // Emits "RoleGranted" event (bytes32 indexed role, address indexed account, address indexed sender)
    function getMinterRole() public {
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // When new user minted NFT with same birthdate as last user, set last user of birthdate
    function setLastUserOfBirthdate(bytes32 birthdate) internal returns (BirthDateStruct memory) {
        uint256 _counter = birthDateStruct[birthdate].counter;
        _counter++;
        birthDateStruct[birthdate] = BirthDateStruct(msg.sender, birthdate, _counter);
        return birthDateStruct[birthdate];
    }

    // When new user minted NFT with same birthdate as last user, mint gift NFT for last user
    function dropNFTToOldUser(address oldUser, bytes32 giftNFTUrl) internal {
        uint256 tokenId = _nextTokenId++;
        _mint(oldUser, tokenId);
        astroData[tokenId] = AstroData(giftNFTUrl, oldUser);
        // Emit NFT gifted to old user
        emit NFTGifted(oldUser, tokenId, AstroData(giftNFTUrl, oldUser));
    }

    // If last user exist in given birthdate, mint gift NFT for last user with given NFT url and set last user of birthdate
    function dropNFTAndSetLastUserOfBirthdate(bytes32 birthdate, bytes32 giftNFTUrl) internal onlyRole(MINTER_ROLE) {
        BirthDateStruct memory currentBirthDateStruct = birthDateStruct[birthdate];
        address oldUser = currentBirthDateStruct.lastUser;

        // Drop NFT to the old user
        if (oldUser != address(0) && isBirthdaySet[oldUser]) {
            dropNFTToOldUser(oldUser,giftNFTUrl);
        }

        // Update with the new user
        setLastUserOfBirthdate(birthdate);
    }



    function mintTheta(bytes32 url, bytes32 birthdate) public payable onlyRole(MINTER_ROLE) thetaMintable() {
        // onlyRole reverts with AccessControlUnauthorizedAccount(address account, bytes32 neededRole) if user doesn't have minter role

        // example birthdate bytes32: 0x32352e30372e3230323400000000000000000000000000000000000000000000

        // Calculate tax amount
        uint256 taxAmount = (msg.value * MINT_TAX_PERCENTAGE) / 100;

        // Distribute tax
        uint256 reflectionPoolAmount = (taxAmount * REFLECTION_POOL_PERCENTAGE) / 100;
        uint256 birthdayBabyPoolAmount = (taxAmount * BIRTHDAY_BABY_POOL_PERCENTAGE) / 100;
        uint256 houseFeeAmount = (taxAmount * HOUSE_FEE_PERCENTAGE) / 100;

        uint256 remainingAmount = msg.value - taxAmount;

        // Transfer tax to respective addresses
        payable(reflectionPoolAddress).transfer(reflectionPoolAmount);
        payable(birthdayBabyPoolAddress).transfer(birthdayBabyPoolAmount);
        payable(houseFeeAddress).transfer(houseFeeAmount);
        payable(owner()).transfer(remainingAmount);

        // Mint the NFT
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        astroData[tokenId] = AstroData(url, msg.sender);
        isBirthdaySet[msg.sender] = true;


        // Emit minting event
        emit ThetaMinted(msg.sender, tokenId, AstroData(url,msg.sender));

        // Drop NFT if last user exists, else only set last user for birthdate
        if (birthDateStruct[birthdate].counter != 0) {
            dropNFTAndSetLastUserOfBirthdate(birthdate,"");
        } else {
            setLastUserOfBirthdate(birthdate);
        }

    }

}