interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (
    event: string,
    callback: (...args: unknown[]) => void
  ) => void;
  isMetaMask?: boolean;
  isConnected?: () => boolean;
}

interface Window {
  ethereum?: EthereumProvider;
}
