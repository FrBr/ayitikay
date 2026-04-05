import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { PosteForm } from './PosteForm';
import { createClient } from '@/lib/supabase/server';
import { getCommunes } from '@/lib/listings/communes';

export const metadata: Metadata = { title: 'Poste yon lis' };

export default async function PostePage() {
  // Double-check auth server-side (proxy already guards this route,
  // but being explicit prevents accidental exposure if routing changes)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/poste');

  const [t, communes] = await Promise.all([
    getTranslations('post'),
    getCommunes(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8FAFC] py-10 px-4">
        <div className="max-w-xl mx-auto mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{t('page_title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('page_subtitle')}</p>
        </div>
        <PosteForm communes={communes} />
      </main>
      <Footer />
    </>
  );
}
