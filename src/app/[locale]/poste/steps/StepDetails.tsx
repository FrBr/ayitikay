'use client';

import { useTranslations } from 'next-intl';
import { formatUsd, formatHtg, monthlyFromAnnual, htgFromUsd } from '@/lib/supabase/types';
import type { ListingDraft } from '@/lib/listings/actions';


const PROPERTY_TYPES = [
  { value: 'apatman', labelKey: 'types.apatman' },
  { value: 'kay',     labelKey: 'types.kay' },
  { value: 'studio',  labelKey: 'types.studio' },
  { value: 'chanm',   labelKey: 'types.chanm' },
  { value: 'villa',   labelKey: 'types.villa' },
  { value: 'duplex',  labelKey: 'types.duplex' },
] as const;

interface Props {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  onNext: () => void;
  communes: string[];
}

export function StepDetails({ draft, onChange, onNext, communes }: Props) {
  const t  = useTranslations('post');
  const th = useTranslations('hero');

  const price   = draft.annual_price_usd || 0;
  const monthly = monthlyFromAnnual(price);
  const htg     = htgFromUsd(price);
  const deposit = draft.deposit_usd ?? 0;
  const total   = price + deposit;

  function isValid() {
    return (
      draft.title.trim() &&
      draft.commune &&
      draft.neighborhood.trim() &&
      draft.property_type &&
      draft.annual_price_usd > 0
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <Field label={t('listing_title')} required>
        <input
          type="text" value={draft.title} maxLength={100}
          placeholder={t('listing_title_placeholder')}
          onChange={e => onChange({ title: e.target.value })}
          className={inputCls}
        />
      </Field>

      {/* Commune + Neighborhood */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('commune')} required>
          <select
            value={draft.commune}
            onChange={e => onChange({ commune: e.target.value })}
            className={inputCls}
          >
            <option value="">{t('select_commune')}</option>
            {communes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label={t('neighborhood')} required>
          <input
            type="text" value={draft.neighborhood}
            placeholder={t('neighborhood_placeholder')}
            onChange={e => onChange({ neighborhood: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      {/* Landmark */}
      <Field label={t('landmark')} hint={t('landmark_hint')}>
        <input
          type="text" value={draft.landmark}
          placeholder={t('landmark_placeholder')}
          onChange={e => onChange({ landmark: e.target.value })}
          className={inputCls}
        />
      </Field>

      {/* Property type + Floor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('property_type')} required>
          <select
            value={draft.property_type}
            onChange={e => onChange({ property_type: e.target.value })}
            className={inputCls}
          >
            <option value="">—</option>
            {PROPERTY_TYPES.map(({ value, labelKey }) => (
              <option key={value} value={value}>{th(labelKey)}</option>
            ))}
          </select>
        </Field>
        <Field label={t('floor_level')}>
          <input
            type="text" value={draft.floor_level}
            placeholder={t('floor_placeholder')}
            onChange={e => onChange({ floor_level: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      {/* Price + currency toggle */}
      <div>
        <label className={labelCls}>{t('annual_price')} <span className="text-red-500">*</span></label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
              {draft.currency_display === 'USD' ? '$' : 'G'}
            </span>
            <input
              type="number" min={0} step={100}
              value={draft.annual_price_usd || ''}
              onChange={e => onChange({ annual_price_usd: Number(e.target.value) })}
              className={`${inputCls} pl-7`}
              placeholder="0"
            />
          </div>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm font-medium">
            {(['USD', 'HTG'] as const).map(cur => (
              <button
                key={cur} type="button"
                onClick={() => onChange({ currency_display: cur })}
                className={`px-4 py-2.5 transition-colors ${
                  draft.currency_display === cur
                    ? 'bg-[#1D9E75] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        {/* Monthly / HTG equivalents */}
        {price > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-[#e6f7f2] border border-[#1D9E75]/20 space-y-1 text-sm">
            <PriceLine label={t('monthly_equiv', { amount: formatUsd(monthly) })} />
            <PriceLine label={t('htg_equiv', { amount: formatHtg(htg) })} muted />
          </div>
        )}

        {/* Deposit field */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('deposit_label')}
          </label>
          <p className="text-xs text-slate-400 mb-1.5">{t('deposit_hint')}</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">$</span>
            <input
              type="number" min={0} step={100}
              value={draft.deposit_usd ?? ''}
              onChange={e => onChange({ deposit_usd: e.target.value ? Number(e.target.value) : null })}
              placeholder={t('deposit_placeholder')}
              className={`${inputCls} pl-7`}
            />
          </div>
        </div>

        {/* Total due at signing (only shown when both price and deposit are set) */}
        {price > 0 && deposit > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-[#e6f7f2] border border-[#1D9E75]/20 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{t('breakdown_annual')}</span>
              <span className="font-medium">{formatUsd(price)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t('breakdown_deposit')}</span>
              <span className="font-medium">{formatUsd(deposit)}</span>
            </div>
            <div className="flex justify-between border-t border-[#1D9E75]/20 pt-1.5 font-bold text-slate-900">
              <span>{t('breakdown_total')}</span>
              <span>{formatUsd(total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Beds / baths / surface */}
      <div className="grid grid-cols-3 gap-4">
        <Field label={t('bedrooms')}>
          <input type="number" min={0} max={20} value={draft.bedrooms ?? ''}
            onChange={e => onChange({ bedrooms: e.target.value ? Number(e.target.value) : null })}
            className={inputCls} placeholder="0" />
        </Field>
        <Field label={t('bathrooms')}>
          <input type="number" min={0} max={20} value={draft.bathrooms ?? ''}
            onChange={e => onChange({ bathrooms: e.target.value ? Number(e.target.value) : null })}
            className={inputCls} placeholder="0" />
        </Field>
        <Field label={t('surface')}>
          <input type="number" min={0} value={draft.surface_m2 ?? ''}
            onChange={e => onChange({ surface_m2: e.target.value ? Number(e.target.value) : null })}
            className={inputCls} placeholder="m²" />
        </Field>
      </div>

      {/* Description */}
      <Field label={t('description')}>
        <textarea
          rows={5} value={draft.description}
          placeholder={t('description_placeholder')}
          onChange={e => onChange({ description: e.target.value })}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <button
        type="button" onClick={onNext} disabled={!isValid()}
        className="w-full py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {t('continue')}
      </button>
    </div>
  );
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function PriceLine({ label, muted, bold }: { label: string; muted?: boolean; bold?: boolean }) {
  return (
    <p className={`text-sm ${bold ? 'font-bold text-slate-900' : muted ? 'text-slate-400' : 'text-slate-700'}`}>
      {label}
    </p>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent bg-white';
const labelCls = 'block text-sm font-medium text-slate-700 mb-1.5';
