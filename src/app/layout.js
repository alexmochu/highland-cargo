import "./globals.css";
import Script from "next/script";
import localFont from "next/font/local";
import { CSPostHogProvider } from './provider'
import { AuthProvider } from "@/components/auth-provider";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { Header } from "@/components/Header";
import RevealObserver from "@/components/RevealObserver";
import { Toaster } from '@/components/ui/toaster'
import { getURL } from '@/utils/helpers';

// Self-hosted (next/font/local) rather than next/font/google -- fetching
// from Google Fonts at build time is a network dependency that breaks the
// build in sandboxed/restricted environments; local files have none. Both
// are variable fonts, so a single file covers the whole weight range.
const bigShoulders = localFont({
  src: "./fonts/big-shoulders-display.woff2",
  weight: "600 800",
  variable: "--font-display",
  display: "swap",
});
const plexSans = localFont({
  src: "./fonts/ibm-plex-sans.woff2",
  weight: "400 700",
  variable: "--font-body",
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning className={`${bigShoulders.variable} ${plexSans.variable}`}>
      <CSPostHogProvider>
        <body>
          <Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" />
          {/* JSON-LD doesn't need to live in <head> — Next.js renders script
              tags like this wherever they appear in the tree. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <RevealObserver />
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
