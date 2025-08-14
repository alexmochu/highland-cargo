import localFont from "next/font/local";
import "./globals.css";
// import { CSPostHogProvider } from './providers'

import Head from 'next/head';
// import { ThemeProvider } from '@/components/theme-provider'
// import { QueryProvider } from '@/components/query-provider'
// import { AuthProvider } from '@/lib/hooks/useAuth'
import { AuthProvider } from "@/components/auth-provider";
import { Header } from "@/components/Header";
import { Toaster } from '@/components/ui/toaster'
import { getURL } from '@/utils/helpers';

// const geistSans = localFont({
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata = {
  metadataBase: new URL(getURL()),
  title: 'Highland Cargo Africa: Global Logistic Solutions',
  description: 'Moving Anything Anywhere, Fast',
  openGraph: {
    title: 'Highland Cargo Africa: Global Logistic Solutions',
    description: 'Moving Anything Anywhere, Fast',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/highland-cargo.png`,
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

export default function RootLayout({ children }) {
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
      {/* <CSPostHogProvider> */}
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
          {/* <QueryProvider> */}
            <AuthProvider>
              <Header/>
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </AuthProvider>
          {/* </QueryProvider> */}
        {/* </ThemeProvider> */}
      </body>
      {/* </CSPostHogProvider> */}
    </html>
  );
}
