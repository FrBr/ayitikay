'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function markRented(listingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthenticated' };

  const { error } = await supabase
    .from('listings')
    .update({ status: 'rented' })
    .eq('id', listingId)
    .eq('owner_id', user.id); // row-level safety

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthenticated' };

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('owner_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
}

export async function renewListing(listingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthenticated' };

  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + 60);

  const { error } = await supabase
    .from('listings')
    .update({ expires_at: newExpiry.toISOString(), status: 'active' })
    .eq('id', listingId)
    .eq('owner_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
}
