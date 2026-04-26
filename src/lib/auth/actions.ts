'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { AccountType } from '@/lib/supabase/types';

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/dashboard';

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

// ---------------------------------------------------------------------------
// Sign up (step 1 — create account + profile row)
// ---------------------------------------------------------------------------
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;
  const accountType = formData.get('account_type') as AccountType;
  const agencyName = (formData.get('agency_name') as string) || null;

  // Pre-check email existence via Auth REST API — more reliable than
  // inspecting identities[], whose shape varies across Supabase versions.
  const authCheckRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?filter=${encodeURIComponent(email)}&per_page=1`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    }
  );
  if (authCheckRes.ok) {
    const authJson = await authCheckRes.json() as { users?: unknown[] };
    if ((authJson.users?.length ?? 0) > 0) {
      return { error: 'This email address is already registered. Please sign in or use a different email.' };
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        phone,
        account_type: accountType,
        agency_name: agencyName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Insert profile row immediately (trigger also does this, but belt-and-suspenders)
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      phone,
      account_type: accountType,
      agency_name: agencyName,
    });
  }

  // Supabase sends a confirmation email — redirect to a "check your email" page
  redirect('/rejistre/confirme');
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// ---------------------------------------------------------------------------
// Get current user (for server components)
// ---------------------------------------------------------------------------
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}
