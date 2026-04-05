'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatUsd } from '@/lib/supabase/types';

interface Props {
  annualPrice: number;
  phone: string | null;
  ownerName: string | null;
  isAgent: boolean;
  agencySlug: string | null;
  listingId: string;
}

export function ContactCard({ annualPrice, phone, ownerName, isAgent, agencySlug, listingId }: Props) {
  const t = useTranslations('listing');
  const [saved, setSaved] = useState(false);

  const waLink = phone
    ? `https://wa.me/${phone.replace(/\D/g, '')}`
    : null;

  const callLink = phone ? `tel:${phone}` : null;

  function handleSave() {
    setSaved(v => !v);
    // TODO: persist to localStorage or Supabase saved_listings
  }

  async function trackContact() {
    // Fire-and-forget view count — best effort
    await fetch(`/api/listings/${listingId}/contact`, { method: 'POST' }).catch(() => {});
  }

  return (
    <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Price */}
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-slate-900">{formatUsd(annualPrice)}</span>
          <span className="text-sm text-slate-500">{t('per_year')}</span>
        </div>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
          {t('annual_badge')}
        </span>
      </div>

      {/* WhatsApp CTA */}
      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackContact}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-sm transition-colors"
        >
          <WhatsAppIcon />
          {t('contact_whatsapp')}
        </a>
      )}

      {/* Call */}
      {callLink && (
        <a
          href={callLink}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          <PhoneIcon />
          {t('call')}
        </a>
      )}

      {/* Save + Share row */}
      <div className="flex gap-2">
        <button
          type="button" onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
            saved ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <HeartIcon filled={saved} />
          {saved ? t('saved') : t('save')}
        </button>
        <button
          type="button"
          onClick={() => navigator.share?.({ url: window.location.href }).catch(() => {})}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <ShareIcon />
          {t('share')}
        </button>
      </div>

      {/* Agent mini-card */}
      {ownerName && (
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <UserIcon />
            </div>
            <div className="flex-1 min-w-0">
              {isAgent && agencySlug ? (
                <a href={`/ajan/${agencySlug}`} className="text-sm font-semibold text-slate-900 hover:text-[#1D9E75] truncate block">
                  {ownerName}
                </a>
              ) : (
                <p className="text-sm font-semibold text-slate-900 truncate">{ownerName}</p>
              )}
              {isAgent && (
                <span className="flex items-center gap-1 text-[10px] text-[#1D9E75] font-medium">
                  <VerifiedIcon /> {t('verified')}
                </span>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">{t('response_time')}</p>
        </div>
      )}

      {/* Safety tip */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          ⚠️ {t('safety_tip')}
        </p>
        <button type="button" className="mt-1.5 text-[11px] text-slate-400 underline underline-offset-2 hover:text-slate-600">
          {t('report')}
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.22 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.25 3.75 10.14 9 11.25C17.25 21.14 21 16.25 21 11V5l-9-4zm-2 15l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
    </svg>
  );
}
