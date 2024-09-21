
'use client'

import { Address } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useState, useCallback, useEffect } from "react";

export default function Home() {
  const [tonConnectUi] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleWallectConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    console.log("Wallet connected successfully");
    setIsLoading(false);
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log("Wallet disconnected successfully");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      tonConnectUi.account?.address ?
        handleWallectConnection(tonConnectUi.account?.address) :
        handleWalletDisconnection()
    }

    checkWalletConnection();

    const unsubscribe = tonConnectUi.onStatusChange((wallet) => {
      if(wallet) {
        handleWallectConnection(wallet.account.address);
      } else {
        console.log("No Wallet found");
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    }
  }, [tonConnectUi, handleWallectConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    console.log("Button Clicked");
    if (tonConnectUi.connected)
    {
      console.log("Connected - going to disconnect")
      setIsLoading(true);
      await tonConnectUi.disconnect();
    } else
    {
      console.log("Disconnected - going to connect")
      await tonConnectUi.openModal();
    }
  }

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0,4)}...${tempAddress.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justift-center">
        <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
          Loading...
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">TON Connect Demo</h1>
      {tonWalletAddress ? (
        <div className="flex flex-col item-center">
          <p className="mb-4">Connected: {formatAddress(tonWalletAddress)}</p>
          <button
            onClick={handleWalletAction}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Disconnect Wallet
            </button>
        </div>
      ) : (
        <button
          onClick={handleWalletAction}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect TON Wallet
        </button>
      )}
    </main>
  );

}
