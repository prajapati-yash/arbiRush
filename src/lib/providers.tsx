'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { MiniAppProvider } from '@neynar/react';
import { config } from './wagmi';
import { useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import React from "react";

// Custom hook for Coinbase Wallet detection and auto-connection
function useCoinbaseWalletAutoConnect() {
  const [isCoinbaseWallet, setIsCoinbaseWallet] = useState(false);
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    // Check if we're running in Coinbase Wallet
    const checkCoinbaseWallet = () => {
      const isInCoinbaseWallet =
        window.ethereum?.isCoinbaseWallet ||
        window.ethereum?.isCoinbaseWalletExtension ||
        window.ethereum?.isCoinbaseWalletBrowser;
      setIsCoinbaseWallet(!!isInCoinbaseWallet);
    };

    checkCoinbaseWallet();
    window.addEventListener("ethereum#initialized", checkCoinbaseWallet);

    return () => {
      window.removeEventListener("ethereum#initialized", checkCoinbaseWallet);
    };
  }, []);

  useEffect(() => {
    // Auto-connect if in Coinbase Wallet and not already connected
    if (isCoinbaseWallet && !isConnected) {
      const coinbaseConnector = connectors.find(connector => 
        connector.name === 'Coinbase Wallet'
      );
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector });
      }
    }
  }, [isCoinbaseWallet, isConnected, connect, connectors]);

  return isCoinbaseWallet;
}

// Wrapper component that provides Coinbase Wallet auto-connection
function CoinbaseWalletAutoConnect({
  children,
}: {
  children: React.ReactNode;
}) {
  useCoinbaseWalletAutoConnect();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniAppProvider analyticsEnabled={true}>
          <CoinbaseWalletAutoConnect>
            {children}
          </CoinbaseWalletAutoConnect>
        </MiniAppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
