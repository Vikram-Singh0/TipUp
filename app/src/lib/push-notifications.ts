import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

interface NotificationPayload {
  title: string;
  body: string;
  cta?: string;
  img?: string;
}

// Use a flexible signer type that accepts various wallet implementations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SignerType = any;

class PushNotificationService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private user: any = null;
  private channelAddress: string = "";

  constructor(channelAddress?: string) {
    // This would be your channel address on Push Protocol
    this.channelAddress =
      channelAddress || process.env.NEXT_PUBLIC_PUSH_CHANNEL_ADDRESS || "";
  }

  async initialize(signer: SignerType) {
    try {
      this.user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      return true;
    } catch (error) {
      console.error("Failed to initialize Push API:", error);
      return false;
    }
  }

  async sendNotification(
    recipients: string[],
    payload: NotificationPayload
  ): Promise<boolean> {
    if (!this.user) {
      console.error("Push API not initialized");
      return false;
    }

    try {
      // Access channel property directly since user is typed as any
      const response = await this.user.channel.send(recipients, {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        payload: {
          title: payload.title,
          body: payload.body,
          cta: payload.cta || "",
          img: payload.img || "",
        },
      });

      console.log("Push notification sent:", response);
      return true;
    } catch (error) {
      console.error("Failed to send Push notification:", error);
      return false;
    }
  }

  async sendTipNotification(
    creatorAddress: string,
    tipperAddress: string,
    amount: string,
    message?: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      title: "🎉 New Tip Received!",
      body: `You received ${amount} ETH${
        message ? ` with message: "${message}"` : ""
      }`,
      cta: `${window.location.origin}/dashboard`,
      img: `${window.location.origin}/pushchain-logo.png`,
    };

    return this.sendNotification([creatorAddress], payload);
  }

  async sendFollowNotification(
    creatorAddress: string,
    followerAddress: string
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      title: "👥 New Follower!",
      body: `${followerAddress.slice(0, 6)}...${followerAddress.slice(
        -4
      )} started following you`,
      cta: `${window.location.origin}/dashboard`,
      img: `${window.location.origin}/pushchain-logo.png`,
    };

    return this.sendNotification([creatorAddress], payload);
  }

  // Fallback to browser notifications if Push Protocol fails
  async sendBrowserNotification(
    payload: NotificationPayload
  ): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.img || "/pushchain-logo.png",
        badge: "/pushchain-logo.png",
      });
      return true;
    } else if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.img || "/pushchain-logo.png",
          badge: "/pushchain-logo.png",
        });
        return true;
      }
    }

    return false;
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return Notification.permission === "granted";
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Export types
export type { NotificationPayload };

// Utility function for easy use in components
export const showNotification = async (
  payload: NotificationPayload,
  options: {
    usePush?: boolean;
    signer?: SignerType;
    recipients?: string[];
  } = {}
) => {
  const { usePush = false, signer, recipients = [] } = options;

  // Try Push Protocol first if enabled and configured
  if (usePush && signer && recipients.length > 0) {
    const initialized = await pushNotificationService.initialize(signer);
    if (initialized) {
      const success = await pushNotificationService.sendNotification(
        recipients,
        payload
      );
      if (success) return true;
    }
  }

  // Fallback to browser notification
  return pushNotificationService.sendBrowserNotification(payload);
};
