// middleware.js
import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

const PUBLIC_FILE = /\.(.*)$/;

const locales = ['en', 'zh', 'ar'];
const defaultLocale = 'en';

acceptLanguage.languages(locales);

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_FILE.test(pathname) || // Skip static files
    pathname.startsWith('/api')   // Skip API routes
  ) {
    return;
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = acceptLanguage.get(req.headers.get('Accept-Language')) || defaultLocale;

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'], // Run middleware on all routes except Next.js internals
};
