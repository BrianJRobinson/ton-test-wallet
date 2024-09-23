
'use client'

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "./globals.css";
import Script from "next/script";
import { TelegramProvider } from "./TelegramProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">  
      <head>
        <title>TON Connect Test</title>
      </head>
      <body>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <TelegramProvider>
          <TonConnectUIProvider manifestUrl="https://ton-test-wallet.vercel.app/tonconnect-manifest.json">
            {children}
          </TonConnectUIProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
