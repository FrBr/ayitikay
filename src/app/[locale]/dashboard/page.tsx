import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { Link } from '@/i18n/navigation';
import { ListingActions } from './ListingActions';
import { formatUsd, monthlyFromAnnual } from '@/lib/supabase/types';

export const metadata: Metadata = { title: 'Dashboard' };

const STATUS_STYLE: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-800',
  active:   'bg-emerald-100 text-emerald-800',
  rented:   'bg-sky-100 text-sky-800',
  expired:  'bg-slate-100 text-slate-600',
};

interface Props {
  searchParams: Promise<{ submitted?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/dashboard');

  const t = await getTranslations('dashboard');
  const { submitted } = await searchParams;

  // Fetch all listings for this owner with their primary photo
  const { data: listings } = await supabase
    .from('listings')
    .select('*, listing_photos(*)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, account_type')
    .eq('id', user.id)
    .single();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8FAFC] py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header row */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {profile?.full_name} · {t('subtitle')}
              </p>
            </div>
            <Link
              href="/poste"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] text-white text-sm font-semibold transition-colors"
            >
              <PlusIcon />
              {t('new_listing')}
            </Link>
          </div>

          {/* Submission success notice */}
          {submitted && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
              <CheckCircleIcon />
              {t('submitted_notice')}
            </div>
          )}

          {/* Empty state */}
          {(!listings || listings.length === 0) && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <HouseIcon />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('empty_title')}</h3>
              <p className="text-slate-500 text-sm mb-6">{t('empty_desc')}</p>
              <Link
                href="/poste"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] text-white text-sm font-semibold transition-colors"
              >
                {t('empty_cta')}
              </Link>
            </div>
          )}

          {/* Listings grid */}
          {listings && listings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((listing) => {
                const primaryPhoto = listing.listing_photos?.find(
                  (p: { is_primary: boolean; url: string }) => p.is_primary
                )?.url ?? listing.listing_photos?.[0]?.url;

                const monthly = monthlyFromAnnual(listing.annual_price_usd);
                const daysLeft = Math.max(
                  0,
                  Math.ceil(
                    (new Date(listing.expires_at).getTime() - Date.now()) / 86400000
                  )
                );

                return (
                  <div
                    key={listing.id}
                    className={`bg-white rounded-2xl border overflow-hidden ${
                      listing.is_boosted
                        ? 'border-[#1D9E75] ring-1 ring-[#1D9E75]/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        {primaryPhoto ? (
                          <Image
                            src={primaryPhoto}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <HouseIcon className="text-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/lis/${listing.id}`}
                            className="text-sm font-semibold text-slate-900 hover:text-[#1D9E75] line-clamp-2 leading-snug"
                          >
                            {listing.title}
                          </Link>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[listing.status] ?? STATUS_STYLE.pending}`}>
                            {t(`status_${listing.status as string}` as 'status_pending' | 'status_active' | 'status_rented' | 'status_expired')}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          {listing.commune} · {listing.neighborhood}
                        </p>

                        {/* Price */}
                        <div className="mt-1.5 flex items-baseline gap-1">
                          <span className="text-base font-bold text-slate-900">
                            {formatUsd(listing.annual_price_usd)}
                          </span>
                          <span className="text-xs text-slate-400">{t('per_year')}</span>
                          <span className="text-xs text-slate-400 ml-1">
                            {t('monthly_equiv', { amount: formatUsd(monthly) })}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <EyeIcon /> {t('views', { n: listing.views })}
                          </span>
                          <span className="flex items-center gap-1">
                            <PhoneIcon /> {t('contacts', { n: listing.contact_taps })}
                          </span>
                          {listing.is_boosted && (
                            <span className="text-[#1D9E75] font-semibold flex items-center gap-1">
                              <BoltIcon /> {t('boosted')}
                            </span>
                          )}
                          {listing.status === 'active' && (
                            <span className={daysLeft <= 14 ? 'text-amber-600 font-medium' : ''}>
                              {t('expires', { date: new Date(listing.expires_at).toLocaleDateString() })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ListingActions listingId={listing.id} status={listing.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
    </svg>
  );
}

function HouseIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.22 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
