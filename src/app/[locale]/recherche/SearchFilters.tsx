'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { PropertyTypeOption } from '@/lib/listings/propertyTypes';
import { getLabel } from '@/lib/listings/propertyTypes';

const PRICE_OPTIONS = [
  { label: '$1,500', value: '1500' },
  { label: '$3,000', value: '3000' },
  { label: '$6,000', value: '6000' },
  { label: '$9,000', value: '9000' },
  { label: '$12,000', value: '12000' },
  { label: '$18,000', value: '18000' },
  { label: '$24,000', value: '24000' },
  { label: '$36,000', value: '36000' },
  { label: '$60,000', value: '60000' },
];

const BED_OPTIONS = ['1', '2', '3', '4'] as const;

export interface FilterState {
  zone: string;
  type: string;
  min: string;
  max: string;
  beds: string;
  furnished: string;
  generator: string;
  parking: string;
  cistern: string;
  security: string;
  internet: string;
}

export function SearchFilters({
  current,
  propertyTypes,
  locale,
}: {
  current: FilterState;
  propertyTypes: PropertyTypeOption[];
  locale: string;
}) {
  const t = useTranslations('search');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(current);

  const activeCount = [
    filters.zone,
    filters.type !== 'all' ? filters.type : '',
    filters.min,
    filters.max,
    filters.beds,
    filters.furnished,
    filters.generator,
    filters.parking,
    filters.cistern,
    filters.security,
    filters.internet,
  ].filter(Boolean).length;

  function setF(key: keyof FilterState, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function toggleAmenity(key: keyof FilterState) {
    setFilters((f) => ({ ...f, [key]: f[key] === '1' ? '' : '1' }));
  }

  function buildParams(f: FilterState, sort?: string) {
    const params = new URLSearchParams();
    if (f.zone) params.set('zone', f.zone);
    if (f.type && f.type !== 'all') params.set('type', f.type);
    if (f.min) params.set('min', f.min);
    if (f.max) params.set('max', f.max);
    if (f.beds) params.set('beds', f.beds);
    if (f.furnished === '1') params.set('furnished', '1');
    if (f.generator === '1') params.set('generator', '1');
    if (f.parking === '1') params.set('parking', '1');
    if (f.cistern === '1') params.set('cistern', '1');
    if (f.security === '1') params.set('security', '1');
    if (f.internet === '1') params.set('internet', '1');
    if (sort && sort !== 'newest') params.set('sort', sort);
    return params;
  }

  function apply() {
    startTransition(() => {
      router.push(`/recherche?${buildParams(filters).toString()}`);
      setOpen(false);
    });
  }

  function reset() {
    const empty: FilterState = {
      zone: '', type: 'all', min: '', max: '', beds: '',
      furnished: '', generator: '', parking: '', cistern: '', security: '', internet: '',
    };
    setFilters(empty);
    startTransition(() => {
      router.push('/recherche');
      setOpen(false);
    });
  }

  const AMENITIES: { key: keyof FilterState; label: string }[] = [
    { key: 'furnished', label: t('furnished') },
    { key: 'generator', label: t('generator') },
    { key: 'parking', label: t('parking') },
    { key: 'cistern', label: t('cistern') },
    { key: 'security', label: t('security') },
    { key: 'internet', label: t('internet') },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FilterIcon />
          <span className="text-sm font-semibold text-slate-900">{t('filters_title')}</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-[#1D9E75] text-white rounded-full px-2 py-0.5 leading-none">
              {activeCount}
            </span>
          )}
        </div>
        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-xs text-[#1D9E75] font-semibold"
        >
          {open ? t('hide_filters') : t('show_filters')}
        </button>
      </div>

      {/* Filter body — hidden on mobile until toggled, always visible on md+ */}
      <div className={`p-4 space-y-5 ${open ? 'block' : 'hidden'} md:block`}>

        {/* Zone */}
        <FilterGroup label={t('zone_label')}>
          <input
            type="text"
            value={filters.zone}
            onChange={(e) => setF('zone', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder={t('zone_placeholder')}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
          />
        </FilterGroup>

        {/* Type */}
        <FilterGroup label={t('type_label')}>
          <select
            value={filters.type}
            onChange={(e) => setF('type', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
          >
            <option value="all">{t('type_all')}</option>
            {propertyTypes.map((pt) => (
              <option key={pt.slug} value={pt.slug}>{getLabel(pt, locale)}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Price range */}
        <FilterGroup label={t('price_label')}>
          <div className="flex items-center gap-2">
            <select
              value={filters.min}
              onChange={(e) => setF('min', e.target.value)}
              className="flex-1 px-2 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            >
              <option value="">{t('price_min_placeholder')}</option>
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="text-slate-400 text-sm shrink-0">–</span>
            <select
              value={filters.max}
              onChange={(e) => setF('max', e.target.value)}
              className="flex-1 px-2 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
            >
              <option value="">{t('price_max_placeholder')}</option>
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </FilterGroup>

        {/* Bedrooms */}
        <FilterGroup label={t('beds_label')}>
          <div className="flex gap-1.5 flex-wrap">
            <BedButton value="" current={filters.beds} label={t('beds_any')} onClick={() => setF('beds', '')} />
            {BED_OPTIONS.map((n) => (
              <BedButton key={n} value={n} current={filters.beds} label={`${n}+`} onClick={() => setF('beds', n)} />
            ))}
          </div>
        </FilterGroup>

        {/* Amenities */}
        <FilterGroup label={t('amenities_label')}>
          <div className="space-y-2">
            {AMENITIES.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  role="checkbox"
                  aria-checked={filters[key] === '1'}
                  tabIndex={0}
                  onClick={() => toggleAmenity(key)}
                  onKeyDown={(e) => e.key === ' ' && toggleAmenity(key)}
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    filters[key] === '1'
                      ? 'bg-[#1D9E75] border-[#1D9E75]'
                      : 'border-slate-300 bg-white group-hover:border-[#1D9E75]'
                  }`}
                >
                  {filters[key] === '1' && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-700 select-none">{label}</span>
              </label>
            ))}
          </div>
        </FilterGroup>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={reset}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {t('reset')}
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#158a63] text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isPending ? '...' : t('apply')}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  );
}

function BedButton({ value, current, label, onClick }: {
  value: string; current: string; label: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        current === value
          ? 'bg-[#1D9E75] border-[#1D9E75] text-white'
          : 'border-slate-200 text-slate-600 hover:border-[#1D9E75] bg-white'
      }`}
    >
      {label}
    </button>
  );
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
