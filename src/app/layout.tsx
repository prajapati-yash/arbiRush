import type { Metadata } from "next";
import { Geist, Geist_Mono, Luckiest_Guy } from "next/font/google";
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
const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luckiest-guy",
});

export const metadata: Metadata = {
  title: "ArbiRush - DeFi Adventure Game",
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
        <meta name="fc:frame" content='{"version":"next","imageUrl":"https://arbirush.vercel.app/og-image.png","button":{"title":"🚀 Start ArbiRush","action":{"type":"launch_miniapp","name":"ArbiRush","url":"https://arbirush.vercel.app","splashImageUrl":"https://arbirush.vercel.app/og-image.png","splashBackgroundColor":"#0f0e23"}}}' />
      </head>
      <body
        className={`${luckiestGuy.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
