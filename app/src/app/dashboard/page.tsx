"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PushUniversalAccountButton,
  usePushWalletContext,
  usePushChainClient,
} from "@pushchain/ui-kit";
import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
import CreatorRegistrationForm, {
  type CreatorFormData,
} from "@/components/creator/registration-form";
import CreatorAnalytics from "@/components/creator/analytics";
import {
  CONTRACT_CONFIG,
  TIPUP_ABI,
  type Creator,
  type Tip,
} from "@/config/contract";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateProfileLink,
  generateQRCode,
  copyToClipboard,
} from "@/lib/profile-utils";

import {
  Copy,
  ExternalLink,
  QrCode,
  Edit,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { connectionStatus } = usePushWalletContext();
  const { pushChainClient } = usePushChainClient();

  const isConnected = connectionStatus === "connected";
  const userAddress = pushChainClient?.universal?.account || "";
  const walletLoading = connectionStatus === "connecting";
  const walletError =
    !isConnected && connectionStatus !== "connecting"
      ? "Wallet not connected"
      : "";
  const [creator, setCreator] = useState<Creator | null>(null);
  const [userTips, setUserTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "settings"
  >("overview");

  // Contract configuration
  const contractAddress = CONTRACT_CONFIG.TIPUP_CONTRACT;
  const pushRpcUrl = CONTRACT_CONFIG.PUSH_RPC_URL;

  // Display any wallet errors
  useEffect(() => {
    if (walletError) {
      setError(walletError);
    }
  }, [walletError]);

  const fetchCreatorInfo = useCallback(async () => {
    if (!userAddress || !isConnected) return;

    try {
      setIsCreatorLoading(true);
      setError("");
      
      const provider = new ethers.JsonRpcProvider(pushRpcUrl);
      const contract = new ethers.Contract(
        contractAddress,
        TIPUP_ABI,
        provider
      );

      const isRegistered = await contract.isCreatorRegisteredByAddress(
        userAddress
      );

      if (isRegistered) {
        const creatorData = await contract.getCreatorByAddress(userAddress);

        const creatorInfo: Creator = {
          wallet: creatorData.wallet,
          ensName: creatorData.ensName,
          totalTips: creatorData.totalTips,
          tipCount: creatorData.tipCount,
          isRegistered: creatorData.isRegistered,
          displayName: creatorData.displayName,
          profileMessage: creatorData.profileMessage,
          avatarUrl: creatorData.avatarUrl,
          websiteUrl: creatorData.websiteUrl,
          twitterHandle: creatorData.twitterHandle,
          instagramHandle: creatorData.instagramHandle,
          youtubeHandle: creatorData.youtubeHandle,
          discordHandle: creatorData.discordHandle,
          registrationTime: creatorData.registrationTime,
        };
        setCreator(creatorInfo);

        // Generate QR code for the profile link
        const profileLink = generateProfileLink(creatorInfo.ensName);
        const qrCode = await generateQRCode(profileLink);
        setQrCodeUrl(qrCode);
      } else {
        setCreator(null);
      }
    } catch (error) {
      console.error("Error fetching creator info:", error);
      setError("Failed to load creator information. Please try again.");
    } finally {
      setIsCreatorLoading(false);
    }
  }, [userAddress, contractAddress, pushRpcUrl, isConnected]);

  const fetchUserTips = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(pushRpcUrl);
      const contract = new ethers.Contract(
        contractAddress,
        TIPUP_ABI,
        provider
      );

      const tips = await contract.getUserTips(userAddress);
      setUserTips(tips);
    } catch (error) {
      console.error("Error fetching user tips:", error);
    }
  }, [userAddress, contractAddress, pushRpcUrl]);

  useEffect(() => {
    if (userAddress && isConnected && !walletLoading) {
      fetchCreatorInfo();
      fetchUserTips();
    }
  }, [
    userAddress,
    isConnected,
    walletLoading,
    fetchCreatorInfo,
    fetchUserTips,
  ]);

  const handleRegisterCreator = async (formData: CreatorFormData) => {
    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }

    if (!pushChainClient) {
      setError("Wallet client not initialized. Please reconnect your wallet.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Check if already registered to prevent duplicate registration
      const provider = new ethers.JsonRpcProvider(pushRpcUrl);
      const readContract = new ethers.Contract(
        contractAddress,
        TIPUP_ABI,
        provider
      );
      
      const alreadyRegistered = await readContract.isCreatorRegisteredByAddress(userAddress);
      if (alreadyRegistered) {
        setError("This wallet is already registered as a creator.");
        await fetchCreatorInfo();
        return;
      }

      // Check if ENS name is already taken
      const ensNameTaken = await readContract.isCreatorRegistered(formData.ensName);
      if (ensNameTaken) {
        setError(`The ENS name "${formData.ensName}" is already taken. Please choose another one.`);
        return;
      }

      // Encode the function call
      const contract = new ethers.Interface(TIPUP_ABI);
      const data = contract.encodeFunctionData("registerCreator", [
        formData.ensName,
        formData.displayName,
        formData.profileMessage,
        formData.avatarUrl,
        formData.websiteUrl,
        formData.twitterHandle,
        formData.instagramHandle,
        formData.youtubeHandle,
        formData.discordHandle,
      ]);

      // Send transaction using pushChainClient
      const tx = await pushChainClient.universal.sendTransaction({
        to: contractAddress as `0x${string}`,
        data: data as `0x${string}`,
        value: BigInt(0),
      });
      
      setSuccess(`Registration transaction sent! Please wait...`);

      // Wait for transaction to be processed
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Check if transaction succeeded
      try {
        const txHashStr = typeof tx === 'object' && 'hash' in tx ? String(tx.hash) : String(tx);
        const receipt = await provider.getTransactionReceipt(txHashStr);
        
        if (receipt && receipt.status === 0) {
          throw new Error("Transaction was reverted. The ENS name or wallet may already be registered.");
        }
      } catch (receiptError) {
        console.warn("Could not verify transaction:", receiptError);
      }
      
      // Wait for registration to be confirmed
      let confirmed = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!confirmed && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;
        
        try {
          const isNowRegistered = await readContract.isCreatorRegisteredByAddress(userAddress);
          if (isNowRegistered) {
            confirmed = true;
          }
        } catch {
          // Retry on error
        }
      }

      if (confirmed) {
        setSuccess(`Successfully registered as ${formData.ensName}!`);
        await fetchCreatorInfo();
      } else {
        setError("Registration is taking longer than expected. Please refresh the page in a moment.");
        setTimeout(() => fetchCreatorInfo(), 5000);
      }
    } catch (error: unknown) {
      console.error("Error registering creator:", error);
      
      let errorMessage = "Failed to register creator";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes("user rejected")) {
          errorMessage = "Transaction was rejected.";
        } else if (errorMessage.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas.";
        } else if (errorMessage.includes("already registered")) {
          errorMessage = "This wallet or ENS name is already registered.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCreator = async (formData: CreatorFormData) => {
    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }

    if (!pushChainClient) {
      setError("Wallet client not initialized. Please reconnect your wallet.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Encode the function call
      const contract = new ethers.Interface(TIPUP_ABI);
      const data = contract.encodeFunctionData("updateCreatorProfile", [
        formData.displayName,
        formData.profileMessage,
        formData.avatarUrl,
        formData.websiteUrl,
        formData.twitterHandle,
        formData.instagramHandle,
        formData.youtubeHandle,
        formData.discordHandle,
      ]);

      // Send transaction using pushChainClient
      await pushChainClient.universal.sendTransaction({
        to: contractAddress as `0x${string}`,
        data: data as `0x${string}`,
        value: BigInt(0),
      });

      setSuccess("Profile update transaction sent!");

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      setSuccess("Successfully updated profile!");
      setIsEditing(false);

      // Refresh creator info
      await fetchCreatorInfo();
    } catch (error: unknown) {
      console.error("Error updating creator:", error);
      
      let errorMessage = "Failed to update profile";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes("user rejected")) {
          errorMessage = "Transaction was rejected.";
        } else if (errorMessage.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!creator) return;

    const profileLink = generateProfileLink(creator.ensName);
    const success = await copyToClipboard(profileLink);
    if (success) {
      setSuccess("Profile link copied to clipboard!");
    } else {
      setError("Failed to copy link to clipboard");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Creator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and track your tips
        </p>
      </header>
      {/* Wallet Connection */}
      <div className="flex justify-center">
        <PushUniversalAccountButton />
      </div>
      {/* Loading State */}
      {(walletLoading || isCreatorLoading) && (
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <h3 className="text-xl font-semibold">
                {walletLoading ? "Connecting Wallet..." : "Loading Profile..."}
              </h3>
              <p className="text-muted-foreground">
                {walletLoading
                  ? "Please wait while we connect to your wallet"
                  : "Fetching your creator profile information"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {!isConnected && !walletLoading ? (
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Connect your wallet to access the creator dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      ) : isConnected && !isCreatorLoading && !walletLoading && !creator ? (
        // Registration Form
        <div className="max-w-2xl mx-auto">
          <CreatorRegistrationForm
            onSubmit={handleRegisterCreator}
            isLoading={isLoading}
            error={error}
            success={success}
          />
        </div>
      ) : isEditing && creator ? (
        // Edit Profile Form
        <div className="max-w-2xl mx-auto">
          <CreatorRegistrationForm
            onSubmit={handleUpdateCreator}
            isLoading={isLoading}
            error={error}
            success={success}
            isEditing={true}
            initialData={{
              ensName: creator.ensName,
              displayName: creator.displayName,
              profileMessage: creator.profileMessage,
              avatarUrl: creator.avatarUrl,
              websiteUrl: creator.websiteUrl,
              twitterHandle: creator.twitterHandle,
              instagramHandle: creator.instagramHandle,
              youtubeHandle: creator.youtubeHandle,
              discordHandle: creator.discordHandle,
            }}
          />
          <div className="text-center mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : isConnected && !isCreatorLoading && !walletLoading && creator ? (
        // Creator Dashboard
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-card/50 backdrop-blur rounded-lg p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-[var(--push-pink-500)] text-white"
                    : "hover:bg-card"
                }`}
              >
                <Eye className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "analytics"
                    ? "bg-[var(--push-pink-500)] text-white"
                    : "hover:bg-card"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "settings"
                    ? "bg-[var(--push-pink-500)] text-white"
                    : "hover:bg-card"
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid gap-6">
              {/* Profile Overview */}
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      {creator.avatarUrl ? (
                        <Image
                          src={creator.avatarUrl}
                          alt={creator.displayName}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] flex items-center justify-center text-white text-xl font-bold">
                          {creator.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-2xl">
                          {creator.displayName}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          @{creator.ensName}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {creator.profileMessage}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-[var(--push-pink-500)]/10 to-[var(--push-pink-500)]/5 backdrop-blur border-[var(--push-pink-500)]/20 hover:border-[var(--push-pink-500)]/40 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-[var(--push-pink-500)]/10">
                        <DollarSign className="w-6 h-6 text-[var(--push-pink-500)]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">
                          Total Tips
                        </p>
                        <p className="text-2xl font-bold text-[var(--push-pink-500)]">
                          {ethers.formatEther(creator.totalTips)} PC
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[var(--push-purple-500)]/10 to-[var(--push-purple-500)]/5 backdrop-blur border-[var(--push-purple-500)]/20 hover:border-[var(--push-purple-500)]/40 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-[var(--push-purple-500)]/10">
                        <Users className="w-6 h-6 text-[var(--push-purple-500)]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">
                          Supporters
                        </p>
                        <p className="text-2xl font-bold text-[var(--push-purple-500)]">
                          {creator.tipCount.toString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Avg Tip</p>
                        <p className="text-2xl font-bold text-green-500">
                          {creator.tipCount > 0
                            ? Number(
                                ethers.formatEther(
                                  creator.totalTips / creator.tipCount
                                )
                              ).toFixed(4)
                            : "0"}{" "}
                          PC
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Link & QR Code - Enhanced */}
              <Card className="bg-gradient-to-br from-[var(--push-pink-500)]/10 to-[var(--push-purple-500)]/10 backdrop-blur border-[var(--push-pink-500)]/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <QrCode className="w-6 h-6 text-[var(--push-pink-500)]" />
                    Share Your Tip Link
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Share this link and QR code with your supporters to receive
                    tips
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Link with prominent copy button */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Your Unique Tip Link
                    </Label>
                    <div className="flex items-center space-x-2 p-2 bg-card/50 rounded-lg">
                      <Input
                        value={generateProfileLink(creator.ensName)}
                        readOnly
                        className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                      />
                      <Button
                        onClick={handleCopyLink}
                        size="sm"
                        className="bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)]"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/tip/${creator.ensName}`} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Test
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* QR Code with download option */}
                  {qrCodeUrl && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-center block">
                        QR Code
                      </Label>
                      <div className="flex justify-center">
                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                          <Image
                            src={qrCodeUrl}
                            alt="QR Code for Tip Link"
                            width={192}
                            height={192}
                            className="w-48 h-48"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.download = `tipup-qr-${creator.ensName}.png`;
                            link.href = qrCodeUrl;
                            link.click();
                          }}
                        >
                          📥 Download QR
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: `Tip ${creator.displayName}`,
                                text: `Support ${creator.displayName} with tips!`,
                                url: generateProfileLink(creator.ensName),
                              });
                            }
                          }}
                        >
                          📤 Share
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Social sharing suggestions */}
                  <div className="p-4 bg-card/30 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--push-pink-500)]" />
                      Sharing Tips
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Add the QR code to your social media bio</li>
                      <li>• Include the link in video descriptions</li>
                      <li>• Share on Twitter, Discord, or Instagram stories</li>
                      <li>• Print the QR code for offline events</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              {(creator.websiteUrl ||
                creator.twitterHandle ||
                creator.instagramHandle ||
                creator.youtubeHandle ||
                creator.discordHandle) && (
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {creator.websiteUrl && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <a
                            href={creator.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Website
                          </a>
                        </Badge>
                      )}
                      {creator.twitterHandle && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          @{creator.twitterHandle}
                        </Badge>
                      )}
                      {creator.instagramHandle && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          @{creator.instagramHandle}
                        </Badge>
                      )}
                      {creator.youtubeHandle && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          @{creator.youtubeHandle}
                        </Badge>
                      )}
                      {creator.discordHandle && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {creator.discordHandle}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Tips */}
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTips.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tips received yet</p>
                      <p className="text-sm">
                        Share your profile link to start receiving tips!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {userTips.slice(0, 10).map((tip, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                            <div className="font-medium">
                              {ethers.formatEther(tip.amount)} PC
                            </div>
                              <div className="text-sm text-muted-foreground">
                                From: {formatAddress(tip.from)}
                              </div>
                              {tip.message && (
                                <div className="text-sm mt-1 italic">
                                  &ldquo;{tip.message}&rdquo;
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(tip.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && <CreatorAnalytics tips={userTips} />}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="grid gap-6 max-w-2xl mx-auto">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when you get tips
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get weekly summaries via email
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Advanced</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download your tip history as CSV
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : null}{" "}
      {/* Status Messages */}
      {(error || success) && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/80 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-3 rounded-xl shadow-2xl backdrop-blur font-medium">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-950/80 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-6 py-3 rounded-xl shadow-2xl backdrop-blur font-medium">
              ✓ {success}
            </div>
          )}
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
              Chain ID: 42101 • Fast & Low-cost transactions
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
