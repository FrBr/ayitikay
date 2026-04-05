export type AccountType = 'landlord' | 'agent';
export type PropertyType = 'apatman' | 'kay' | 'studio' | 'chanm' | 'villa' | 'duplex';
export type ListingStatus = 'pending' | 'active' | 'rented' | 'expired';
export type PetsPolicy = 'allowed' | 'not_allowed' | 'ask';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  account_type: AccountType;
  agency_name: string | null;
  agency_slug: string | null;
  agency_description: string | null;
  agency_logo_url: string | null;
  agency_website: string | null;
  agency_license: string | null;
  phone_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  commune: string;
  neighborhood: string;
  landmark: string | null;
  property_type: PropertyType;
  floor_level: string | null;
  annual_price_usd: number;
  annual_price_htg: number | null;
  currency_display: 'USD' | 'HTG';
  bedrooms: number | null;
  bathrooms: number | null;
  surface_m2: number | null;
  has_generator: boolean;
  has_cistern: boolean;
  has_parking: boolean;
  is_furnished: boolean;
  has_security: boolean;
  has_internet: boolean;
  has_hot_water: boolean;
  has_balcony: boolean;
  pets_policy: PetsPolicy | null;
  smoking_policy: string | null;
  deposit_months: number;
  min_lease_months: number;
  available_from: string | null;
  notes: string | null;
  status: ListingStatus;
  is_boosted: boolean;
  boost_expires_at: string | null;
  views: number;
  contact_taps: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  // Joined
  listing_photos?: ListingPhoto[];
  profiles?: Pick<Profile, 'id' | 'full_name' | 'account_type' | 'agency_name' | 'agency_slug' | 'agency_logo_url'>;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  agent_id: string;
  reviewer_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

// Exchange rate constant (override via settings table at runtime)
export const USD_HTG_RATE = 130;

export function htgFromUsd(usd: number, rate = USD_HTG_RATE): number {
  return Math.round(usd * rate);
}

export function monthlyFromAnnual(annual: number): number {
  return Math.round(annual / 12);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatHtg(amount: number): string {
  return `G ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
}
