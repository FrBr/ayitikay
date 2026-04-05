'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signup } from '@/lib/auth/actions';
import type { AccountType } from '@/lib/supabase/types';

type Step = 1 | 2 | 3;

interface FormValues {
  full_name: string;
  phone: string;
  email: string;
  password: string;
  agency_name: string;
}

const EMPTY: FormValues = { full_name: '', phone: '', email: '', password: '', agency_name: '' };

export function SignupForm() {
  const t = useTranslations('auth');
  const [step, setStep] = useState<Step>(1);
  const [accountType, setAccountType] = useState<AccountType>('landlord');
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function set(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function step2Valid() {
    const base = values.full_name && values.phone && values.email && values.password.length >= 8;
    return accountType === 'agent' ? base && values.agency_name : base;
  }

  async function handleSubmit() {
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.set('account_type', accountType);
    (Object.keys(values) as (keyof FormValues)[]).forEach((k) => formData.set(k, values[k]));

    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
              step >= s ? 'bg-[#1D9E75] text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {step > s ? <CheckIcon /> : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-0.5 transition-colors ${step > s ? 'bg-[#1D9E75]' : 'bg-slate-100'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Step 1: Account type ─────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('account_type_question')}</h2>
          <AccountTypeCard
            type="landlord" selected={accountType === 'landlord'} onSelect={setAccountType}
            title={t('landlord_title')} subtitle={t('landlord_subtitle')} icon={<OwnerIcon />}
          />
          <AccountTypeCard
            type="agent" selected={accountType === 'agent'} onSelect={setAccountType}
            title={t('agent_title')} subtitle={t('agent_subtitle')} icon={<AgentIcon />}
          />
          <button type="button" onClick={() => setStep(2)}
            className="w-full py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] text-white font-semibold text-sm transition-colors">
            {t('continue')}
          </button>
        </div>
      )}

      {/* ── Step 2: Profile info ─────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">{t('step_info')}</h2>
          <Field label={t('full_name')} type="text" value={values.full_name} onChange={set('full_name')} autoComplete="name" />
          <Field label={t('phone')} type="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" />
          <Field label={t('email')} type="email" value={values.email} onChange={set('email')} autoComplete="email" />
          <Field label={t('password_label')} type="password" value={values.password} onChange={set('password')} autoComplete="new-password" />
          {accountType === 'agent' && (
            <Field label={t('agency_name')} type="text" value={values.agency_name} onChange={set('agency_name')} />
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
              {t('back')}
            </button>
            <button type="button" onClick={() => setStep(3)} disabled={!step2Valid()}
              className="flex-1 py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors">
              {t('continue')}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review + submit ──────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">{t('step_review')}</h2>
          <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-sm overflow-hidden">
            <Row label={t('row_type')} value={accountType === 'agent' ? t('agent_title') : t('landlord_title')} />
            <Row label={t('row_name')} value={values.full_name} />
            <Row label={t('row_phone')} value={values.phone} />
            <Row label={t('row_email')} value={values.email} />
            {accountType === 'agent' && <Row label={t('row_agency')} value={values.agency_name} />}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            {t('confirm_email_note')}
          </div>
          <p className="text-xs text-slate-400 text-center">{t('terms_notice')}</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
              {t('back')}
            </button>
            <button type="button" onClick={handleSubmit} disabled={pending}
              className="flex-1 py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors">
              {pending ? t('creating') : t('create_account')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

function Field({ label, type, value, onChange, autoComplete }: {
  label: string; type: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={onChange} required
        autoComplete={autoComplete}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
      />
    </div>
  );
}

function AccountTypeCard({ type, selected, onSelect, title, subtitle, icon }: {
  type: AccountType; selected: boolean; onSelect: (t: AccountType) => void;
  title: string; subtitle: string; icon: React.ReactNode;
}) {
  return (
    <button type="button" onClick={() => onSelect(type)}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
        selected ? 'border-[#1D9E75] bg-[#e6f7f2]' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        selected ? 'bg-[#1D9E75] text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-[#1D9E75] flex items-center justify-center shrink-0">
          <CheckIcon />
        </div>
      )}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OwnerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}
