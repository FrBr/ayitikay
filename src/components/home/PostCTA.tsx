import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function PostCTA() {
  const t = useTranslations('cta');
  const tNav = useTranslations('nav');

  return (
    <section className="py-16 bg-[#1D9E75] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* House icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6 backdrop-blur-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          {t('title')}
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/poste"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#1D9E75] font-bold text-base hover:bg-slate-50 transition-colors shadow-lg"
          >
            <PlusCircleIcon />
            {t('button')}
          </Link>
          <span className="text-white/60 text-sm">
            {t('already_have')}{' '}
            <Link href="/connexion" className="text-white font-semibold underline underline-offset-2 hover:no-underline">
              {t('login_link')}
            </Link>
          </span>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
          <span className="flex items-center gap-1.5">
            <CheckIcon />
            Gratis pou poste
          </span>
          <span className="flex items-center gap-1.5">
            <CheckIcon />
            Pa gen komisyon
          </span>
          <span className="flex items-center gap-1.5">
            <CheckIcon />
            Kontakte dirèkteman via WhatsApp
          </span>
        </div>
      </div>
    </section>
  );
}

function PlusCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
