// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TipUp {
    struct Creator {
        address wallet;
        string ensName;
        uint256 totalTips;
        uint256 tipCount;
        bool isRegistered;
        string displayName;
        string profileMessage;
        string avatarUrl;
        string websiteUrl;
        string twitterHandle;
        string instagramHandle;
        string youtubeHandle;
        string discordHandle;
        uint256 registrationTime;
    }

    struct Tip {
        address from;
        address to;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    // State variables
    mapping(string => Creator) public creators;
    mapping(address => string) public addressToEns;
    mapping(address => Tip[]) public userTips;

    uint256 public totalTipsSent;
    uint256 public totalCreators;

    // Events
    event CreatorRegistered(
        string indexed ensName,
        address indexed wallet,
        string displayName
    );
    event CreatorProfileUpdated(string indexed ensName, string displayName);
    event TipSent(
        string indexed ensName,
        address indexed from,
        address indexed to,
        uint256 amount,
        string message,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyRegisteredCreator(string memory _ensName) {
        require(creators[_ensName].isRegistered, "Creator not registered");
        _;
    }

    modifier validEnsName(string memory _ensName) {
        require(bytes(_ensName).length > 0, "ENS name cannot be empty");
        _;
    }

    modifier validTipAmount() {
        require(msg.value > 0, "Tip amount must be greater than 0");
        _;
    }

    /**
     * @dev Register a creator with ENS name and profile message
     * @param _ensName The ENS name of the creator
     * @param _profileMessage The profile message for the creator
     */
    function registerCreator(
        string memory _ensName,
        string memory _displayName,
        string memory _profileMessage,
        string memory _avatarUrl,
        string memory _websiteUrl,
        string memory _twitterHandle,
        string memory _instagramHandle,
        string memory _youtubeHandle,
        string memory _discordHandle
    ) external validEnsName(_ensName) {
        require(!creators[_ensName].isRegistered, "ENS already registered");
        require(
            bytes(addressToEns[msg.sender]).length == 0,
            "Address already registered"
        );

        creators[_ensName] = Creator({
            wallet: msg.sender,
            ensName: _ensName,
            totalTips: 0,
            tipCount: 0,
            isRegistered: true,
            displayName: _displayName,
            profileMessage: _profileMessage,
            avatarUrl: _avatarUrl,
            websiteUrl: _websiteUrl,
            twitterHandle: _twitterHandle,
            instagramHandle: _instagramHandle,
            youtubeHandle: _youtubeHandle,
            discordHandle: _discordHandle,
            registrationTime: block.timestamp
        });

        addressToEns[msg.sender] = _ensName;
        totalCreators++;

        emit CreatorRegistered(_ensName, msg.sender, _displayName);
    }

    /**
     * @dev Update creator profile (only by creator themselves)
     * @param _displayName The display name
     * @param _profileMessage The profile message
     * @param _avatarUrl The avatar URL
     * @param _websiteUrl The website URL
     * @param _twitterHandle The Twitter handle
     * @param _instagramHandle The Instagram handle
     * @param _youtubeHandle The YouTube handle
     * @param _discordHandle The Discord handle
     */
    function updateCreatorProfile(
        string memory _displayName,
        string memory _profileMessage,
        string memory _avatarUrl,
        string memory _websiteUrl,
        string memory _twitterHandle,
        string memory _instagramHandle,
        string memory _youtubeHandle,
        string memory _discordHandle
    ) external {
        string memory ensName = addressToEns[msg.sender];
        require(bytes(ensName).length > 0, "Creator not registered");

        Creator storage creator = creators[ensName];
        creator.displayName = _displayName;
        creator.profileMessage = _profileMessage;
        creator.avatarUrl = _avatarUrl;
        creator.websiteUrl = _websiteUrl;
        creator.twitterHandle = _twitterHandle;
        creator.instagramHandle = _instagramHandle;
        creator.youtubeHandle = _youtubeHandle;
        creator.discordHandle = _discordHandle;

        emit CreatorProfileUpdated(ensName, _displayName);
    }

    /**
     * @dev Send a tip to a creator by ENS name
     * @param _ensName The ENS name of the creator
     * @param _message The tip message
     */
    function tip(
        string memory _ensName,
        string memory _message
    ) external payable onlyRegisteredCreator(_ensName) validTipAmount {
        Creator storage creator = creators[_ensName];

        // Transfer ETH to creator
        (bool success, ) = creator.wallet.call{value: msg.value}("");
        require(success, "Transfer failed");

        // Update creator stats
        creator.totalTips += msg.value;
        creator.tipCount++;

        // Update global stats
        totalTipsSent++;

        // Store tip record
        userTips[msg.sender].push(
            Tip({
                from: msg.sender,
                to: creator.wallet,
                amount: msg.value,
                message: _message,
                timestamp: block.timestamp
            })
        );

        emit TipSent(
            _ensName,
            msg.sender,
            creator.wallet,
            msg.value,
            _message,
            block.timestamp
        );
    }

    /**
     * @dev Send a tip to a creator by address
     * @param _creatorAddress The address of the creator
     * @param _message The tip message
     */
    function tipByAddress(
        address _creatorAddress,
        string memory _message
    ) external payable validTipAmount {
        string memory ensName = addressToEns[_creatorAddress];
        require(bytes(ensName).length > 0, "Creator not registered");

        Creator storage creator = creators[ensName];

        // Transfer ETH to creator
        (bool success, ) = creator.wallet.call{value: msg.value}("");
        require(success, "Transfer failed");

        // Update creator stats
        creator.totalTips += msg.value;
        creator.tipCount++;

        // Update global stats
        totalTipsSent++;

        // Store tip record
        userTips[msg.sender].push(
            Tip({
                from: msg.sender,
                to: creator.wallet,
                amount: msg.value,
                message: _message,
                timestamp: block.timestamp
            })
        );

        emit TipSent(
            ensName,
            msg.sender,
            creator.wallet,
            msg.value,
            _message,
            block.timestamp
        );
    }

    /**
     * @dev Get creator information by ENS name
     * @param _ensName The ENS name of the creator
     * @return The creator data
     */
    function getCreator(
        string memory _ensName
    ) external view returns (Creator memory) {
        return creators[_ensName];
    }

    /**
     * @dev Get creator information by address
     * @param _address The address of the creator
     * @return The creator data
     */
    function getCreatorByAddress(
        address _address
    ) external view returns (Creator memory) {
        string memory ensName = addressToEns[_address];
        require(bytes(ensName).length > 0, "Creator not registered");
        return creators[ensName];
    }

    /**
     * @dev Check if a creator is registered by ENS name
     * @param _ensName The ENS name to check
     * @return True if registered, false otherwise
     */
    function isCreatorRegistered(
        string memory _ensName
    ) external view returns (bool) {
        return creators[_ensName].isRegistered;
    }

    /**
     * @dev Check if a creator is registered by address
     * @param _address The address to check
     * @return True if registered, false otherwise
     */
    function isCreatorRegisteredByAddress(
        address _address
    ) external view returns (bool) {
        return bytes(addressToEns[_address]).length > 0;
    }

    /**
     * @dev Get all tips sent by a user
     * @param _user The user address
     * @return Array of tips sent by the user
     */
    function getUserTips(address _user) external view returns (Tip[] memory) {
        return userTips[_user];
    }

    /**
     * @dev Get the number of tips sent by a user
     * @param _user The user address
     * @return The number of tips sent
     */
    function getTipCount(address _user) external view returns (uint256) {
        return userTips[_user].length;
    }

    /**
     * @dev Get contract statistics
     * @return totalTipsSent, totalCreators, contract balance
     */
    function getContractStats()
        external
        view
        returns (uint256, uint256, uint256)
    {
        return (totalTipsSent, totalCreators, address(this).balance);
    }
}
