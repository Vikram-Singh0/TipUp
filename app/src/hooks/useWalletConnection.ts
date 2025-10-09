import { useState, useEffect } from "react";

export interface WalletState {
  isConnected: boolean;
  address: string;
  isLoading: boolean;
  error: string;
}

// Type guard to check if window.ethereum exists
const isEthereumAvailable = (): boolean => {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
};

export const useWalletConnection = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: "",
    isLoading: true,
    error: "",
  });

  const checkConnection = async () => {
    try {
      setWalletState((prev) => ({ ...prev, isLoading: true, error: "" }));

      if (!isEthereumAvailable()) {
        setWalletState((prev) => ({
          ...prev,
          isLoading: false,
          error: "No wallet detected. Please install a Web3 wallet.",
        }));
        return;
      }

      const accounts = (await window.ethereum!.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts && accounts.length > 0) {
        setWalletState({
          isConnected: true,
          address: accounts[0],
          isLoading: false,
          error: "",
        });
      } else {
        setWalletState({
          isConnected: false,
          address: "",
          isLoading: false,
          error: "",
        });
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to check wallet connection",
      }));
    }
  };

  const connectWallet = async () => {
    try {
      if (!isEthereumAvailable()) {
        throw new Error("No wallet detected");
      }

      const accounts = (await window.ethereum!.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts.length > 0) {
        setWalletState({
          isConnected: true,
          address: accounts[0],
          isLoading: false,
          error: "",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletState((prev) => ({
        ...prev,
        error: "Failed to connect wallet",
      }));
    }
  };

  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (isEthereumAvailable()) {
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts && accounts.length > 0) {
          setWalletState((prev) => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
            error: "",
          }));
        } else {
          setWalletState((prev) => ({
            ...prev,
            isConnected: false,
            address: "",
            error: "",
          }));
        }
      };

      const handleChainChanged = (...args: unknown[]) => {
        // Reload when chain changes
        console.log("Chain changed:", args);
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      };

      window.ethereum!.on("accountsChanged", handleAccountsChanged);
      window.ethereum!.on("chainChanged", handleChainChanged);

      return () => {
        if (isEthereumAvailable()) {
          window.ethereum!.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum!.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  return {
    ...walletState,
    connectWallet,
    checkConnection,
  };
};
