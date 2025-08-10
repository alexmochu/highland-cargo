"use client"


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider"
import { getURL } from '@/utils/helpers';
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(getURL()),
  title: 'Highland Cargo Africa: Global Logistic Solutions',
  description: 'Moving Anything Anywhere, Fast',
  openGraph: {
    title: 'Highland Cargo Africa: Global Logistic Solutions',
    description: 'Moving Anything Anywhere, Fast',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/kejani-garage.jpg`,
        width: 1200, // Update dimensions as appropriate
        height: 630,
        alt: 'Highland Cargo Africa: Moving Anything Anywhere, Fast',
      },
    ],
  },
  icons: {
    icon: "/favicon.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Highland Cargo Africa: Global Logistic Solutions",
  "description": "Moving Anything Anywhere, Fast",
  "url": "https://www.highlandcargoafrica.com",
};

export default function ClientLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.openGraph.title} />
        <meta name="twitter:description" content={metadata.openGraph.description} />
        <meta name="twitter:image" content={metadata.openGraph.images[0].url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased`}
      >
            <AuthProvider>
                {children}
            </AuthProvider>
      </body>
    </html>
  )
}
