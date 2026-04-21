import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "UseConverra | Your 24/7 AI Support Agent",
    template: "%s | UseConverra"
  },
  description: "Upload your documents and let UseConverra handle your customer support on Website and WhatsApp — instantly and accurately.",
  keywords: ["AI Chatbot", "Customer Support", "WhatsApp Automation", "Gemini AI", "SaaS"],
  authors: [{ name: "UseConverra Team" }],
  creator: "UseConverra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.NEXT_PUBLIC_APP_URL,
    title: "UseConverra | Your 24/7 AI Support Agent",
    description: "The intelligent support agent that you can embed in your website in minutes.",
    siteName: "UseConverra",
  },
  twitter: {
    card: "summary_large_image",
    title: "UseConverra | Your 24/7 AI Support Agent",
    description: "Automate your customer support on Website and WhatsApp.",
    creator: "@useconverra",
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
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
