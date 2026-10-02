import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartProvider from "@/components/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.portpetals.com"),
  title: {
    default: "Port Petals | Flowers, Gifts & Gator Gear in Port Allegany, PA",
    template: "%s | Port Petals",
  },
  description:
    "Port Petals is a flower and craft shop in Port Allegany, Pennsylvania offering fresh flowers, candles, custom gifts, shirts, and Port Allegany Gator gear.",
  applicationName: "Port Petals",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Port Petals",
    title: "Port Petals | Flowers, Gifts & Gator Gear in Port Allegany, PA",
    description:
      "Fresh flowers, candles, custom gifts, shirts, and Port Allegany Gator gear from Port Petals in Port Allegany, Pennsylvania.",
    url: "https://www.portpetals.com",
  },
  twitter: {
    card: "summary",
    title: "Port Petals | Flowers, Gifts & Gator Gear",
    description:
      "Fresh flowers, candles, custom gifts, shirts, and Port Allegany Gator gear from Port Petals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen">
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
