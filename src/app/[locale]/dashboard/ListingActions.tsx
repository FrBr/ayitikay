'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { markRented, deleteListing, renewListing } from '@/lib/listings/dashboard-actions';

export function ListingActions({
  listingId,
  status,
}: {
  listingId: string;
  status: string;
}) {
  const t = useTranslations('dashboard');
  const [busy, setBusy] = useState<string | null>(null);

  async function run(action: string, fn: () => Promise<{ error?: string } | void>) {
    setBusy(action);
    await fn();
    setBusy(null);
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
      {status !== 'rented' && (
        <ActionBtn
          label={t('mark_rented')}
          loading={busy === 'rented'}
          onClick={() => run('rented', () => markRented(listingId))}
          variant="ghost"
        />
      )}
      {(status === 'active' || status === 'expired') && (
        <ActionBtn
          label={t('renew')}
          loading={busy === 'renew'}
          onClick={() => run('renew', () => renewListing(listingId))}
          variant="ghost"
        />
      )}
      <ActionBtn
        label={t('delete')}
        loading={busy === 'delete'}
        onClick={() => {
          if (confirm(t('delete_confirm'))) {
            run('delete', () => deleteListing(listingId));
          }
        }}
        variant="danger"
      />
    </div>
  );
}

function ActionBtn({
  label, loading, onClick, variant,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
  variant: 'ghost' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
        variant === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {loading ? '...' : label}
    </button>
  );
}
