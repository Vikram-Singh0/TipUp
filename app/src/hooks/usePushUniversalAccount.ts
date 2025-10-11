import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface PushUniversalAccount {
  address: string;
  getSigner: () => Promise<ethers.Signer>;
  chainInfo: {
    chainNamespace: string;
    chainId: string;
  };
}

export interface PushAccountState {
  account: PushUniversalAccount | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string;
}

// Push Chain configuration
const PUSH_CHAIN_CONFIG = {
  chainId: 999,
  rpcUrl: "https://rpc.push.org",
  chainNamespace: "eip155",
};

export const usePushUniversalAccount = () => {
  const [accountState, setAccountState] = useState<PushAccountState>({
    account: null,
    isConnected: false,
    isLoading: true,
    error: "",
  });

  const checkConnection = useCallback(async () => {
    try {
      setAccountState((prev) => ({ ...prev, isLoading: true, error: "" }));

      // Check if Push Universal Account is available
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];

        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);

          // Create Push Universal Account
          const account: PushUniversalAccount = {
            address: accounts[0],
            getSigner: async () => {
              const signer = await provider.getSigner();
              return signer;
            },
            chainInfo: {
              chainNamespace: PUSH_CHAIN_CONFIG.chainNamespace,
              chainId: PUSH_CHAIN_CONFIG.chainId.toString(),
            },
          };

          setAccountState({
            account,
            isConnected: true,
            isLoading: false,
            error: "",
          });
        } else {
          setAccountState({
            account: null,
            isConnected: false,
            isLoading: false,
            error: "",
          });
        }
      } else {
        setAccountState({
          account: null,
          isConnected: false,
          isLoading: false,
          error: "Push Universal Account not available",
        });
      }
    } catch (error) {
      console.error("Error checking Push Universal Account:", error);
      setAccountState({
        account: null,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to connect",
      });
    }
  }, []);

  const connectAccount = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await checkConnection();
      } else {
        throw new Error("Push Universal Account not available");
      }
    } catch (error) {
      console.error("Error connecting Push Universal Account:", error);
      setAccountState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to connect",
      }));
    }
  }, [checkConnection]);

  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts && accounts.length > 0) {
          checkConnection();
        } else {
          setAccountState({
            account: null,
            isConnected: false,
            isLoading: false,
            error: "",
          });
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkConnection]);

  return {
    ...accountState,
    connectAccount,
    checkConnection,
  };
};
