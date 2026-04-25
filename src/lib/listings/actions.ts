'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { htgFromUsd } from '@/lib/supabase/types';

export interface ListingDraft {
  // Step 1
  title: string;
  commune: string;
  neighborhood: string;
  landmark: string;
  property_type: string;
  floor_level: string;
  annual_price_usd: number;
  currency_display: 'USD' | 'HTG';
  bedrooms: number | null;
  bathrooms: number | null;
  surface_m2: number | null;
  description: string;
  deposit_usd: number | null; // optional, entered by landlord
  // Step 2
  photos: { url: string; is_primary: boolean }[];
  // Step 3
  has_generator: boolean;
  has_cistern: boolean;
  has_parking: boolean;
  is_furnished: boolean;
  has_security: boolean;
  has_internet: boolean;
  has_hot_water: boolean;
  has_balcony: boolean;
  pets_policy: 'allowed' | 'not_allowed' | 'ask';
  smoking_policy: 'allowed' | 'not_allowed';
  available_from: string;
  notes: string;
  // Step 4
  boost: boolean;
}

export async function createListing(draft: ListingDraft) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const annual = draft.annual_price_usd;
  // Convert deposit_usd to deposit_months for DB storage (rounded, min 1)
  const depositMonths = draft.deposit_usd
    ? Math.max(1, Math.round((draft.deposit_usd / annual) * 12))
    : 0;

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      owner_id: user.id,
      title: draft.title,
      description: draft.description || null,
      commune: draft.commune,
      neighborhood: draft.neighborhood,
      landmark: draft.landmark || null,
      property_type: draft.property_type,
      floor_level: draft.floor_level || null,
      annual_price_usd: annual,
      annual_price_htg: htgFromUsd(annual),
      currency_display: draft.currency_display,
      bedrooms: draft.bedrooms,
      bathrooms: draft.bathrooms,
      surface_m2: draft.surface_m2,
      has_generator: draft.has_generator,
      has_cistern: draft.has_cistern,
      has_parking: draft.has_parking,
      is_furnished: draft.is_furnished,
      has_security: draft.has_security,
      has_internet: draft.has_internet,
      has_hot_water: draft.has_hot_water,
      has_balcony: draft.has_balcony,
      pets_policy: draft.pets_policy,
      smoking_policy: draft.smoking_policy,
      available_from: draft.available_from || null,
      notes: draft.notes || null,
      deposit_months: depositMonths,
      status: 'pending',
      is_boosted: false,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  if (draft.photos.length > 0) {
    await supabase.from('listing_photos').insert(
      draft.photos.map((p, i) => ({
        listing_id: listing.id,
        url: p.url,
        is_primary: i === 0,
        sort_order: i,
      }))
    );
  }

  redirect(`/dashboard?submitted=${listing.id}`);
}
