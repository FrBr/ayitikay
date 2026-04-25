import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { Link } from '@/i18n/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import { PhotoGallery } from './PhotoGallery';
import { ContactCard } from './ContactCard';
import {
  formatUsd, formatHtg, monthlyFromAnnual, htgFromUsd,
} from '@/lib/supabase/types';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('listings').select('title, commune, annual_price_usd').eq('id', id).single();
  if (!data) return { title: 'Listing' };
  return {
    title: data.title,
    description: `${data.commune} · ${formatUsd(data.annual_price_usd)} / an`,
  };
}

const AMENITY_LIST = [
  { key: 'has_generator', tKey: 'amenity_generator', emoji: '⚡' },
  { key: 'has_cistern',   tKey: 'amenity_cistern',   emoji: '💧' },
  { key: 'has_parking',   tKey: 'amenity_parking',   emoji: '🅿️' },
  { key: 'is_furnished',  tKey: 'amenity_furnished',  emoji: '🛋️' },
  { key: 'has_security',  tKey: 'amenity_security',  emoji: '👮' },
  { key: 'has_internet',  tKey: 'amenity_internet',  emoji: '📶' },
  { key: 'has_hot_water', tKey: 'amenity_hot_water', emoji: '🚿' },
  { key: 'has_balcony',   tKey: 'amenity_balcony',   emoji: '🌿' },
] as const;

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getTranslations('listing');

  // Increment view count (fire and forget)
  supabase.rpc('increment_views', { listing_id: id }).then(() => {});

  const { data: listing } = await supabase
    .from('listings')
    .select('*, listing_photos(*), profiles(id, full_name, account_type, agency_name, agency_slug, phone)')
    .eq('id', id)
    .in('status', ['active', 'pending']) // allow owners to preview pending listings
    .single();

  if (!listing) notFound();

  const photos = [...(listing.listing_photos ?? [])].sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );
  const profile = listing.profiles as {
    id: string; full_name: string | null; account_type: string;
    agency_name: string | null; agency_slug: string | null; phone: string | null;
  } | null;

  const annual  = listing.annual_price_usd;
  const monthly = monthlyFromAnnual(annual);
  const htg     = htgFromUsd(annual);
  const depositMonths = listing.deposit_months ?? 0;
  const deposit = (annual / 12) * depositMonths; // stored as months in DB
  const total   = annual + deposit; // total due at signing

  const ownerName = profile?.agency_name ?? profile?.full_name ?? null;
  const isAgent   = profile?.account_type === 'agent';
  const phone     = profile?.phone ?? null;

  // Similar listings (same commune, ±30% price, different id)
  const { data: similar } = await supabase
    .from('listings')
    .select('*, listing_photos(*), profiles(id, full_name, account_type, agency_name, agency_slug)')
    .eq('status', 'active')
    .eq('commune', listing.commune)
    .neq('id', id)
    .gte('annual_price_usd', annual * 0.7)
    .lte('annual_price_usd', annual * 1.3)
    .limit(4);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5 flex-wrap">
            <Link href="/" className="hover:text-[#1D9E75]">Akèy</Link>
            <span>/</span>
            <Link href={`/recherche?zone=${encodeURIComponent(listing.commune)}`} className="hover:text-[#1D9E75]">
              {listing.commune}
            </Link>
            <span>/</span>
            <span className="text-slate-700 truncate max-w-[200px]">{listing.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left / main column ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Gallery */}
              <PhotoGallery photos={photos} title={listing.title} />

              {/* Title + badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {listing.is_boosted && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1D9E75] text-white text-xs font-bold">
                      {t('boosted_badge')}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    {t('annual_badge')}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                  {listing.title}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {listing.commune} · {listing.neighborhood}
                  {listing.landmark && ` · ${listing.landmark}`}
                </p>
              </div>

              {/* Price block */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-900">{formatUsd(annual)}</span>
                  <span className="text-slate-500 font-medium">{t('per_year')}</span>
                </div>
                <p className="text-sm text-slate-500">{t('monthly_equiv', { amount: formatUsd(monthly) })}</p>
                <p className="text-sm text-slate-400">{t('htg_equiv', { amount: formatHtg(htg) })}</p>
                {deposit > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>{t('deposit', { amount: formatUsd(deposit) })}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{t('total_due', { amount: formatUsd(total) })}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {listing.bedrooms   != null && <StatChip label={t('bedrooms',  { n: listing.bedrooms })}   icon="🛏️" />}
                {listing.bathrooms  != null && <StatChip label={t('bathrooms', { n: listing.bathrooms })}  icon="🚿" />}
                {listing.surface_m2 != null && <StatChip label={t('surface',   { n: listing.surface_m2 })} icon="📐" />}
                {listing.floor_level        && <StatChip label={t('floor',     { n: listing.floor_level })} icon="🏢" />}
              </div>

              {/* Description */}
              {listing.description && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-semibold text-slate-900 mb-4">{t('amenities')}</h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {AMENITY_LIST.map(({ key, tKey, emoji }) => {
                    const present = listing[key as keyof typeof listing] as boolean;
                    return (
                      <div key={key} className={`flex items-center gap-2.5 text-sm ${present ? 'text-slate-800' : 'text-slate-400'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${present ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          {present ? '✓' : '✕'}
                        </span>
                        <span>{emoji} {t(tKey as Parameters<typeof t>[0])}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* House rules */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-semibold text-slate-900 mb-3">{t('rules')}</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.pets_policy && (
                    <RulePill label={t(`pets_${listing.pets_policy}` as 'pets_allowed' | 'pets_not_allowed' | 'pets_ask')} />
                  )}
                  {listing.smoking_policy && (
                    <RulePill label={t(`smoking_${listing.smoking_policy}` as 'smoking_allowed' | 'smoking_not_allowed')} />
                  )}
                  {listing.available_from && (
                    <RulePill label={t('available_from', { date: new Date(listing.available_from).toLocaleDateString() })} />
                  )}
                </div>
              </div>

              {/* Metadata footer */}
              <div className="text-xs text-slate-400 space-y-1 pb-4">
                <p>{t('posted', { date: new Date(listing.created_at).toLocaleDateString() })}</p>
                <p>{t('updated', { date: new Date(listing.updated_at).toLocaleDateString() })}</p>
                <p>{t('views', { n: listing.views })}</p>
                <p>{t('listing_id')}: {listing.id}</p>
              </div>
            </div>

            {/* ── Right / contact column ── */}
            <div className="lg:col-span-1">
              <ContactCard
                annualPrice={annual}
                phone={phone}
                ownerName={ownerName}
                isAgent={isAgent}
                agencySlug={profile?.agency_slug ?? null}
                listingId={id}
              />
            </div>
          </div>

          {/* Similar listings */}
          {similar && similar.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t('similar')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {similar.map((s: typeof listing) => (
                  <ListingCard
                    key={s.id}
                    listing={{
                      ...s,
                      primaryPhoto: s.listing_photos?.find((p: { is_primary: boolean }) => p.is_primary)?.url
                        ?? s.listing_photos?.[0]?.url,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatChip({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function RulePill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
      {label}
    </span>
  );
}
