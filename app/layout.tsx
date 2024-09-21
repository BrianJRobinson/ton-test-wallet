
'use client'

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "./globals.css";


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
        <TonConnectUIProvider manifestUrl="https://ton-test-wallet.vercel.app/tonconnect-manifest.json">
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
