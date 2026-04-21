import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication (locale-agnostic paths)
const PROTECTED_PATHS = ['/dashboard', '/poste'];

function isProtectedPath(pathname: string): boolean {
  // Strip locale prefix if present (/ht/dashboard → /dashboard)
  const stripped = pathname.replace(/^\/(ht|en)/, '') || '/';
  return PROTECTED_PATHS.some((p) => stripped === p || stripped.startsWith(p + '/'));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes have their own html/body layout outside [locale] routing —
  // skip next-intl so it doesn't interfere with /admin/* paths.
  const isAdmin = pathname.startsWith('/admin');

  // 1. Run next-intl locale routing first (skip for admin)
  const intlResponse = isAdmin ? null : intlMiddleware(request);

  // 2. Refresh Supabase session on every request (keeps cookies fresh)
  const response = intlResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Redirect unauthenticated users away from protected pages
  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    // Preserve locale prefix so /en/poste → /en/connexion, /ht/poste → /ht/connexion
    const localeMatch = pathname.match(/^\/(ht|en)/);
    const localePrefix = localeMatch ? localeMatch[0] : '';
    const loginUrl = new URL(`${localePrefix}/connexion`, request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
