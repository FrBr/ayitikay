import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { ListingCard } from '@/components/listings/ListingCard';
import { SearchFilters } from './SearchFilters';
import { SortBar } from './SortBar';
import type { FilterState } from './SearchFilters';
import { getPropertyTypes } from '@/lib/listings/propertyTypes';

interface RawSearchParams {
  zone?: string;
  type?: string;
  prix?: string;
  min?: string;
  max?: string;
  beds?: string;
  furnished?: string;
  generator?: string;
  parking?: string;
  cistern?: string;
  security?: string;
  internet?: string;
  sort?: string;
}

function parsePrix(prix?: string): { min?: number; max?: number } {
  if (!prix) return {};
  const [minStr, maxStr] = prix.split('-');
  const min = minStr ? parseInt(minStr, 10) : undefined;
  const max = maxStr ? parseInt(maxStr, 10) : undefined;
  return {
    min: min !== undefined && !isNaN(min) ? min : undefined,
    max: max !== undefined && !isNaN(max) ? max : undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'search' });
  return { title: `${t('title')} — AyitiKay` };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('search');

  const prixRange = parsePrix(sp.prix);
  const minPrice = sp.min ? parseInt(sp.min, 10) : prixRange.min;
  const maxPrice = sp.max ? parseInt(sp.max, 10) : prixRange.max;

  const [supabase, propertyTypes] = await Promise.all([
    createClient(),
    getPropertyTypes(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('listings')
    .select(
      '*, listing_photos(*), profiles(id, full_name, account_type, agency_name, agency_slug)',
      { count: 'exact' }
    )
    .eq('status', 'active');

  if (sp.zone) {
    const safeZone = sp.zone.replace(/[%_]/g, '\\$&');
    query = query.or(`commune.ilike.%${safeZone}%,neighborhood.ilike.%${safeZone}%`);
  }
  if (sp.type && sp.type !== 'all') query = query.eq('property_type', sp.type);
  if (minPrice) query = query.gte('annual_price_usd', minPrice);
  if (maxPrice) query = query.lte('annual_price_usd', maxPrice);
  if (sp.beds) query = query.gte('bedrooms', parseInt(sp.beds, 10));
  if (sp.furnished === '1') query = query.eq('is_furnished', true);
  if (sp.generator === '1') query = query.eq('has_generator', true);
  if (sp.parking === '1') query = query.eq('has_parking', true);
  if (sp.cistern === '1') query = query.eq('has_cistern', true);
  if (sp.security === '1') query = query.eq('has_security', true);
  if (sp.internet === '1') query = query.eq('has_internet', true);

  switch (sp.sort) {
    case 'price_asc':
      query = query.order('annual_price_usd', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('annual_price_usd', { ascending: false });
      break;
    default:
      query = query
        .order('is_boosted', { ascending: false })
        .order('created_at', { ascending: false });
  }
  query = query.limit(48);

  const { data: listings, count } = await query;

  const currentFilters: FilterState = {
    zone: sp.zone ?? '',
    type: sp.type ?? 'all',
    min: minPrice?.toString() ?? '',
    max: maxPrice?.toString() ?? '',
    beds: sp.beds ?? '',
    furnished: sp.furnished ?? '',
    generator: sp.generator ?? '',
    parking: sp.parking ?? '',
    cistern: sp.cistern ?? '',
    security: sp.security ?? '',
    internet: sp.internet ?? '',
  };

  const totalCount = count ?? 0;
  const currentSort = sp.sort ?? 'newest';

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            {sp.zone && (
              <p className="text-slate-500 text-sm mt-0.5">{sp.zone}</p>
            )}
          </div>

          <div className="md:flex gap-7 items-start">
            <aside className="md:w-72 md:shrink-0 md:sticky md:top-4 mb-4 md:mb-0">
              <SearchFilters current={currentFilters} propertyTypes={propertyTypes} locale={locale} />
            </aside>

            <div className="flex-1 min-w-0">
              <SortBar
                count={totalCount}
                currentSort={currentSort}
                filterParams={currentFilters}
              />

              {!listings || listings.length === 0 ? (
                <div className="mt-6 text-center py-20 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-600 font-medium">{t('no_results')}</p>
                  <p className="text-slate-400 text-sm mt-1">{t('no_results_hint')}</p>
                </div>
              ) : (
                <>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {(listings as Record<string, unknown>[]).map((listing) => {
                      const id = listing.id as string;
                      const photos =
                        (listing.listing_photos as {
                          url: string;
                          is_primary: boolean;
                          sort_order: number;
                        }[]) ?? [];
                      const primaryPhoto =
                        photos.find((p) => p.is_primary)?.url ?? photos[0]?.url;
                      return (
                        <ListingCard
                          key={id}
                          listing={{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ...(listing as any),
                            primaryPhoto,
                          }}
                        />
                      );
                    })}
                  </div>
                  {totalCount > 48 && (
                    <p className="mt-8 text-center text-sm text-slate-400">
                      {t('showing_first', { n: 48, total: totalCount })}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
