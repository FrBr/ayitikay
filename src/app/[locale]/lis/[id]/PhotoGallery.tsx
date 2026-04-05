'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Photo { url: string; is_primary: boolean }

export function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  const thumb = (url: string) => url.replace('/upload/', '/upload/w_200,h_150,c_fill,f_webp/');
  const main  = (url: string) => url.replace('/upload/', '/upload/w_900,f_webp,q_auto:good/');

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 cursor-zoom-in group"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={main(photos[active].url)}
          alt={title} fill className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
        {photos.length > 1 && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            {active + 1} / {photos.length}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            Wè tout foto
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.url} type="button"
              onClick={() => setActive(i)}
              className={`relative w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-[#1D9E75]' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={thumb(p.url)} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            onClick={() => setLightbox(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {active > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/10"
              onClick={e => { e.stopPropagation(); setActive(a => a - 1); }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <Image
              src={main(photos[active].url)}
              alt={title} fill className="object-contain"
              sizes="100vw"
            />
          </div>
          {active < photos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/10"
              onClick={e => { e.stopPropagation(); setActive(a => a + 1); }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
