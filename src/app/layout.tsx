import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "UseAI | Your 24/7 AI Support Agent",
    template: "%s | UseAI"
  },
  description: "Upload your documents and let UseAI handle your customer support on Website and WhatsApp — instantly and accurately.",
  keywords: ["AI Chatbot", "Customer Support", "WhatsApp Automation", "Gemini AI", "SaaS"],
  authors: [{ name: "UseAI Team" }],
  creator: "UseAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.NEXT_PUBLIC_APP_URL,
    title: "UseAI | Your 24/7 AI Support Agent",
    description: "The intelligent support agent that you can embed in your website in minutes.",
    siteName: "UseAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "UseAI | Your 24/7 AI Support Agent",
    description: "Automate your customer support on Website and WhatsApp.",
    creator: "@useai",
  },
  icons: {
    icon: "/favicon.ico",
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
        {children}
      </body>
    </html>
  );
}
