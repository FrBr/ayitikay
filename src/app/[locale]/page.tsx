import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { HeroSearch } from '@/components/home/HeroSearch';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { getCommunes } from '@/lib/listings/communes';
import { HowItWorks } from '@/components/home/HowItWorks';
import { PostCTA } from '@/components/home/PostCTA';
import type { Listing } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: `AyitiKay — ${t('title')}`,
    description: t('subtitle'),
  };
}

// Mock data for development — replace with Supabase query once DB is connected
// const MOCK_LISTINGS: (Listing & { primaryPhoto?: string })[] = [
//   {
//     id: '1',
//     owner_id: 'u1',
//     title: 'Bèl Apatman 3 Chanm nan Pétion-Ville',
//     description: null,
//     commune: 'Pétion-Ville',
//     neighborhood: 'Route de Kenscoff',
//     landmark: null,
//     property_type: 'apatman',
//     floor_level: '2',
//     annual_price_usd: 9600,
//     annual_price_htg: 1248000,
//     currency_display: 'USD',
//     bedrooms: 3,
//     bathrooms: 2,
//     surface_m2: 120,
//     has_generator: true,
//     has_cistern: true,
//     has_parking: true,
//     is_furnished: false,
//     has_security: true,
//     has_internet: true,
//     has_hot_water: true,
//     has_balcony: true,
//     pets_policy: 'ask',
//     smoking_policy: 'not_allowed',
//     deposit_months: 12,
//     min_lease_months: 12,
//     available_from: '2024-02-01',
//     notes: null,
//     status: 'active',
//     is_boosted: true,
//     boost_expires_at: null,
//     views: 245,
//     contact_taps: 18,
//     expires_at: '2024-06-01',
//     created_at: '2024-01-01',
//     updated_at: '2024-01-01',
//     primaryPhoto: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
//     profiles: {
//       id: 'u1',
//       full_name: 'Immobilier Prestige',
//       account_type: 'agent',
//       agency_name: 'Immobilier Prestige',
//       agency_slug: 'immobilier-prestige',
//       agency_logo_url: null,
//     },
//   },
//   {
//     id: '2',
//     owner_id: 'u2',
//     title: 'Studio Modèn ak Balkon, Delmas 60',
//     description: null,
//     commune: 'Delmas',
//     neighborhood: 'Delmas 60',
//     landmark: null,
//     property_type: 'studio',
//     floor_level: '1',
//     annual_price_usd: 4200,
//     annual_price_htg: 546000,
//     currency_display: 'USD',
//     bedrooms: 1,
//     bathrooms: 1,
//     surface_m2: 45,
//     has_generator: true,
//     has_cistern: false,
//     has_parking: false,
//     is_furnished: true,
//     has_security: false,
//     has_internet: true,
//     has_hot_water: false,
//     has_balcony: true,
//     pets_policy: 'not_allowed',
//     smoking_policy: 'not_allowed',
//     deposit_months: 12,
//     min_lease_months: 12,
//     available_from: null,
//     notes: null,
//     status: 'active',
//     is_boosted: false,
//     boost_expires_at: null,
//     views: 89,
//     contact_taps: 7,
//     expires_at: '2024-06-01',
//     created_at: '2024-01-05',
//     updated_at: '2024-01-05',
//     primaryPhoto: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
//     profiles: {
//       id: 'u2',
//       full_name: 'Jean-Pierre Michel',
//       account_type: 'landlord',
//       agency_name: null,
//       agency_slug: null,
//       agency_logo_url: null,
//     },
//   },
//   {
//     id: '3',
//     owner_id: 'u3',
//     title: 'Kay 4 Chanm ak Jaden, Tabarre',
//     description: null,
//     commune: 'Tabarre',
//     neighborhood: 'Tabarre 27',
//     landmark: null,
//     property_type: 'kay',
//     floor_level: '0',
//     annual_price_usd: 7800,
//     annual_price_htg: 1014000,
//     currency_display: 'USD',
//     bedrooms: 4,
//     bathrooms: 3,
//     surface_m2: 200,
//     has_generator: true,
//     has_cistern: true,
//     has_parking: true,
//     is_furnished: false,
//     has_security: true,
//     has_internet: false,
//     has_hot_water: true,
//     has_balcony: false,
//     pets_policy: 'allowed',
//     smoking_policy: 'ask',
//     deposit_months: 12,
//     min_lease_months: 12,
//     available_from: '2024-03-01',
//     notes: null,
//     status: 'active',
//     is_boosted: false,
//     boost_expires_at: null,
//     views: 134,
//     contact_taps: 12,
//     expires_at: '2024-06-01',
//     created_at: '2024-01-10',
//     updated_at: '2024-01-10',
//     primaryPhoto: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
//     profiles: {
//       id: 'u3',
//       full_name: 'Marie-Claire Dupont',
//       account_type: 'landlord',
//       agency_name: null,
//       agency_slug: null,
//       agency_logo_url: null,
//     },
//   },
//   {
//     id: '4',
//     owner_id: 'u4',
//     title: 'Vila Luks 5 Chanm nan Laboule',
//     description: null,
//     commune: 'Pétion-Ville',
//     neighborhood: 'Laboule',
//     landmark: null,
//     property_type: 'villa',
//     floor_level: '0',
//     annual_price_usd: 36000,
//     annual_price_htg: 4680000,
//     currency_display: 'USD',
//     bedrooms: 5,
//     bathrooms: 4,
//     surface_m2: 450,
//     has_generator: true,
//     has_cistern: true,
//     has_parking: true,
//     is_furnished: true,
//     has_security: true,
//     has_internet: true,
//     has_hot_water: true,
//     has_balcony: true,
//     pets_policy: 'allowed',
//     smoking_policy: 'not_allowed',
//     deposit_months: 12,
//     min_lease_months: 12,
//     available_from: null,
//     notes: null,
//     status: 'active',
//     is_boosted: true,
//     boost_expires_at: null,
//     views: 512,
//     contact_taps: 34,
//     expires_at: '2024-06-01',
//     created_at: '2024-01-15',
//     updated_at: '2024-01-15',
//     primaryPhoto: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
//     profiles: {
//       id: 'u4',
//       full_name: 'Kay Elite Agency',
//       account_type: 'agent',
//       agency_name: 'Kay Elite Agency',
//       agency_slug: 'kay-elite',
//       agency_logo_url: null,
//     },
//   },
// ];

export default async function HomePage() {
  // TODO: replace with Supabase query:
  // const supabase = await createClient();
  // const { data } = await supabase
  //   .from('listings')
  //   .select('*, listing_photos(*), profiles(*)')
  //   .eq('status', 'active')
  //   .order('is_boosted', { ascending: false })
  //   .order('created_at', { ascending: false })
  //   .limit(8);

  //F.B 4/5/26 replace the mock data block with a real Supabase query
  // const [listings, communes] = await Promise.all([
  //   Promise.resolve(MOCK_LISTINGS),
  //   getCommunes(),
  // ]);
const supabase = await createClient();
const { data: fetchedListings } = await supabase
  .from('listings')
  .select('*, listing_photos(*), profiles(id, full_name, account_type, agency_name, agency_slug)')
  .eq('status', 'active')
  .order('is_boosted', { ascending: false })
  .order('created_at', { ascending: false })
  .limit(8);

const [listings, communes] = await Promise.all([
  Promise.resolve(
    (fetchedListings ?? []).map((l) => ({
      ...l,
      primaryPhoto:
        (l.listing_photos as { url: string; is_primary: boolean }[])
          ?.find((p) => p.is_primary)?.url ??
        (l.listing_photos as { url: string }[])?.[0]?.url,
    }))
  ),
  getCommunes(),
]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSearch communes={communes} />
        <FeaturedListings listings={listings} />
        <HowItWorks />
        <PostCTA />
      </main>
      <Footer />
    </>
  );
}
