"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PushUniversalAccountButton,
  usePushWalletContext,
  usePushChainClient,
} from "@pushchain/ui-kit";
import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";

const Coin3D = dynamic(() => import("@/components/pushflow/coin-3d"), {
  ssr: false,
});

import { CONTRACT_CONFIG, TIPUP_ABI, type Creator } from "@/config/contract";
import { getSocialUrl, formatSocialHandle } from "@/lib/profile-utils";
import {
  ExternalLink,
  Globe,
  Twitter,
  Instagram,
  Youtube,
  MessageSquare,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function TipCreatorPage() {
  const params = useParams();
  const ensName = params?.ensName as string;

  const { connectionStatus } = usePushWalletContext();
  const { pushChainClient } = usePushChainClient();

  const isConnected = connectionStatus === "connected";
  const userAddress = pushChainClient?.universal?.account || "";
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creatorExists, setCreatorExists] = useState(false);

  // Contract configuration
  const contractAddress = CONTRACT_CONFIG.TIPUP_CONTRACT;
  const pushRpcUrl = CONTRACT_CONFIG.PUSH_RPC_URL;

  // Quick tip amounts
  const quickAmounts = ["0.001", "0.005", "0.01", "0.05", "0.1"];

  const fetchCreatorInfo = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(pushRpcUrl);
      const contract = new ethers.Contract(
        contractAddress,
        TIPUP_ABI,
        provider
      );

      const isRegistered = await contract.isCreatorRegistered(ensName);
      setCreatorExists(isRegistered);

      if (isRegistered) {
        const creatorData = await contract.getCreator(ensName);

        // Handle both old and new contract structure
        const creatorInfo: Creator = {
          wallet: creatorData.wallet,
          ensName: creatorData.ensName,
          totalTips: creatorData.totalTips,
          tipCount: creatorData.tipCount,
          isRegistered: creatorData.isRegistered,
          displayName: creatorData.displayName || creatorData.ensName, // fallback for old data
          profileMessage: creatorData.profileMessage || "",
          avatarUrl: creatorData.avatarUrl || "",
          websiteUrl: creatorData.websiteUrl || "",
          twitterHandle: creatorData.twitterHandle || "",
          instagramHandle: creatorData.instagramHandle || "",
          youtubeHandle: creatorData.youtubeHandle || "",
          discordHandle: creatorData.discordHandle || "",
          registrationTime: creatorData.registrationTime,
        };

        setCreator(creatorInfo);
      }
    } catch (error) {
      console.error("Error fetching creator info:", error);
      setError("Failed to fetch creator information");
    }
  }, [ensName, contractAddress, pushRpcUrl]);

  useEffect(() => {
    if (ensName) {
      fetchCreatorInfo();
    }
  }, [ensName, fetchCreatorInfo]);

  const handleTip = async () => {
    if (!tipAmount || !isConnected || !userAddress) {
      setError("Please connect your wallet and enter a tip amount");
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
      if (!pushChainClient) {
        throw new Error("Push Chain client not initialized");
      }

      const tipAmountWei = ethers.parseEther(tipAmount);

      // Create contract interface to encode the function call
      const contractInterface = new ethers.Interface(TIPUP_ABI);
      const encodedData = contractInterface.encodeFunctionData("tip", [
        ensName,
        tipMessage,
      ]);

      // Send the tip transaction using Push Chain Universal Transaction
      const tx = await pushChainClient.universal.sendTransaction({
        to: contractAddress as `0x${string}`,
        data: encodedData as `0x${string}`,
        value: tipAmountWei,
      });

      setSuccess(`Tip transaction sent! Hash: ${tx.hash}`);

      // Wait for confirmation
      await tx.wait();

      setSuccess(
        `✅ Tip sent successfully! ${tipAmount} PC sent to ${ensName}`
      );

      // Clear form
      setTipAmount("");
      setTipMessage("");

      // Refresh creator info
      await fetchCreatorInfo();

      // Send Push notification
      const message = `You sent ${tipAmount} PC to ${ensName}!`;
      await showPushNotification(message, creator?.wallet);
    } catch (error: unknown) {
      console.error("Error sending tip:", error);
      setError(error instanceof Error ? error.message : "Failed to send tip");
    } finally {
      setIsLoading(false);
    }
  };

  const showPushNotification = async (
    message: string,
    creatorAddress?: string
  ) => {
    try {
      // Show immediate feedback to tipper
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("TipUp - Tip Sent! 🎉", {
          body: message,
          icon: "/pushchain-logo.png",
          badge: "/pushchain-logo.png",
        });
      }

      // Try to send Push Protocol notification to creator
      if (creatorAddress && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const { showNotification } = await import("@/lib/push-notifications");
          await showNotification(
            {
              title: "🎉 New Tip Received!",
              body: `You received ${tipAmount} PC${
                tipMessage ? ` with message: "${tipMessage}"` : ""
              }`,
              cta: `${window.location.origin}/dashboard`,
              img: "/pushchain-logo.png",
            },
            {
              usePush: true,
              signer,
              recipients: [creatorAddress],
            }
          );
        } catch (pushError) {
          console.log("Push notification failed, using fallback:", pushError);
          // Fallback notification logic could go here
        }
      }

      // Also try to show success toast/alert
      setSuccess((prev) => prev + " 🔔 Notification sent!");
    } catch (error) {
      console.error("Error in notification system:", error);
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

  // Show error if creator doesn't exist
  if (ensName && !creatorExists && creatorExists !== undefined) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">❌</div>
              <h1 className="text-2xl font-semibold">Creator Not Found</h1>
              <p className="text-muted-foreground">
                The creator &ldquo;{ensName}&rdquo; is not registered on TipUp.
              </p>
              <div className="space-y-2">
                <Button asChild>
                  <Link href="/dashboard">Register as Creator</Link>
                </Button>
                <br />
                <Button variant="outline" asChild>
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-4">
        {creator && (
          <div className="flex items-center space-x-4">
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={creator.displayName}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--push-pink-500)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] flex items-center justify-center text-white text-xl font-bold">
                {creator.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">
                {creator.displayName}
              </h1>
              <p className="text-muted-foreground">@{ensName}</p>
            </div>
          </div>
        )}

        {!creator && (
          <h1 className="text-3xl md:text-4xl font-semibold">Tip @{ensName}</h1>
        )}

        <p className="text-muted-foreground">
          {creator?.profileMessage ||
            "Support your favorite creator in seconds."}
        </p>

        {/* Social Links */}
        {creator &&
          (creator.websiteUrl ||
            creator.twitterHandle ||
            creator.instagramHandle ||
            creator.youtubeHandle ||
            creator.discordHandle) && (
            <div className="flex flex-wrap gap-2">
              {creator.websiteUrl && (
                <a
                  href={creator.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/50 text-sm hover:bg-card transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {creator.twitterHandle && (
                <a
                  href={getSocialUrl(creator.twitterHandle, "twitter")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/50 text-sm hover:bg-card transition-colors"
                >
                  <Twitter className="w-3 h-3" />
                  {formatSocialHandle(creator.twitterHandle, "twitter")}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {creator.instagramHandle && (
                <a
                  href={getSocialUrl(creator.instagramHandle, "instagram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/50 text-sm hover:bg-card transition-colors"
                >
                  <Instagram className="w-3 h-3" />
                  {formatSocialHandle(creator.instagramHandle, "instagram")}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {creator.youtubeHandle && (
                <a
                  href={getSocialUrl(creator.youtubeHandle, "youtube")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/50 text-sm hover:bg-card transition-colors"
                >
                  <Youtube className="w-3 h-3" />
                  {formatSocialHandle(creator.youtubeHandle, "youtube")}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {creator.discordHandle && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/50 text-sm">
                  <MessageSquare className="w-3 h-3" />
                  {formatSocialHandle(creator.discordHandle, "discord")}
                </span>
              )}
            </div>
          )}
      </header>

      {/* Wallet Connection */}
      <div className="flex justify-center">
        <PushUniversalAccountButton />
      </div>

      {/* Creator Stats */}
      {creator && (
        <Card className="bg-gradient-to-br from-[var(--push-pink-500)]/10 via-[var(--push-purple-500)]/10 to-transparent backdrop-blur border-[var(--push-pink-500)]/20">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--push-pink-500)]" />
              Creator Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 rounded-xl bg-card/50 border border-[var(--push-pink-500)]/20">
                <div className="text-3xl font-bold text-[var(--push-pink-500)] mb-1">
                  {ethers.formatEther(creator.totalTips)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Total Tips (PC)
                </div>
              </div>
              <div className="p-4 rounded-xl bg-card/50 border border-[var(--push-purple-500)]/20">
                <div className="text-3xl font-bold text-[var(--push-purple-500)] mb-1">
                  {creator.tipCount.toString()}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Tip Count
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl bg-[radial-gradient(60%_60%_at_50%_40%,var(--push-pink-500)/20,transparent)] p-4">
          <Coin3D scale={0.9} />
        </div>

        <Card className="bg-card/50 backdrop-blur-enhanced border-[var(--push-pink-500)]/30 shadow-glow-pink">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[var(--push-pink-500)]" />
              Send a Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <Label>Quick Amounts (PC)</Label>
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={tipAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTipAmount(amount)}
                    className={
                      tipAmount === amount ? "bg-[var(--push-pink-500)]" : ""
                    }
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Custom Amount (PC)</Label>
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
              className="w-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] hover:from-[var(--push-pink-600)] hover:to-[var(--push-purple-600)] shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6"
              onClick={handleTip}
              disabled={
                !isConnected ||
                !tipAmount ||
                isLoading ||
                parseFloat(tipAmount) <= 0
              }
            >
              {isLoading
                ? "Sending... 🚀"
                : `Send ${tipAmount || "0"} PC Tip 💝`}
            </Button>

            {/* Status Messages */}
            {error && (
              <div className="text-red-700 dark:text-red-400 text-sm text-center p-3 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg font-medium">
                ❌ {error}
              </div>
            )}
            {success && (
              <div className="text-green-700 dark:text-green-400 text-sm text-center p-3 bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-lg font-medium">
                ✓ {success}
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Powered by Push Chain • Instant notifications • No platform fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Network Info */}
      <Card className="bg-card/30 backdrop-blur">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-sm font-medium">
              Network: Push Chain Testnet
            </div>
            <div className="text-xs text-muted-foreground">
              Chain ID: 42101 • Fast & Low-cost transactions
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
