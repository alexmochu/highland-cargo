import "./globals.css";
import Script from "next/script";
import { CSPostHogProvider } from './provider'
import { AuthProvider } from "@/components/auth-provider";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { Header } from "@/components/Header";
import { Toaster } from '@/components/ui/toaster'
import { getURL } from '@/utils/helpers';

const title = 'Highland Cargo Africa: Global Logistic Solutions';
const description = 'Moving Anything Anywhere, Fast';
const ogImageUrl = getURL('/highland-cargo.png');

export const metadata = {
  metadataBase: new URL(getURL()),
  title,
  description,
  openGraph: {
    title,
    description,
    url: getURL(),
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Highland Cargo Africa: Moving Anything Anywhere, Fast',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImageUrl],
  },
  icons: {
    icon: "/favicon.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "description": description,
  "url": "https://www.highlandcargoafrica.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <CSPostHogProvider>
        <body>
          <Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" />
          {/* JSON-LD doesn't need to live in <head> — Next.js renders script
              tags like this wherever they appear in the tree. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <LocaleProvider>
            <AuthProvider>
              <Header/>
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </AuthProvider>
          </LocaleProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
