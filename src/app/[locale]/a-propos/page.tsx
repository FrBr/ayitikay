import { getTranslations } from 'next-intl/server';
import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';
import { Link } from '@/i18n/navigation';

const CONTENT = {
  fr: {
    title: 'À propos d\'AyitiKay',
    mission_title: 'Notre mission',
    mission: 'AyitiKay connecte les propriétaires haïtiens avec des locataires sérieux. Nous rendons la recherche de logement simple, transparente et sécurisée — sans intermédiaire, sans frais cachés.',
    how_title: 'Comment ça marche',
    how: [
      'Les propriétaires publient leurs annonces gratuitement.',
      'Les locataires cherchent et filtrent par commune, budget et équipements.',
      'Le contact se fait directement par WhatsApp — sans passer par nous.',
      'Toutes les annonces sont vérifiées avant publication.',
    ],
    market_title: 'Le marché haïtien',
    market: 'En Haïti, les baux sont annuels et le loyer est généralement payé en une seule fois à l\'avance. AyitiKay affiche toujours le prix annuel en USD avec l\'équivalent en HTG pour faciliter la comparaison.',
    cta: 'Publier une annonce',
  },
  en: {
    title: 'About AyitiKay',
    mission_title: 'Our mission',
    mission: 'AyitiKay connects Haitian property owners with serious tenants. We make finding housing simple, transparent, and safe — no middlemen, no hidden fees.',
    how_title: 'How it works',
    how: [
      'Landlords publish listings for free.',
      'Renters search and filter by commune, budget, and amenities.',
      'Contact happens directly via WhatsApp — no intermediary.',
      'All listings are reviewed before going live.',
    ],
    market_title: 'The Haitian rental market',
    market: 'In Haiti, leases are annual and rent is typically paid upfront in a lump sum. AyitiKay always shows the annual price in USD with the HTG equivalent for easy comparison.',
    cta: 'Post a listing',
  },
  ht: {
    title: 'Sou AyitiKay',
    mission_title: 'Misyon nou',
    mission: 'AyitiKay konekte pwopriyetè ayisyen ak lokatè serye. Nou rann rechèch kay senp, transparan, epi san danje — san entèmedyè, san frè kache.',
    how_title: 'Kijan li travay',
    how: [
      'Pwopriyetè poste lis yo gratis.',
      'Lokatè chèche epi filtre pa komin, bidjè ak ekipman.',
      'Kontak fèt dirèkteman via WhatsApp — san pase pa nou.',
      'Tout lis yo verifye avan piblikasyon.',
    ],
    market_title: 'Mache lwaye Ayiti',
    market: 'Nan Ayiti, kontra lwaye se anyèl epi lwaye anjeneral peye alavan nan yon sèl fwa. AyitiKay toujou montre pri anyèl an USD ak ekivalan HTG a pou fasilite konparezon.',
    cta: 'Poste yon lis',
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = CONTENT[(locale as keyof typeof CONTENT)] ?? CONTENT.fr;
  await getTranslations('common');

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          <h1 className="text-3xl font-bold text-slate-900">{c.title}</h1>

          <Section title={c.mission_title}>
            <p className="text-slate-600 leading-relaxed">{c.mission}</p>
          </Section>

          <Section title={c.how_title}>
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              {c.how.map((step, i) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </Section>

          <Section title={c.market_title}>
            <p className="text-slate-600 leading-relaxed">{c.market}</p>
          </Section>

          <Link
            href="/poste"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D9E75] text-white font-semibold text-sm hover:bg-[#158a63] transition-colors"
          >
            {c.cta} →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
