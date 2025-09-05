import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArbiRun - DeFi Adventure Game",
  description: "Navigate through DeFi gates and manage your wealth in this exciting crypto adventure!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:frame" content='{"version":"next","imageUrl":"https://arbirush.vercel.app/og-image.png","button":{"title":"🚀 Start ArbiRun","action":{"type":"launch_miniapp","name":"ArbiRun","url":"https://arbirush.vercel.app","splashImageUrl":"https://arbirush.vercel.app/og-image.png","splashBackgroundColor":"#0f0e23"}}}' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
