'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { StepDetails }    from './steps/StepDetails';
import { StepPhotos }     from './steps/StepPhotos';
import { StepAmenities }  from './steps/StepAmenities';
import { StepPreview }    from './steps/StepPreview';
import type { ListingDraft } from '@/lib/listings/actions';

type Step = 1 | 2 | 3 | 4;

const INITIAL: ListingDraft = {
  title: '', commune: '', neighborhood: '', landmark: '',
  property_type: '', floor_level: '',
  annual_price_usd: 0, currency_display: 'USD',
  bedrooms: null, bathrooms: null, surface_m2: null, description: '',
  photos: [],
  has_generator: false, has_cistern: false, has_parking: false,
  is_furnished: false, has_security: false, has_internet: false,
  has_hot_water: false, has_balcony: false,
  pets_policy: 'ask', smoking_policy: 'not_allowed',
  available_from: '', notes: '', deposit_usd: null,
  boost: false,
};

export function PosteForm({ communes }: { communes: string[] }) {
  const t = useTranslations('post');
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<ListingDraft>(INITIAL);

  function patch(update: Partial<ListingDraft>) {
    setDraft(d => ({ ...d, ...update }));
  }

  const STEPS = [
    t('step1_label'),
    t('step2_label'),
    t('step3_label'),
    t('step4_label'),
  ];

  return (
    <div className="w-full max-w-xl mx-auto">

      {/* Step progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((label, i) => {
            const s = (i + 1) as Step;
            return (
              <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step > s  ? 'bg-[#1D9E75] text-white' :
                    step === s ? 'bg-[#1D9E75] text-white ring-4 ring-[#1D9E75]/20' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s ? <CheckIcon /> : s}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block ${step === s ? 'text-[#1D9E75]' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-0.5 mx-1 transition-colors ${step > s ? 'bg-[#1D9E75]' : 'bg-slate-100'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {step === 1 && (
          <StepDetails  draft={draft} onChange={patch} onNext={() => setStep(2)} communes={communes} />
        )}
        {step === 2 && (
          <StepPhotos   draft={draft} onChange={patch} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <StepAmenities draft={draft} onChange={patch} onNext={() => setStep(4)} onBack={() => setStep(2)} />
        )}
        {step === 4 && (
          <StepPreview  draft={draft} onChange={patch} onBack={() => setStep(3)} />
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
