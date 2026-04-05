import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | AyitiKay',
    default: 'AyitiKay — Jwenn Kay ou nan Ayiti',
  },
  description:
    'Trouvez des appartements et maisons à louer en Haïti. Pétion-Ville, Delmas, Tabarre, Cap-Haïtien et partout en Haïti.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ayitikay.ht'),
  openGraph: {
    siteName: 'AyitiKay',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
