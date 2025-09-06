import type { Metadata } from "next";
import {  Press_Start_2P, Saira   } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";


const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start-2p",
});
// ✅ Add Saira
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose the weights you need
  variable: "--font-saira",
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
        className={`${saira.variable} ${pressStart2P.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
