'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated', supabase: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) return { error: 'Forbidden', supabase: null };
  return { error: null, supabase };
}

export async function approveListing(listingId: string) {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error };

  const { error: dbError } = await supabase
    .from('listings')
    .update({ status: 'active' })
    .eq('id', listingId);

  if (dbError) return { error: dbError.message };
  revalidatePath('/admin/moderation');
}

export async function rejectListing(listingId: string, reason?: string) {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error };

  const { error: dbError } = await supabase
    .from('listings')
    .update({
      status: 'expired', // marks as rejected/removed
      notes: reason ? `[Rejeté: ${reason}]` : '[Rejeté par admin]',
    })
    .eq('id', listingId);

  if (dbError) return { error: dbError.message };
  revalidatePath('/admin/moderation');
}

export async function getAllListings(status?: string) {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error, data: null };

  let query = supabase
    .from('listings')
    .select('*, listing_photos(*), profiles(id, full_name, agency_name, account_type, phone)')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error: dbError } = await query;
  if (dbError) return { error: dbError.message, data: null };
  return { error: null, data };
}
