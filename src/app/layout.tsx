import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./providers/CartProvider";
import { Navigation } from "./components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SwiftCart — Intent-Driven Quick Commerce",
  description:
    "Transform quick commerce from search-driven to intent-driven shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#131A22]">
        <CartProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
