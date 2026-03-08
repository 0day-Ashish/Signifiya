import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { AudioProvider } from "@/components/AudioProvider";
import CustomCursor2 from "@/components/CustomCursor2";
import ConditionalInfobar from "@/components/ConditionalInfobar";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://signifiya.in";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SIGNIFIYA'26 | SOET Tech-Cultural Fest",
    template: "%s | SIGNIFIYA'26",
  },
  description:
    "Official website of SIGNIFIYA'26, the annual tech fest of SOET. Explore events, schedule, sponsors, gallery, and registration.",
  keywords: [
    "Signifiya",
    "Signifiya 2026",
    "SOET fest",
    "tech-cultural fest",
    "college fest",
    "events",
    "gallery",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "SIGNIFIYA'26 | SOET Tech-Cultural Fest",
    description:
      "Official website of SIGNIFIYA'26, the annual tech-cultural fest of SOET.",
    siteName: "SIGNIFIYA'26",
    images: [
      {
        url: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/logo2.png",
        width: 1200,
        height: 630,
        alt: "SIGNIFIYA'26",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGNIFIYA'26 | SOET Tech-Cultural Fest",
    description:
      "Official website of SIGNIFIYA'26, the annual tech-cultural fest of SOET.",
    images: ["https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/logo2.png"],
  },
  icons: {
    icon: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/logo2.png",
    shortcut: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/logo2.png",
    apple: "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const CDN = "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev";
  return (
    <html lang="en-IN">
      <head>
        {/* Preconnect to R2 CDN so DNS+TLS is resolved before any image request */}
        <link
          rel="preconnect"
          href="https://pub-7bb925c121d140598e02eb321a90257a.r2.dev"
        />
        <link
          rel="dns-prefetch"
          href="https://pub-7bb925c121d140598e02eb321a90257a.r2.dev"
        />

        {/* Preload critical above-the-fold images */}
        <link rel="preload" as="image" href={`${CDN}/logo2.png`} />
        <link rel="preload" as="image" href={`${CDN}/about.jpg`} />
        <link rel="preload" as="image" href={`${CDN}/soet-au.jpeg`} />
        <link
          rel="preload"
          as="image"
          href={`${CDN}/gallery/gallery-01.jpeg`}
        />

        {/* Prefetch below-fold images (fetched during idle time) */}
        <link rel="prefetch" as="image" href={`${CDN}/csi.avif`} />
        <link rel="prefetch" as="image" href={`${CDN}/acmlogo.png`} />
        <link rel="prefetch" as="image" href={`${CDN}/cerkle.avif`} />
        <link
          rel="prefetch"
          as="image"
          href={`${CDN}/gallery/gallery-15.jpeg`}
        />
        <link
          rel="prefetch"
          as="image"
          href={`${CDN}/gallery/gallery-33.jpeg`}
        />
        <link
          rel="prefetch"
          as="image"
          href={`${CDN}/gallery/gallery-05.jpeg`}
        />
        <link
          rel="prefetch"
          as="image"
          href={`${CDN}/gallery/gallery-40.jpeg`}
        />
      </head>
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
              background: "#22c55e", // green-500
              color: "black",
              border: "2px solid black",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
