import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SwiftCart — Intent-Driven Quick Commerce",
  description:
    "Transform quick commerce from search-driven to intent-driven shopping. Describe your situation, get an AI-generated cart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#131A22]">
        {children}
      </body>
    </html>
  );
}
