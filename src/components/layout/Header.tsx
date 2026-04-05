'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { LogoFull } from '@/components/ui/Logo';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { logout } from '@/lib/auth/actions';
import { routing } from '@/i18n/routing';

interface User { id: string; email: string }

const LOCALE_LABELS: Record<string, string> = {
  fr: 'FR',
  ht: 'HT',
  en: 'EN',
};

export function Header({ user }: { user: User | null }) {
  const t        = useTranslations('nav');
  const pathname = usePathname();
  const locale   = useLocale();
  const router   = useRouter();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [langOpen, setLangOpen]   = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/recherche', label: t('search') },
  ];

  async function handleLogout() {
    setLogoutPending(true);
    await logout();
  }

  function switchLocale(next: string) {
    setLangOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" aria-label="AyitiKay accueil">
            <LogoFull />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href} href={href}
                className={`text-sm font-medium transition-colors hover:text-[#1D9E75] ${
                  pathname === href ? 'text-[#1D9E75]' : 'text-slate-600'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">

            {/* Language switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label={t('lang_label')}
              >
                <GlobeIcon />
                {LOCALE_LABELS[locale]}
                <ChevronIcon />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden py-1 min-w-[80px]">
                    {routing.locales.map(loc => (
                      <button
                        key={loc} type="button"
                        onClick={() => switchLocale(loc)}
                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                          locale === loc
                            ? 'bg-[#e6f7f2] text-[#1D9E75]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {LOCALE_LABELS[loc]}
                        <span className="ml-2 text-xs text-slate-400">
                          {loc === 'fr' ? 'Français' : loc === 'ht' ? 'Kreyòl' : 'English'}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-700 hover:text-[#1D9E75] transition-colors"
                >
                  {t('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutPending}
                  className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  {logoutPending ? '...' : t('logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/connexion"
                className="text-sm font-medium text-slate-700 hover:text-[#1D9E75] transition-colors"
              >
                {t('login')}
              </Link>
            )}

            <Link
              href="/poste"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#158a63] transition-colors"
            >
              <PlusIcon />
              {t('post')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setMenuOpen(v => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href} href={href}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1D9E75]"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {/* Language switcher mobile */}
            <div className="flex gap-1 px-3 pt-2">
              {routing.locales.map(loc => (
                <button
                  key={loc} type="button"
                  onClick={() => { switchLocale(loc); setMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    locale === loc
                      ? 'bg-[#1D9E75] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {LOCALE_LABELS[loc]}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutPending}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {logoutPending ? '...' : t('logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/connexion"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('login')}
                </Link>
              )}
              <Link
                href="/poste"
                className="block px-3 py-2 rounded-md text-sm font-semibold text-white bg-[#1D9E75] hover:bg-[#158a63] text-center"
                onClick={() => setMenuOpen(false)}
              >
                {t('post')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
