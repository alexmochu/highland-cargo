import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// Routes that require a signed-in user.
const protectedRoutes = ['/coming-soon', '/dashboard', '/messages', '/profile', '/admin', '/supplier', '/partner', '/choose-role', '/pos']
// Routes that additionally require profiles.is_admin === true, or one of the operational roles below.
const adminRoutes = ['/admin', '/pos']
const ADMIN_AREA_ROLES = ['admin', 'manager', 'accountant', 'warehouse_staff', 'sales_agent', 'cashier']

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = '/auth';
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile?.is_admin && !ADMIN_AREA_ROLES.includes(profile?.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
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
    '/((?!_next/static|_next/image|favicon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
