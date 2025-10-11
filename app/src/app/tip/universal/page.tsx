"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoinLoader from "@/components/ui/coin-loader";
import {
  PushUniversalWalletProvider,
  PushUniversalAccountButton,
  PushUI,
} from "@pushchain/ui-kit";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/config/contract";

// TipUp Contract ABI (enhanced with new fields)
const TIPUP_ABI = [
  "function tip(string memory _ensName, string memory _message) external payable",
  "function tipByAddress(address _creatorAddress, string memory _message) external payable",
  "function getCreator(string memory _ensName) external view returns (tuple(address wallet, string ensName, uint256 totalTips, uint256 tipCount, bool isRegistered, string profileMessage, uint256 registrationTime, string displayName, string avatarUrl, string websiteUrl, string twitterHandle, string instagramHandle, string discordHandle, string youtubeHandle))",
  "function getCreatorByAddress(address _address) external view returns (tuple(address wallet, string ensName, uint256 totalTips, uint256 tipCount, bool isRegistered, string profileMessage, uint256 registrationTime, string displayName, string avatarUrl, string websiteUrl, string twitterHandle, string instagramHandle, string discordHandle, string youtubeHandle))",
  "function isCreatorRegistered(string memory _ensName) external view returns (bool)",
  "function isCreatorRegisteredByAddress(address _address) external view returns (bool)",
  "event TipSent(string indexed ensName, address indexed from, address indexed to, uint256 amount, string message, uint256 timestamp)",
];

interface CreatorContractResponse {
  wallet: string;
  ensName: string;
  totalTips: bigint;
  tipCount: bigint;
  isRegistered: boolean;
  profileMessage: string;
  registrationTime: bigint;
  displayName: string;
  avatarUrl: string;
  websiteUrl: string;
  twitterHandle: string;
  instagramHandle: string;
  discordHandle: string;
  youtubeHandle: string;
}

export default function UniversalTipPage() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // Universal tip link input
  const [tipLink, setTipLink] = useState("");

  // Contract configuration
  const contractAddress = CONTRACT_CONFIG.TIPUP_CONTRACT;
  const pushRpcUrl = CONTRACT_CONFIG.PUSH_RPC_URL;

  // Wallet configuration
  const walletConfig = {
    network: PushUI.CONSTANTS.PUSH_NETWORK.TESTNET,
  };

  const parseCreatorInfo = (input: string): { type: string; value: string } => {
    const inputValue = input as string;

    // Check if it's a full tip link (like tipup.app/tip/creator.eth)
    const linkMatch = inputValue.match(
      /(?:https?:\/\/)?(?:www\.)?(?:tipup\.app|localhost:\d+)\/tip\/(.+)/
    );
    if (linkMatch && linkMatch[1]) {
      return { type: "ens", value: linkMatch[1] };
    }

    // Check if it's an Ethereum address
    const isAddress = Boolean(ethers.isAddress && ethers.isAddress(inputValue));
    if (isAddress) {
      return { type: "address", value: inputValue };
    }

    // Check if it's an ENS name (ends with .eth)
    if (inputValue.length > 4 && inputValue.slice(-4) === ".eth") {
      return { type: "ens", value: inputValue };
    }

    // Default to ENS name
    return { type: "ens", value: inputValue };
  };

  const searchCreator = async () => {
    if (!tipLink.trim()) {
      setError("Please enter a creator link, ENS name, or wallet address");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const provider = new ethers.JsonRpcProvider(pushRpcUrl);
      const contract = new ethers.Contract(
        contractAddress,
        TIPUP_ABI,
        provider
      );

      const { type, value } = parseCreatorInfo(tipLink.trim());

      let isRegistered = false;
      let creatorData: CreatorContractResponse | null = null;

      if (type === "address") {
        isRegistered = await contract.isCreatorRegisteredByAddress(value);
        if (isRegistered) {
          creatorData = (await contract.getCreatorByAddress(
            value
          )) as CreatorContractResponse;
        }
      } else {
        isRegistered = await contract.isCreatorRegistered(value);
        if (isRegistered) {
          creatorData = (await contract.getCreator(
            value
          )) as CreatorContractResponse;
        }
      }

      if (isRegistered && creatorData) {
        // Redirect to the individual creator page
        const creatorEnsName = creatorData.ensName;
        router.push(`/tip/${creatorEnsName}`);
      } else {
        setError("Creator not found. Make sure they are registered on TipUp.");
      }
    } catch (error) {
      console.error("Error searching for creator:", error);
      setError("Failed to search for creator. Please check your input.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PushUniversalWalletProvider config={walletConfig}>
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] text-white text-2xl mb-4">
            ❤️
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Universal Tipping
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Support your favorite creators instantly! Paste any creator&apos;s
            tip link, ENS name, or wallet address to send tips from any wallet
            on any chain.
          </p>
        </header>

        {/* Wallet Connection */}
        <div className="flex justify-center">
          <PushUniversalAccountButton />
        </div>

        {/* Creator Search */}
        <Card className="bg-card/50 backdrop-blur border-[var(--push-purple-500)]/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔍</span>
              Find Creator to Tip
            </CardTitle>
            <p className="text-muted-foreground">
              Enter any creator&apos;s information to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="tipLink" className="text-base font-medium">
                Creator Link, ENS Name, or Wallet Address
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tipLink"
                  placeholder="Paste here..."
                  value={tipLink}
                  onChange={(e) => setTipLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSearching && tipLink.trim()) {
                      searchCreator();
                    }
                  }}
                  className="flex-1 h-12 text-center"
                />
                <Button
                  onClick={searchCreator}
                  disabled={isSearching || !tipLink.trim()}
                  className="bg-[var(--push-purple-500)] hover:bg-[var(--push-purple-600)] h-12 px-6"
                >
                  {isSearching ? (
                    <>
                      <CoinLoader size={16} className="mr-2" />
                      Searching...
                    </>
                  ) : (
                    "🔍 Find Creator"
                  )}
                </Button>
              </div>
            </div>

            {/* Example formats with copy buttons */}
            <div className="bg-card/30 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-sm">
                ✨ Supported Formats (click to try):
              </h4>
              <div className="grid gap-2">
                <button
                  onClick={() => setTipLink("tipup.app/tip/creator.eth")}
                  className="flex items-center justify-between p-2 bg-card/50 rounded hover:bg-card transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-mono">
                      tipup.app/tip/creator.eth
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Full tip link
                    </div>
                  </div>
                  <span className="text-xs text-[var(--push-purple-500)]">
                    Try →
                  </span>
                </button>
                <button
                  onClick={() => setTipLink("creator.eth")}
                  className="flex items-center justify-between p-2 bg-card/50 rounded hover:bg-card transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-mono">creator.eth</div>
                    <div className="text-xs text-muted-foreground">
                      ENS name only
                    </div>
                  </div>
                  <span className="text-xs text-[var(--push-purple-500)]">
                    Try →
                  </span>
                </button>
                <button
                  onClick={() =>
                    setTipLink("0x742d35Cc6634C0532925a3b8D404fddE9C")
                  }
                  className="flex items-center justify-between p-2 bg-card/50 rounded hover:bg-card transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-mono">0x742d35Cc...</div>
                    <div className="text-xs text-muted-foreground">
                      Wallet address
                    </div>
                  </div>
                  <span className="text-xs text-[var(--push-purple-500)]">
                    Try →
                  </span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                💡 <strong>Tip:</strong> Creators can share their links via QR
                codes, social media, or direct messages
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-600 text-sm text-center">❌ {error}</div>
            </CardContent>
          </Card>
        )}
        {isSearching && (
          <Card className="border-pink-200 bg-pink-50">
            <CardContent className="pt-6">
              <div className="text-pink-600 text-sm text-center flex items-center justify-center gap-3">
                <CoinLoader size={24} />
                Searching for creator, please wait...
              </div>
            </CardContent>
          </Card>
        )}

        {/* Network Info */}
        <Card className="bg-card/30 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium">
                Network: Push Chain Testnet
              </div>
              <div className="text-xs text-muted-foreground">
                Chain ID: 999 • Fast & Low-cost transactions
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </PushUniversalWalletProvider>
  );
}
