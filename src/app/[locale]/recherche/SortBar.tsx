'use client';

import { useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { FilterState } from './SearchFilters';

interface SortBarProps {
  count: number;
  currentSort: string;
  filterParams: FilterState;
}

export function SortBar({ count, currentSort, filterParams }: SortBarProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSort(sort: string) {
    const params = new URLSearchParams();
    if (filterParams.zone) params.set('zone', filterParams.zone);
    if (filterParams.type && filterParams.type !== 'all') params.set('type', filterParams.type);
    if (filterParams.min) params.set('min', filterParams.min);
    if (filterParams.max) params.set('max', filterParams.max);
    if (filterParams.beds) params.set('beds', filterParams.beds);
    if (filterParams.furnished === '1') params.set('furnished', '1');
    if (filterParams.generator === '1') params.set('generator', '1');
    if (filterParams.parking === '1') params.set('parking', '1');
    if (filterParams.cistern === '1') params.set('cistern', '1');
    if (filterParams.security === '1') params.set('security', '1');
    if (filterParams.internet === '1') params.set('internet', '1');
    if (sort !== 'newest') params.set('sort', sort);
    startTransition(() => {
      router.push(`/recherche?${params.toString()}`);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-slate-500">
        <span className="font-semibold text-slate-900">{count.toLocaleString()}</span>{' '}
        {count === 1 ? t('result_single') : t('results_count')}
      </p>
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 whitespace-nowrap">{t('sort_label')}</label>
        <select
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          disabled={isPending}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75] disabled:opacity-50"
        >
          <option value="newest">{t('sort_newest')}</option>
          <option value="price_asc">{t('sort_price_asc')}</option>
          <option value="price_desc">{t('sort_price_desc')}</option>
        </select>
      </div>
    </div>
  );
}
