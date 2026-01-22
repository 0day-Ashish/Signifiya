import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { AudioProvider } from "@/components/AudioProvider";
import CustomCursor from "@/components/CustomCursor2";
import ConditionalInfobar from "@/components/ConditionalInfobar";
import { Analytics } from "@vercel/analytics/next"
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

        <CustomCursor />
        <ConditionalInfobar />
        <AudioProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
