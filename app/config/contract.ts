// TipUp Contract Configuration
export const CONTRACT_CONFIG = {
  // Replace with your deployed contract address
  TIPUP_CONTRACT:
    process.env.NEXT_PUBLIC_TIPUP_CONTRACT ||
    "0x85a243E0C6705561596BAd748B4d0AD08177620e",

  // Push Chain Configuration
  PUSH_RPC_URL:
    process.env.NEXT_PUBLIC_PUSH_RPC_URL ||
    "https://evm.rpc-testnet-donut-node2.push.org/",
  PUSH_CHAIN_ID: process.env.NEXT_PUBLIC_PUSH_CHAIN_ID || "999",

  // Push SDK Configuration
  // PUSH_API_KEY: process.env.NEXT_PUBLIC_PUSH_API_KEY || "",
};

// TipUp Contract ABI
export const TIPUP_ABI = [
  "function registerCreator(string memory _ensName, string memory _displayName, string memory _profileMessage, string memory _avatarUrl, string memory _websiteUrl, string memory _twitterHandle, string memory _instagramHandle, string memory _youtubeHandle, string memory _discordHandle) external",
  "function updateCreatorProfile(string memory _displayName, string memory _profileMessage, string memory _avatarUrl, string memory _websiteUrl, string memory _twitterHandle, string memory _instagramHandle, string memory _youtubeHandle, string memory _discordHandle) external",
  "function tip(string memory _ensName, string memory _message) external payable",
  "function tipByAddress(address _creatorAddress, string memory _message) external payable",
  "function getCreator(string memory _ensName) external view returns (tuple(address wallet, string ensName, uint256 totalTips, uint256 tipCount, bool isRegistered, string displayName, string profileMessage, string avatarUrl, string websiteUrl, string twitterHandle, string instagramHandle, string youtubeHandle, string discordHandle, uint256 registrationTime))",
  "function getCreatorByAddress(address _address) external view returns (tuple(address wallet, string ensName, uint256 totalTips, uint256 tipCount, bool isRegistered, string displayName, string profileMessage, string avatarUrl, string websiteUrl, string twitterHandle, string instagramHandle, string youtubeHandle, string discordHandle, uint256 registrationTime))",
  "function isCreatorRegistered(string memory _ensName) external view returns (bool)",
  "function isCreatorRegisteredByAddress(address _address) external view returns (bool)",
  "function getUserTips(address _user) external view returns (tuple(address from, address to, uint256 amount, string message, uint256 timestamp)[])",
  "function getTipCount(address _user) external view returns (uint256)",
  "function getContractStats() external view returns (uint256, uint256, uint256)",
  "event CreatorRegistered(string indexed ensName, address indexed wallet, string displayName)",
  "event CreatorProfileUpdated(string indexed ensName, string displayName)",
  "event TipSent(string indexed ensName, address indexed from, address indexed to, uint256 amount, string message, uint256 timestamp)",
] as const;

// Types
export interface Creator {
  wallet: string;
  ensName: string;
  totalTips: bigint;
  tipCount: bigint;
  isRegistered: boolean;
  displayName: string;
  profileMessage: string;
  avatarUrl: string;
  websiteUrl: string;
  twitterHandle: string;
  instagramHandle: string;
  youtubeHandle: string;
  discordHandle: string;
  registrationTime: bigint;
}

export interface Tip {
  from: string;
  to: string;
  amount: bigint;
  message: string;
  timestamp: bigint;
}
