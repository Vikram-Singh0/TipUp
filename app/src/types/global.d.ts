// Global type declarations for Web3/MetaMask integration

// EIP-1193 Provider interface compatible with ethers.js
interface EthereumProvider {
  isMetaMask?: boolean;
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, handler: (...args: unknown[]) => void): void;
  removeListener(event: string, handler: (...args: unknown[]) => void): void;
  selectedAddress?: string | null;
  chainId?: string;
  networkVersion?: string;
}

// Extend the global namespace for ethereum provider
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
