import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Supabase redirects here after email confirmation / OAuth
// e.g. https://ayitikay.ht/auth/callback?code=xxx
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to error page if code is missing or exchange failed
  return NextResponse.redirect(`${origin}/connexion?error=auth_callback_failed`);
}
