import { createClient } from '@/lib/supabase/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { Link } from '@/i18n/navigation';

const CONTENT = {
  fr: {
    title: 'Agents immobiliers',
    subtitle: 'Des professionnels vérifiés pour vous accompagner dans votre recherche.',
    empty: 'Aucun agent enregistré pour le moment.',
    listings: 'annonce',
    listings_plural: 'annonces',
    contact: 'Contacter',
    become_title: 'Vous êtes agent ?',
    become_body: 'Créez votre compte gratuitement et commencez à publier vos annonces dès aujourd\'hui.',
    become_cta: 'Créer un compte agent',
  },
  en: {
    title: 'Real estate agents',
    subtitle: 'Verified professionals to help you with your search.',
    empty: 'No agents registered yet.',
    listings: 'listing',
    listings_plural: 'listings',
    contact: 'Contact',
    become_title: 'Are you an agent?',
    become_body: 'Create your free account and start publishing listings today.',
    become_cta: 'Create an agent account',
  },
  ht: {
    title: 'Ajan imobilye',
    subtitle: 'Pwofesyonèl verifye pou ede ou nan rechèch ou.',
    empty: 'Pa gen ajan anrejistre pou kounye a.',
    listings: 'lis',
    listings_plural: 'lis',
    contact: 'Kontakte',
    become_title: 'Ou se yon ajan?',
    become_body: 'Kreye kont ou gratis epi kòmanse poste lis ou jodi a.',
    become_cta: 'Kreye yon kont ajan',
  },
};

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = CONTENT[(locale as keyof typeof CONTENT)] ?? CONTENT.fr;

  const supabase = await createClient();
  const { data: agents } = await supabase
    .from('profiles')
    .select('id, agency_name, full_name, agency_description, agency_logo_url, agency_slug, phone')
    .eq('account_type', 'agent')
    .not('agency_name', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">{c.title}</h1>
            <p className="text-slate-500 mt-1">{c.subtitle}</p>
          </div>

          {!agents || agents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400">{c.empty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#e6f7f2] flex items-center justify-center shrink-0 text-xl font-bold text-[#1D9E75]">
                    {(agent.agency_name ?? agent.full_name ?? 'A')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {agent.agency_name ?? agent.full_name}
                    </p>
                    {agent.agency_description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{agent.agency_description}</p>
                    )}
                    {agent.phone && (
                      <a
                        href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#1D9E75] hover:text-[#158a63] transition-colors"
                      >
                        {c.contact} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Become an agent CTA */}
          <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">{c.become_title}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{c.become_body}</p>
            </div>
            <Link
              href="/rejistre"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#158a63] transition-colors whitespace-nowrap"
            >
              {c.become_cta}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
