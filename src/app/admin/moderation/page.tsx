import Image from 'next/image';
import { getAllListings } from '@/lib/admin/actions';
import { ModerationActions } from './ModerationActions';
import { formatUsd } from '@/lib/supabase/types';

export const metadata = { title: 'Modération — Admin' };

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  active:  'bg-emerald-100 text-emerald-800',
  rented:  'bg-sky-100 text-sky-800',
  expired: 'bg-slate-100 text-slate-600',
};

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = 'pending' } = await searchParams;
  const { data: listings, error } = await getAllListings(status);

  const tabs = [
    { key: 'pending', label: 'En attente' },
    { key: 'active',  label: 'Actives' },
    { key: 'expired', label: 'Rejetées / Expirées' },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Modération des annonces</h1>
        <p className="text-slate-500 text-sm mt-1">
          Approuvez ou rejetez les annonces soumises par les propriétaires.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <a
            key={tab.key}
            href={`/admin/moderation?status=${tab.key}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!listings || listings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-400 text-sm">Aucune annonce dans cette catégorie.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(listings as Record<string, unknown>[]).map((listing) => {
            const photos = (listing.listing_photos as { url: string; is_primary: boolean; sort_order: number }[]) ?? [];
            const primaryPhoto = photos.find(p => p.is_primary)?.url ?? photos[0]?.url;
            const profile = listing.profiles as { full_name: string | null; agency_name: string | null; account_type: string; phone: string | null } | null;
            const ownerName = profile?.agency_name ?? profile?.full_name ?? '—';
            const listingId  = listing.id as string;
            const title      = listing.title as string;
            const commune    = listing.commune as string;
            const neighborhood = listing.neighborhood as string;
            const status     = listing.status as string;
            const priceUsd   = listing.annual_price_usd as number;
            const propType   = listing.property_type as string;
            const createdAt  = listing.created_at as string;
            const description = listing.description as string | null;
            const bedrooms   = listing.bedrooms as number | null;

            return (
              <div key={listing.id as string} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex gap-5 p-5">
                  {/* Photo */}
                  <div className="relative w-32 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                    {primaryPhoto ? (
                      <Image src={primaryPhoto} alt={title} fill className="object-cover" sizes="128px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs">No photo</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <a
                          href={`/lis/${listingId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-900 hover:text-[#1D9E75] text-sm"
                        >
                          {title} ↗
                        </a>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {commune} · {neighborhood}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[status] ?? ''}`}>
                        {status}
                      </span>
                    </div>

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                      <MetaItem label="Prix / an" value={formatUsd(priceUsd)} />
                      <MetaItem label="Type" value={propType} />
                      <MetaItem label="Soumis le" value={new Date(createdAt).toLocaleDateString('fr-FR')} />
                      <MetaItem label="Propriétaire" value={ownerName} />
                      {profile?.phone && <MetaItem label="Téléphone" value={profile.phone} />}
                      {bedrooms != null && <MetaItem label="Chambres" value={String(bedrooms)} />}
                    </div>

                    {/* Description preview */}
                    {description && (
                      <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 rounded-lg px-3 py-2">
                        {description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions — only for pending */}
                {status === 'pending' && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                    <ModerationActions listingId={listingId} />
                  </div>
                )}

                {/* Already processed */}
                {status !== 'pending' && (
                  <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex justify-end">
                    <span className="text-xs text-slate-400">
                      {status === 'active' ? '✓ Approuvée' : '✕ Non active'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{label}</p>
      <p className="font-medium text-slate-800 truncate">{value}</p>
    </div>
  );
}
