"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/config/contract";
import { useWallet } from "@/contexts/WalletContext";

const Coin3D = dynamic(() => import("@/components/pushflow/coin-3d"), {
  ssr: false,
});

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

interface Creator {
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
  // Use wallet context
  const { isConnected, userAddress, signer, connectWallet } = useWallet();
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Universal tip link input
  const [tipLink, setTipLink] = useState("");

  // Contract configuration - memoized
  const contractConfig = useMemo(() => ({
    address: CONTRACT_CONFIG.TIPUP_CONTRACT,
    rpcUrl: CONTRACT_CONFIG.PUSH_RPC_URL,
  }), []);

  // Quick tip amounts
  const quickAmounts = useMemo(() => ["0.001", "0.005", "0.01", "0.05", "0.1"], []);

  // Clear messages after some time
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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
    setCreator(null);

    try {
      const provider = new ethers.JsonRpcProvider(contractConfig.rpcUrl);
      const contract = new ethers.Contract(
        contractConfig.address,
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
        setCreator({
          wallet: creatorData.wallet,
          ensName: creatorData.ensName,
          totalTips: creatorData.totalTips,
          tipCount: creatorData.tipCount,
          isRegistered: creatorData.isRegistered,
          profileMessage: creatorData.profileMessage,
          registrationTime: creatorData.registrationTime,
          displayName: creatorData.displayName || creatorData.ensName,
          avatarUrl: creatorData.avatarUrl || "",
          websiteUrl: creatorData.websiteUrl || "",
          twitterHandle: creatorData.twitterHandle || "",
          instagramHandle: creatorData.instagramHandle || "",
          discordHandle: creatorData.discordHandle || "",
          youtubeHandle: creatorData.youtubeHandle || "",
        });
        setSuccess(
          `✅ Found creator: ${creatorData.displayName || creatorData.ensName}`
        );
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

  const handleTip = async () => {
    if (!tipAmount || !isConnected || !userAddress || !creator || !signer) {
      setError(
        "Please connect your wallet, find a creator, and enter a tip amount"
      );
      return;
    }

    if (parseFloat(tipAmount) <= 0) {
      setError("Please enter a valid tip amount");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const contract = new ethers.Contract(contractConfig.address, TIPUP_ABI, signer);

      const tipAmountWei = ethers.parseEther(tipAmount);

      // Send the tip transaction using ENS name
      const tx = await contract.tip(creator.ensName, tipMessage, {
        value: tipAmountWei,
      });

      setSuccess(`Tip transaction sent! Hash: ${tx.hash}`);

      // Wait for confirmation
      await tx.wait();

      setSuccess(
        `✅ Tip sent successfully! ${tipAmount} ETH sent to ${creator.displayName}`
      );

      // Clear form
      setTipAmount("");
      setTipMessage("");

      // Refresh creator info
      await searchCreator();

      // Send Push notification (mock for now)
      showPushNotification(
        `You sent ${tipAmount} ETH to ${creator.displayName}!`
      );
    } catch (error: unknown) {
      console.error("Error sending tip:", error);
      setError(error instanceof Error ? error.message : "Failed to send tip");
    } finally {
      setIsLoading(false);
    }
  };

  const showPushNotification = (message: string) => {
    // Mock Push notification - in real implementation, this would use Push SDK
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TipUp Notification", {
        body: message,
        icon: "/pushchain-logo.png",
      });
    } else {
      alert(`Push Notification: ${message}`);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const getSocialLinks = () => {
    if (!creator) return [];

    const links = [];
    if (creator.websiteUrl)
      links.push({ name: "Website", url: creator.websiteUrl, icon: "🌐" });
    if (creator.twitterHandle)
      links.push({
        name: "Twitter",
        url: `https://twitter.com/${creator.twitterHandle}`,
        icon: "🐦",
      });
    if (creator.instagramHandle)
      links.push({
        name: "Instagram",
        url: `https://instagram.com/${creator.instagramHandle}`,
        icon: "📸",
      });
    if (creator.discordHandle)
      links.push({
        name: "Discord",
        url: `https://discord.com/users/${creator.discordHandle}`,
        icon: "💬",
      });
    if (creator.youtubeHandle)
      links.push({
        name: "YouTube",
        url: `https://youtube.com/@${creator.youtubeHandle}`,
        icon: "📺",
      });

    return links;
  };

  return (
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
          {!isConnected ? (
            <Button 
              onClick={connectWallet}
              className="bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)]"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium">Connected</p>
                <p className="text-xs text-muted-foreground">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </p>
              </div>
            </div>
          )}
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
                  className="flex-1 h-12 text-center"
                />
                <Button
                  onClick={searchCreator}
                  disabled={isSearching || !tipLink.trim()}
                  className="bg-[var(--push-purple-500)] hover:bg-[var(--push-purple-600)] h-12 px-6"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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

        {/* Creator Profile */}
        {creator && (
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Creator Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={creator.avatarUrl}
                    alt={creator.displayName}
                  />
                  <AvatarFallback>
                    {creator.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {creator.displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {creator.ensName}
                    </p>
                  </div>

                  {creator.profileMessage && (
                    <p className="text-sm">{creator.profileMessage}</p>
                  )}

                  {/* Social Links */}
                  {getSocialLinks().length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {getSocialLinks().map((link, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <span>{link.icon}</span>
                            <span>{link.name}</span>
                          </a>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold text-[var(--push-pink-500)]">
                        {ethers.formatEther(creator.totalTips)} ETH
                      </span>
                      <span className="text-muted-foreground ml-1">raised</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--push-purple-500)]">
                        {creator.tipCount.toString()}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        supporters
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tipping Interface */}
        {creator && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl bg-[radial-gradient(60%_60%_at_50%_40%,var(--push-pink-500)/20,transparent)] p-4">
              <Coin3D scale={0.9} />
            </div>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Send a Tip to {creator.displayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Amount Buttons */}
                <div className="space-y-2">
                  <Label>Quick Amounts (ETH)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={tipAmount === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTipAmount(amount)}
                        className={
                          tipAmount === amount
                            ? "bg-[var(--push-pink-500)]"
                            : ""
                        }
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Custom Amount (ETH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.01"
                    step="0.001"
                    min="0"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="text-center"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Leave a nice message for the creator..."
                    maxLength={280}
                    value={tipMessage}
                    onChange={(e) => setTipMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {tipMessage.length}/280 characters
                  </div>
                </div>

                {/* Send Tip Button */}
                <Button
                  className="w-full bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)]"
                  onClick={handleTip}
                  disabled={
                    !isConnected ||
                    !tipAmount ||
                    isLoading ||
                    parseFloat(tipAmount) <= 0
                  }
                >
                  {isLoading
                    ? "Sending..."
                    : `Send ${tipAmount || "0"} ETH Tip`}
                </Button>

                {/* Status Messages */}
                {error && (
                  <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-500 text-sm text-center p-2 bg-green-50 rounded">
                    {success}
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Powered by Push Chain • Instant notifications • No platform
                  fees
                </p>
              </CardContent>
            </Card>
          </div>
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
  );
}
