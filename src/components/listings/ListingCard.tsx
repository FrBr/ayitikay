'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatUsd, monthlyFromAnnual } from '@/lib/supabase/types';
import type { Listing } from '@/lib/supabase/types';

interface ListingCardProps {
  listing: Listing & {
    primaryPhoto?: string;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const t = useTranslations('listing_card');
  const [saved, setSaved] = useState(false);

  const monthly = monthlyFromAnnual(listing.annual_price_usd);
  const primaryPhoto = listing.primaryPhoto ?? listing.listing_photos?.[0]?.url;
  const ownerName = listing.profiles?.agency_name ?? listing.profiles?.full_name ?? '—';
  const isAgent = listing.profiles?.account_type === 'agent';

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSaved((v) => !v);
    // TODO: persist to localStorage or Supabase
  }

  return (
    <Link
      href={`/lis/${listing.id}`}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 border ${
        listing.is_boosted
          ? 'border-[#1D9E75] ring-1 ring-[#1D9E75]/20'
          : 'border-slate-200'
      }`}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <HouseIcon className="w-12 h-12 text-slate-300" />
          </div>
        )}

        {/* Badges row */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {listing.is_boosted && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1D9E75] text-white shadow-sm">
              {t('boosted_badge')}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-900 shadow-sm">
            {t('annual_badge')}
          </span>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? t('saved') : t('save')}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
        >
          <HeartIcon filled={saved} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Location */}
        <p className="text-xs text-slate-500 font-medium truncate">
          {listing.commune} · {listing.neighborhood}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        {/* Price block */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">
              {formatUsd(listing.annual_price_usd)}
            </span>
            <span className="text-sm text-slate-500 font-medium">
              {t('per_year')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('monthly_equiv', { amount: formatUsd(monthly) })}
          </p>
        </div>

        {/* Stats chips — max 4 to avoid overflow */}
        <div className="flex gap-1.5 mt-1 overflow-hidden">
          {listing.bedrooms != null && (
            <Chip icon={<BedIcon />} label={t('bedrooms', { n: listing.bedrooms })} />
          )}
          {listing.bathrooms != null && (
            <Chip icon={<BathIcon />} label={t('bathrooms', { n: listing.bathrooms })} />
          )}
          {listing.has_parking && (
            <Chip icon={<ParkingIcon />} label={t('chip_parking')} />
          )}
          {listing.has_generator && !listing.has_parking && (
            <Chip icon={<BoltIcon />} label={t('chip_generator')} />
          )}
          {listing.is_furnished && (
            <Chip icon={<FurnitureIcon />} label={t('chip_furnished')} />
          )}
        </div>

        {/* Agent / Owner line */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 mt-1">
          <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <UserIcon className="w-3 h-3 text-slate-500" />
          </span>
          <span className="text-xs text-slate-500 truncate flex-1">
            {ownerName}
          </span>
          {isAgent && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-[#1D9E75] shrink-0">
              <VerifiedIcon />
              {t('by_agent')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
      {icon}
      {label}
    </span>
  );
}

function HouseIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 8h20v12H2M10 8V4M18 8a2 2 0 00-2-2H10a2 2 0 00-2 2" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6L9 3.5a2.5 2.5 0 015 0V6M2 11h20v3a7 7 0 01-7 7H9a7 7 0 01-7-7v-3z" />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 010 6H9" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FurnitureIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="11" rx="2" />
      <path d="M3 13h18M7 9V5a2 2 0 014 0v4M13 9V5a2 2 0 014 0v4" />
    </svg>
  );
}

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
