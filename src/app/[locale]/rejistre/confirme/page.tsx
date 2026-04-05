import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'Tcheke imèl ou' };

export default async function ConfirmePage() {
  const t = await getTranslations('auth');

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e6f7f2] mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">{t('check_email_heading')}</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{t('check_email_body')}</p>
            <p className="text-xs text-slate-400">
              {t('check_email_spam')}{' '}
              <a href="/rejistre" className="text-[#1D9E75] underline">{t('try_again_link')}</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
