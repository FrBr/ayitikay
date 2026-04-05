'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { formatUsd, formatHtg, monthlyFromAnnual, htgFromUsd } from '@/lib/supabase/types';
import { createListing } from '@/lib/listings/actions';
import type { ListingDraft } from '@/lib/listings/actions';

interface Props {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  onBack: () => void;
}

export function StepPreview({ draft, onChange, onBack }: Props) {
  const t  = useTranslations('post');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const price   = draft.annual_price_usd;
  const monthly = monthlyFromAnnual(price);
  const htg     = htgFromUsd(price);
  const primaryPhoto = draft.photos[0]?.url;

  async function handleSubmit() {
    setPending(true);
    setError(null);
    const result = await createListing(draft);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
    // On success createListing calls redirect('/dashboard?submitted=...')
  }

  return (
    <div className="space-y-6">

      {/* Preview card */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">

        {/* Photo */}
        <div className="relative aspect-video bg-slate-100">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.replace('/upload/', '/upload/w_800,f_webp/')}
              alt={draft.title} fill className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-[10px] font-bold">
            {t('annual_badge')}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-500">{draft.commune} · {draft.neighborhood}</p>
          <h3 className="font-semibold text-slate-900">{draft.title}</h3>

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">{formatUsd(price)}</span>
              <span className="text-sm text-slate-500">{t('per_year')}</span>
            </div>
            <p className="text-xs text-slate-400">{t('monthly_equiv', { amount: formatUsd(monthly) })}</p>
            <p className="text-xs text-slate-400">{t('htg_equiv', { amount: formatHtg(htg) })}</p>
          </div>

          {/* Amenity chips */}
          <div className="flex flex-wrap gap-1.5">
            {draft.bedrooms   != null && <Chip label={`${draft.bedrooms} ch.`} />}
            {draft.bathrooms  != null && <Chip label={`${draft.bathrooms} sdb.`} />}
            {draft.has_generator && <Chip label="Jenewatè" />}
            {draft.has_parking   && <Chip label="Pakin" />}
            {draft.is_furnished  && <Chip label="Mèblé" />}
          </div>
        </div>
      </div>

      {/* Pending moderation notice */}
      <div className="flex gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <ClockIcon />
        <p>{t('preview_note')}</p>
      </div>

      {/* Boost upsell */}
      <div className={`rounded-2xl border-2 p-4 transition-all cursor-pointer ${
        draft.boost ? 'border-[#1D9E75] bg-[#e6f7f2]' : 'border-slate-200'
      }`} onClick={() => onChange({ boost: !draft.boost })}>
        <div className="flex items-start gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            draft.boost ? 'border-[#1D9E75] bg-[#1D9E75]' : 'border-slate-300'
          }`}>
            {draft.boost && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900 text-sm">{t('boost_title')}</p>
              <span className="text-sm font-bold text-[#1D9E75]">{t('boost_price')}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{t('boost_desc')}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          type="button" onClick={handleSubmit} disabled={pending}
          className="w-full py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
        >
          {pending ? t('submitting') : (draft.boost ? `${t('submit')} + Boost` : t('submit'))}
        </button>
        <button type="button" onClick={onBack}
          className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          {t('back')}
        </button>
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
      {label}
    </span>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
