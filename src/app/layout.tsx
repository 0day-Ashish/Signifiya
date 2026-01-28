import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { AudioProvider } from "@/components/AudioProvider";

import ConditionalInfobar from "@/components/ConditionalInfobar";
import { Analytics } from "@vercel/analytics/next"
import CustomCursor2 from "@/components/CustomCursor2";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGNIFIYA'26",
  description: "Designed & Developed by ard.dev & subham12r",
  icons: {
    icon: "/logo2.png",
    shortcut: "/logo2.png",
    apple: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomCursor2 />
  
        <ConditionalInfobar />
        <AudioProvider>
        <Analytics/>
          <SmoothScroll>{children}</SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
