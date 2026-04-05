import { HeaderServer as Header } from '@/components/layout/HeaderServer';
import { Footer } from '@/components/layout/Footer';

const CONTENT = {
  fr: {
    title: 'Contact',
    subtitle: 'Une question ? Écrivez-nous sur WhatsApp ou par e-mail.',
    whatsapp_label: 'WhatsApp (support)',
    whatsapp_note: 'Disponible du lundi au vendredi, 8h–18h (heure d\'Haïti)',
    email_label: 'E-mail',
    email_note: 'Réponse sous 24–48h.',
    report_title: 'Signaler une annonce',
    report_body: 'Si vous voyez une annonce frauduleuse ou incorrecte, contactez-nous par WhatsApp avec l\'identifiant de l\'annonce et nous la supprimerons rapidement.',
  },
  en: {
    title: 'Contact',
    subtitle: 'Have a question? Reach us on WhatsApp or by email.',
    whatsapp_label: 'WhatsApp (support)',
    whatsapp_note: 'Available Monday to Friday, 8am–6pm (Haiti time)',
    email_label: 'Email',
    email_note: 'We reply within 24–48 hours.',
    report_title: 'Report a listing',
    report_body: 'If you see a fraudulent or incorrect listing, contact us on WhatsApp with the listing ID and we\'ll remove it promptly.',
  },
  ht: {
    title: 'Kontakte nou',
    subtitle: 'Gen yon kesyon? Ekri nou sou WhatsApp oswa pa imèl.',
    whatsapp_label: 'WhatsApp (sipò)',
    whatsapp_note: 'Disponib lendi rive vandredi, 8è–18è (lè Ayiti)',
    email_label: 'Imèl',
    email_note: 'Nou reponn nan 24–48è.',
    report_title: 'Rapòte yon lis',
    report_body: 'Si ou wè yon lis ki fwodile oswa ki pa kòrèk, kontakte nou sou WhatsApp ak ID lis la epi nou pral retire li rapidman.',
  },
};

export default async function ContactPage({
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
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{c.title}</h1>
            <p className="text-slate-500 mt-1">{c.subtitle}</p>
          </div>

          <ContactCard icon="💬" label={c.whatsapp_label} note={c.whatsapp_note}>
            <a
              href="https://wa.me/50912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-semibold hover:underline"
            >
              +509 12 34 5678
            </a>
          </ContactCard>

          <ContactCard icon="✉️" label={c.email_label} note={c.email_note}>
            <a
              href="mailto:info@ayitikay.com"
              className="text-[#1D9E75] font-semibold hover:underline"
            >
              info@ayitikay.com
            </a>
          </ContactCard>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h2 className="font-semibold text-amber-900 mb-1">{c.report_title}</h2>
            <p className="text-sm text-amber-800 leading-relaxed">{c.report_body}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ContactCard({
  icon, label, note, children,
}: {
  icon: string; label: string; note: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 items-start">
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
        {children}
        <p className="text-xs text-slate-400 mt-1">{note}</p>
      </div>
    </div>
  );
}
