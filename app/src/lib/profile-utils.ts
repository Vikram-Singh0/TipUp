import { Creator } from "@/config/contract";

// Social media validation
export const validateSocialHandle = (
  handle: string,
  platform: string
): { isValid: boolean; error: string } => {
  if (!handle.trim()) return { isValid: true, error: "" }; // Optional field

  const trimmedHandle = handle.replace(/^@/, ""); // Remove @ if present

  switch (platform) {
    case "twitter":
      if (!/^[A-Za-z0-9_]{1,15}$/.test(trimmedHandle)) {
        return {
          isValid: false,
          error:
            "Twitter handle must be 1-15 characters (letters, numbers, underscore)",
        };
      }
      break;
    case "instagram":
      if (!/^[A-Za-z0-9_.]{1,30}$/.test(trimmedHandle)) {
        return {
          isValid: false,
          error:
            "Instagram handle must be 1-30 characters (letters, numbers, underscore, period)",
        };
      }
      break;
    case "youtube":
      if (!/^[A-Za-z0-9_-]{1,20}$/.test(trimmedHandle)) {
        return {
          isValid: false,
          error:
            "YouTube handle must be 1-20 characters (letters, numbers, underscore, hyphen)",
        };
      }
      break;
    case "discord":
      if (
        !/^.{2,32}#[0-9]{4}$/.test(handle) &&
        !/^[A-Za-z0-9_.]{2,32}$/.test(trimmedHandle)
      ) {
        return {
          isValid: false,
          error: "Discord handle format: username#1234 or new username",
        };
      }
      break;
  }

  return { isValid: true, error: "" };
};

// URL validation
export const validateUrl = (
  url: string
): { isValid: boolean; error: string } => {
  if (!url.trim()) return { isValid: true, error: "" }; // Optional field

  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return { isValid: false, error: "URL must use HTTP or HTTPS protocol" };
    }
    return { isValid: true, error: "" };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
};

// Display name validation
export const validateDisplayName = (
  name: string
): { isValid: boolean; error: string } => {
  if (!name.trim()) {
    return { isValid: false, error: "Display name is required" };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      error: "Display name must be at least 2 characters",
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: "Display name must be less than 50 characters",
    };
  }

  if (!/^[a-zA-Z0-9\s._-]+$/.test(name)) {
    return {
      isValid: false,
      error: "Display name can only contain letters, numbers, spaces, and .-_",
    };
  }

  return { isValid: true, error: "" };
};

// ENS name validation
export const validateEnsName = (
  ensName: string
): { isValid: boolean; error: string } => {
  if (!ensName.trim()) {
    return { isValid: false, error: "ENS name is required" };
  }

  // Must end with .eth
  if (!ensName.endsWith(".eth")) {
    return { isValid: false, error: "ENS name must end with .eth" };
  }

  // Extract name part (without .eth)
  const namePart = ensName.slice(0, -4);

  if (namePart.length < 3) {
    return {
      isValid: false,
      error: "ENS name must be at least 3 characters (excluding .eth)",
    };
  }

  if (namePart.length > 63) {
    return {
      isValid: false,
      error: "ENS name must be less than 63 characters (excluding .eth)",
    };
  }

  // Valid characters: lowercase letters, numbers, hyphens
  if (!/^[a-z0-9-]+$/.test(namePart)) {
    return {
      isValid: false,
      error:
        "ENS name can only contain lowercase letters, numbers, and hyphens",
    };
  }

  // Cannot start or end with hyphen
  if (namePart.startsWith("-") || namePart.endsWith("-")) {
    return {
      isValid: false,
      error: "ENS name cannot start or end with a hyphen",
    };
  }

  // Cannot have consecutive hyphens
  if (namePart.includes("--")) {
    return {
      isValid: false,
      error: "ENS name cannot have consecutive hyphens",
    };
  }

  return { isValid: true, error: "" };
};

// Generate profile link
export const generateProfileLink = (ensName: string): string => {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/tip/${ensName}`;
};

// Generate QR code data URL
export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const QRCode = (await import("qrcode")).default;
    return await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
};

// Format social handle for display
export const formatSocialHandle = (
  handle: string,
  platform: string
): string => {
  if (!handle) return "";

  const cleanHandle = handle.replace(/^@/, "");

  switch (platform) {
    case "twitter":
      return `@${cleanHandle}`;
    case "instagram":
      return `@${cleanHandle}`;
    case "youtube":
      return cleanHandle.startsWith("@") ? cleanHandle : `@${cleanHandle}`;
    case "discord":
      return cleanHandle;
    default:
      return cleanHandle;
  }
};

// Get social media URL
export const getSocialUrl = (handle: string, platform: string): string => {
  if (!handle) return "";

  const cleanHandle = handle.replace(/^@/, "");

  switch (platform) {
    case "twitter":
      return `https://twitter.com/${cleanHandle}`;
    case "instagram":
      return `https://instagram.com/${cleanHandle}`;
    case "youtube":
      return `https://youtube.com/@${cleanHandle}`;
    case "discord":
      return `https://discord.com/users/${cleanHandle}`;
    default:
      return "";
  }
};

// Check if creator profile is complete
export const isProfileComplete = (creator: Creator): boolean => {
  return !!(creator.displayName && creator.profileMessage && creator.ensName);
};

// Get profile completion percentage
export const getProfileCompletion = (creator: Creator): number => {
  const fields = [
    creator.displayName,
    creator.profileMessage,
    creator.avatarUrl,
    creator.websiteUrl,
    creator.twitterHandle,
    creator.instagramHandle,
    creator.youtubeHandle,
    creator.discordHandle,
  ];

  const completedFields = fields.filter(
    (field) => field && field.trim()
  ).length;
  return Math.round((completedFields / fields.length) * 100);
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const result = document.execCommand("copy");
    document.body.removeChild(textArea);
    return result;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};
