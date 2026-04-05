'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { ListingDraft } from '@/lib/listings/actions';

const MAX_PHOTOS = 8;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface Props {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepPhotos({ draft, onChange, onNext, onBack }: Props) {
  const t = useTranslations('post');
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    const remaining = MAX_PHOTOS - draft.photos.length;
    if (remaining <= 0) return;

    setUploading(true);
    setUploadError(null);

    const toUpload = Array.from(files).slice(0, remaining);
    const results: { url: string; is_primary: boolean }[] = [];

    for (const file of toUpload) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET ?? '');
        // Transformations (WebP, resize) are configured on the upload preset
        // in the Cloudinary dashboard — not passed here for unsigned uploads.

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );
        const data = await res.json();

        if (data.secure_url) {
          results.push({ url: data.secure_url, is_primary: false });
        } else {
          setUploadError(t('photo_error'));
        }
      } catch {
        setUploadError(t('photo_error'));
      }
    }

    onChange({ photos: [...draft.photos, ...results] });
    setUploading(false);
  }

  function removePhoto(index: number) {
    onChange({ photos: draft.photos.filter((_, i) => i !== index) });
  }

  function moveFirst(index: number) {
    const reordered = [...draft.photos];
    const [moved] = reordered.splice(index, 1);
    reordered.unshift(moved);
    onChange({ photos: reordered });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{t('photos_title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('photos_hint')}</p>
      </div>

      {uploadError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {uploadError}
        </div>
      )}

      {/* Photo grid */}
      {draft.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {draft.photos.map((photo, i) => (
            <div key={photo.url} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={photo.url.replace('/upload/', '/upload/w_400,f_webp/')}
                alt={`Photo ${i + 1}`}
                fill className="object-cover"
              />
              {/* Primary badge */}
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#1D9E75] text-white text-[10px] font-bold">
                  Principal
                </span>
              )}
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i !== 0 && (
                  <button
                    type="button" onClick={() => moveFirst(i)}
                    title="Mettre en principal"
                    className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition-colors"
                  >
                    <StarIcon />
                  </button>
                )}
                <button
                  type="button" onClick={() => removePhoto(i)}
                  title="Supprimer"
                  className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {draft.photos.length < MAX_PHOTOS && (
        <div>
          <input
            ref={inputRef}
            type="file" multiple accept="image/*"
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#1D9E75] hover:bg-[#e6f7f2] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-slate-500 hover:text-[#1D9E75]"
          >
            {uploading ? (
              <>
                <SpinnerIcon />
                <span className="text-sm font-medium">{t('uploading')}</span>
              </>
            ) : (
              <>
                <UploadIcon />
                <span className="text-sm font-medium">{t('add_photos')}</span>
                <span className="text-xs text-slate-400">
                  {draft.photos.length}/{MAX_PHOTOS} foto
                </span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-2">
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

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3" />
      <path d="M12 3a9 9 0 019 9" />
    </svg>
  );
}
