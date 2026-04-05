import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';

const CONTENT = {
  fr: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : avril 2025',
    sections: [
      {
        title: 'Données collectées',
        body: 'Lors de l\'inscription, nous collectons votre nom, adresse e-mail, numéro de téléphone et type de compte. Lors de la publication d\'une annonce, nous collectons les informations de la propriété et les photos.',
      },
      {
        title: 'Utilisation des données',
        body: 'Vos données sont utilisées uniquement pour faire fonctionner le service : créer votre compte, afficher vos annonces et vous permettre d\'être contacté par des locataires potentiels.',
      },
      {
        title: 'Partage des données',
        body: 'Nous ne vendons ni ne partageons vos données avec des tiers à des fins commerciales. Votre numéro de téléphone n\'est visible que sur vos annonces approuvées.',
      },
      {
        title: 'Photos',
        body: 'Les photos téléversées sont stockées sur Cloudinary, un service tiers sécurisé. Elles sont publiques et accessibles via une URL directe.',
      },
      {
        title: 'Suppression de compte',
        body: 'Vous pouvez demander la suppression de votre compte et de toutes vos données en nous contactant par e-mail ou WhatsApp.',
      },
      {
        title: 'Contact',
        body: 'Pour toute question concernant vos données personnelles : info@ayitikay.com',
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    updated: 'Last updated: April 2025',
    sections: [
      {
        title: 'Data collected',
        body: 'When you sign up, we collect your name, email address, phone number, and account type. When you post a listing, we collect the property details and photos.',
      },
      {
        title: 'How we use your data',
        body: 'Your data is used solely to operate the service: create your account, display your listings, and allow potential tenants to contact you.',
      },
      {
        title: 'Data sharing',
        body: 'We do not sell or share your data with third parties for commercial purposes. Your phone number is only visible on your approved listings.',
      },
      {
        title: 'Photos',
        body: 'Uploaded photos are stored on Cloudinary, a secure third-party service. They are public and accessible via a direct URL.',
      },
      {
        title: 'Account deletion',
        body: 'You can request deletion of your account and all associated data by contacting us by email or WhatsApp.',
      },
      {
        title: 'Contact',
        body: 'For any questions about your personal data: info@ayitikay.com',
      },
    ],
  },
  ht: {
    title: 'Politik konfidansyalite',
    updated: 'Dènye mizajou: avril 2025',
    sections: [
      {
        title: 'Done nou kolekte',
        body: 'Lè ou enskri, nou kolekte non ou, adrès imèl, nimewo telefòn, ak tip kont. Lè ou poste yon lis, nou kolekte enfòmasyon pwopriyete a ak foto yo.',
      },
      {
        title: 'Kijan nou itilize done ou',
        body: 'Done ou yo itilize sèlman pou fè sèvis la fonksyone: kreye kont ou, montre lis ou, ak pèmèt lokatè potansyèl kontakte ou.',
      },
      {
        title: 'Pataj done',
        body: 'Nou pa vann ni pataje done ou ak twazyèm pati pou rezon komèsyal. Nimewo telefòn ou sèlman vizib sou lis ou yo ki apwouve.',
      },
      {
        title: 'Foto',
        body: 'Foto telechaje yo estoke sou Cloudinary, yon sèvis twazyèm pati sekirize. Yo piblik epi aksesib via URL dirèk.',
      },
      {
        title: 'Efase kont',
        body: 'Ou ka mande efase kont ou ak tout done ou yo lè ou kontakte nou pa imèl oswa WhatsApp.',
      },
      {
        title: 'Kontakte',
        body: 'Pou nenpòt kesyon sou done pèsonèl ou: info@ayitikay.com',
      },
    ],
  },
};

export default async function PrivacyPage({
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
