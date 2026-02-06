import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { AudioProvider } from "@/components/AudioProvider";
import CustomCursor2 from "@/components/CustomCursor2";
import ConditionalInfobar from "@/components/ConditionalInfobar";
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local";
import { Toaster } from "sonner";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });

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
          <Analytics />
          <SmoothScroll>{children}</SmoothScroll>
        </AudioProvider>
        <Toaster
          toastOptions={{
            className: `${gilton.className} bg-green-500 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg uppercase font-bold`,
            style: {
              background: '#22c55e', // green-500
              color: 'black',
              border: '2px solid black',
              borderRadius: '12px',
            }
          }}
        />
      </body>
    </html>
  );
}
