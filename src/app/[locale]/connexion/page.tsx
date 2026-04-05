import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Connexion' };

interface Props {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function ConnexionPage({ searchParams }: Props) {
  const { redirect, error } = await searchParams;
  const t = await getTranslations('auth');

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1D9E75] mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{t('login_heading')}</h1>
              <p className="text-sm text-slate-500 mt-1">{t('login_subtitle')}</p>
            </div>

            {error === 'auth_callback_failed' && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {t('callback_error')}
              </div>
            )}

            <LoginForm redirectTo={redirect} />

            <p className="mt-6 text-center text-sm text-slate-500">
              {t('no_account')}{' '}
              <a href="/rejistre" className="font-semibold text-[#1D9E75] hover:underline">
                {t('signup_link')}
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
