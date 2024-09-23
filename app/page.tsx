'use client'

import { Address } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useState, useCallback, useEffect } from "react";
import { WebApp } from '@twa-dev/types';
import { useTelegram } from "./TelegramProvider";

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const { user: tgUser, webApp } = useTelegram();
  const [tonConnectUi] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [user, setUser] = useState<any>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [error, setError] = useState<any>(null);
  const [notification, setNotification] = useState('');
  const [extraInfo, setExtraInfo] = useState('');

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

    if (typeof window !== 'undefined' && webApp) {
      if (tgUser) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify(tgUser),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.Error);
            setExtraInfo(data.Error);
          } else {
            setUser(data.user);
            setExtraInfo(data.extra)
          }
        })
        .catch((err) => {
          setError(`Failed to fetch user data: ${err} `);
        })
      } else {
        setError('No User data available');
      }
    } else {
     setError(`This app needs to be opened in Telegram`);
    }

    const checkWalletConnection = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      tonConnectUi.account?.address ? handleWallectConnection(tonConnectUi.account?.address) : handleWalletDisconnection();
    }

    // just a comment
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
  }, [tonConnectUi, handleWallectConnection, handleWalletDisconnection, tgUser, user, webApp, extraInfo]);

  const handleIncreasePoints = async () => {
    if (!tgUser) return;

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { tgUser }),
      })      
      const data = await res.json()
      if ( data.success) {
        setUser({...user, points: data.points });
        setNotification('Points increased successfully');
        setTimeout(() => setNotification(''), 3000)
      } else {
        setError('Failed to increase points');
      }
    } catch (err) {
      setError(`An error occurred while increasing points: ${err}`);
    }
  }
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

  if (!tonWalletAddress) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">TON Connect Demo</h1>
        <p> Current User: {tgUser?.id} : {tgUser?.username} </p>
        <p>Info: {extraInfo}</p>
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
  } else {
    if (error) {
      return <div className="contiainer mx-auto p-4 text-red-500">{error}</div>
    }

    if (!user) return <div className="container mx-auto p-4">Loading...</div>

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
        <p>Your current points: {user.points}</p>
        <button
          onClick={handleIncreasePoints}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Increase Points
        </button> 
        {notification && (
          <div className="mt-4 p-2 2bg-green-100 text-green-700 rounded">
            {notification}
          </div>
        )}
      </div>
    )
  }

}
