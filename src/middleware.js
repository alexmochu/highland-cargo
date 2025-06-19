// import { NextResponse } from 'next/server';
// import { createClient } from '@/lib/supabase/middleware';

// const protectedRoutes = ['/dashboard', '/messages', '/profile']

// export async function middleware(request) {
//   const { supabase, response } = createClient(request);
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) {
//     if(protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))){
//         const redirectUrl = new URL('/auth', request.url)
//         return NextResponse.redirect(redirectUrl)
//     }
//   }
//   return response;
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     '/dashboard/:path*',
//   ],
// };

import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const protectedRoutes = ['/coming-soon', '/dashboard', '/messages', '/profile']
// const publicRoutes = ['/auth', '/services']

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Skip middleware completely for public routes
//   if (publicRoutes.some((route) => pathname.startsWith(route))) {
//     return NextResponse.next();
//   }

//   // update user's auth session
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const supabase = await createClient()

    // Retrieve the user using Supabase's auth helper.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user is found, redirect to sign-in.
    if (!user) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = '/auth';
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


// Translation

// middleware.js
// import { NextResponse } from 'next/server';
// import acceptLanguage from 'accept-language';

// const PUBLIC_FILE = /\.(.*)$/;

// const locales = ['en', 'zh', 'ar'];
// const defaultLocale = 'en';

// acceptLanguage.languages(locales);

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   if (
//     PUBLIC_FILE.test(pathname) || // Skip static files
//     pathname.startsWith('/api')   // Skip API routes
//   ) {
//     return;
//   }

//   const pathnameIsMissingLocale = locales.every(
//     (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
//   );

//   if (pathnameIsMissingLocale) {
//     const locale = acceptLanguage.get(req.headers.get('Accept-Language')) || defaultLocale;

//     return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
//   }
// }

// export const config = {
//   matcher: ['/((?!_next|favicon.ico).*)'], // Run middleware on all routes except Next.js internals
// };
