import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';

const CONTENT = {
  fr: {
    title: 'Conditions d\'utilisation',
    updated: 'Dernière mise à jour : avril 2025',
    sections: [
      {
        title: '1. Rôle de la plateforme',
        body: 'AyitiKay est une plateforme de mise en relation entre propriétaires et locataires. Nous ne sommes pas partie aux contrats de bail conclus entre les utilisateurs et n\'avons aucune responsabilité dans les transactions.',
      },
      {
        title: '2. Exactitude des informations',
        body: 'Les utilisateurs s\'engagent à fournir des informations exactes et à jour. Les annonces frauduleuses, inexactes ou trompeuses sont interdites et seront supprimées.',
      },
      {
        title: '3. Annonces et modération',
        body: 'Toutes les annonces sont soumises à une validation avant publication. AyitiKay se réserve le droit de refuser ou de supprimer toute annonce sans préavis.',
      },
      {
        title: '4. Baux annuels',
        body: 'En Haïti, les locations sont régies par des contrats annuels. AyitiKay affiche les prix en USD ; les paiements et conditions sont négociés directement entre les parties.',
      },
      {
        title: '5. Sécurité des paiements',
        body: 'AyitiKay ne traite aucun paiement. Ne jamais envoyer d\'argent avant d\'avoir visité la propriété et signé un contrat en bonne et due forme.',
      },
      {
        title: '6. Modification des conditions',
        body: 'AyitiKay peut modifier ces conditions à tout moment. La poursuite de l\'utilisation du service vaut acceptation des nouvelles conditions.',
      },
    ],
  },
  en: {
    title: 'Terms of service',
    updated: 'Last updated: April 2025',
    sections: [
      {
        title: '1. Platform role',
        body: 'AyitiKay is a platform connecting landlords and tenants. We are not a party to any lease agreements between users and bear no responsibility for transactions.',
      },
      {
        title: '2. Accuracy of information',
        body: 'Users agree to provide accurate and up-to-date information. Fraudulent, inaccurate, or misleading listings are prohibited and will be removed.',
      },
      {
        title: '3. Listings and moderation',
        body: 'All listings are subject to review before publication. AyitiKay reserves the right to refuse or remove any listing without notice.',
      },
      {
        title: '4. Annual leases',
        body: 'In Haiti, rentals are governed by annual contracts. AyitiKay displays prices in USD; payment terms and conditions are negotiated directly between the parties.',
      },
      {
        title: '5. Payment safety',
        body: 'AyitiKay processes no payments. Never send money before visiting the property and signing a proper written contract.',
      },
      {
        title: '6. Changes to terms',
        body: 'AyitiKay may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.',
      },
    ],
  },
  ht: {
    title: 'Kondisyon itilizasyon',
    updated: 'Dènye mizajou: avril 2025',
    sections: [
      {
        title: '1. Wòl platfòm nan',
        body: 'AyitiKay se yon platfòm ki konekte pwopriyetè ak lokatè. Nou pa pati nan okenn kontra lwaye ant itilizatè yo epi nou pa responsab pou tranzaksyon yo.',
      },
      {
        title: '2. Egzaktitid enfòmasyon',
        body: 'Itilizatè yo dakò pou bay enfòmasyon egzak ak ajou. Lis fwodile, pa kòrèk, oswa twonpè entèdi epi pral retire.',
      },
      {
        title: '3. Lis ak moderasyon',
        body: 'Tout lis soumèt pou verifikasyon avan piblikasyon. AyitiKay gen dwa refize oswa retire nenpòt lis san preyavi.',
      },
      {
        title: '4. Kontra anyèl',
        body: 'Nan Ayiti, lwaye gouvène pa kontra anyèl. AyitiKay montre pri an USD; kondisyon peman negosye dirèkteman ant pati yo.',
      },
      {
        title: '5. Sekirite peman',
        body: 'AyitiKay pa trete okenn peman. Pa janm voye lajan avan ou vizite kay la epi siyen yon kontra ekri an règ.',
      },
      {
        title: '6. Chanjman kondisyon',
        body: 'AyitiKay ka modifye kondisyon sa yo nenpòt ki lè. Kontinye itilize sèvis la vle di ou aksepte nouvo kondisyon yo.',
      },
    ],
  },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = CONTENT[(locale as keyof typeof CONTENT)] ?? CONTENT.fr;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{c.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{c.updated}</p>
          </div>
          {c.sections.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-2">{s.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
