import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import type { Listing } from '@/lib/supabase/types';

interface FeaturedListingsProps {
  listings: (Listing & { primaryPhoto?: string })[];
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
  const t = useTranslations('featured');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {t('title')}
            </h2>
            <p className="text-slate-500 mt-1 text-sm">{t('subtitle')}</p>
          </div>
          <Link
            href="/recherche"
            className="shrink-0 text-sm font-semibold text-[#1D9E75] hover:text-[#158a63] transition-colors flex items-center gap-1"
          >
            {t('view_all')}
            <ArrowRightIcon />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <HouseEmptyIcon />
            <p className="mt-3 text-sm">{t('no_listings')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function HouseEmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-300">
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
