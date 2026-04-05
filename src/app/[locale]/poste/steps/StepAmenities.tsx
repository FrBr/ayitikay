'use client';

import { useTranslations } from 'next-intl';
import type { ListingDraft } from '@/lib/listings/actions';

interface Props {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AMENITY_KEYS = [
  { key: 'has_generator', labelKey: 'generator', icon: '⚡' },
  { key: 'has_cistern',   labelKey: 'cistern',   icon: '💧' },
  { key: 'has_parking',   labelKey: 'parking',   icon: '🅿️' },
  { key: 'is_furnished',  labelKey: 'furnished', icon: '🛋️' },
  { key: 'has_security',  labelKey: 'security',  icon: '👮' },
  { key: 'has_internet',  labelKey: 'internet',  icon: '📶' },
  { key: 'has_hot_water', labelKey: 'hot_water', icon: '🚿' },
  { key: 'has_balcony',   labelKey: 'balcony',   icon: '🌿' },
] as const;

type AmenityKey = typeof AMENITY_KEYS[number]['key'];

export function StepAmenities({ draft, onChange, onNext, onBack }: Props) {
  const t = useTranslations('post');

  return (
    <div className="space-y-8">

      {/* Amenities */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t('amenities_title')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {AMENITY_KEYS.map(({ key, labelKey, icon }) => {
            const checked = draft[key as AmenityKey] as boolean;
            return (
              <button
                key={key} type="button"
                onClick={() => onChange({ [key]: !checked })}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  checked
                    ? 'border-[#1D9E75] bg-[#e6f7f2]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-lg leading-none">{icon}</span>
                <span className={`text-sm font-medium ${checked ? 'text-[#1D9E75]' : 'text-slate-700'}`}>
                  {t(labelKey)}
                </span>
                {checked && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-[#1D9E75] flex items-center justify-center shrink-0">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* House rules */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t('rules_title')}</h2>
        <div className="space-y-4">

          {/* Pets */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('pets_label')}</label>
            <div className="flex gap-2">
              {(['allowed', 'not_allowed', 'ask'] as const).map(val => (
                <button
                  key={val} type="button"
                  onClick={() => onChange({ pets_policy: val })}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                    draft.pets_policy === val
                      ? 'border-[#1D9E75] bg-[#1D9E75] text-white'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t(`pets_${val}` as 'pets_allowed' | 'pets_not_allowed' | 'pets_ask')}
                </button>
              ))}
            </div>
          </div>

          {/* Smoking */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('smoking_label')}</label>
            <div className="flex gap-2">
              {(['allowed', 'not_allowed'] as const).map(val => (
                <button
                  key={val} type="button"
                  onClick={() => onChange({ smoking_policy: val })}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                    draft.smoking_policy === val
                      ? 'border-[#1D9E75] bg-[#1D9E75] text-white'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t(`smoking_${val}` as 'smoking_allowed' | 'smoking_not_allowed')}
                </button>
              ))}
            </div>
          </div>

          {/* Available from */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('available_from')}
            </label>
            <input
              type="date"
              value={draft.available_from}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => onChange({ available_from: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent bg-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('notes')}
            </label>
            <textarea
              rows={3} value={draft.notes}
              onChange={e => onChange({ notes: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
          {t('back')}
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] text-white font-semibold text-sm transition-colors">
          {t('continue')}
        </button>
      </div>
    </div>
  );
}
