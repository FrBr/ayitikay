'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { PropertyTypeOption } from '@/lib/listings/propertyTypeUtils';
import { getLabel } from '@/lib/listings/propertyTypeUtils';

const PRICE_RANGES = [
  { label: '< $3,000',          value: '0-3000' },
  { label: '$3,000 – $6,000',   value: '3000-6000' },
  { label: '$6,000 – $12,000',  value: '6000-12000' },
  { label: '$12,000 – $24,000', value: '12000-24000' },
  { label: '> $24,000',         value: '24000-' },
];

export function HeroSearch({
  communes,
  propertyTypes,
  locale,
}: {
  communes: string[];
  propertyTypes: PropertyTypeOption[];
  locale: string;
}) {
  const t = useTranslations('hero');
  const router = useRouter();

  const [zone, setZone] = useState('');
  const [type, setType] = useState('all');
  const [price, setPrice] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (zone) params.set('zone', zone);
    if (type && type !== 'all') params.set('type', type);
    if (price) params.set('prix', price);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <section className="relative bg-gradient-to-br from-[#0d7a5a] via-[#1D9E75] to-[#25b887] py-20 md:py-28 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Tagline chip */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Ayiti · Pétion-Ville · Delmas · Tabarre
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col md:flex-row gap-3 max-w-4xl mx-auto"
        >
          {/* Zone dropdown */}
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-zone" className="sr-only">{t('zone_placeholder')}</label>
            <div className="relative">
              <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="hero-zone"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent appearance-none"
              >
                <option value="">{t('zone_placeholder')}</option>
                {communes.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type select */}
          <div className="md:w-44">
            <label htmlFor="hero-type" className="sr-only">{t('type_placeholder')}</label>
            <select
              id="hero-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent appearance-none"
            >
              <option value="all">{t('types.all')}</option>
              {propertyTypes.map((pt) => (
                <option key={pt.slug} value={pt.slug}>
                  {getLabel(pt, locale)}
                </option>
              ))}
            </select>
          </div>

          {/* Price select */}
          <div className="md:w-48">
            <label htmlFor="hero-price" className="sr-only">{t('price_placeholder')}</label>
            <select
              id="hero-price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent appearance-none"
            >
              <option value="">{t('price_placeholder')}</option>
              {PRICE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>{r.label} / an</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="md:w-auto px-6 py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <SearchIcon />
            {t('search_button')}
          </button>
        </form>

        {/* Popular neighborhood searches */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Delmas 33', 'Laboule', 'Kenscoff', 'Turgeau', 'Pacot'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => router.push(`/recherche?zone=${encodeURIComponent(term)}`)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
