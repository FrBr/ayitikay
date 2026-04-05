import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoFull } from '@/components/ui/Logo';
import { logout } from '@/lib/auth/actions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/connexion?redirect=/admin/moderation');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/');

  return (
    <html lang="fr" className="h-full">
      <body className="h-full flex flex-col bg-slate-50 antialiased">
        {/* Admin top bar */}
        <header className="bg-slate-900 text-white h-14 flex items-center px-6 gap-4 shrink-0">
          <LogoFull className="[&>span]:text-white" />
          <span className="text-slate-400 text-xs">|</span>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Admin</span>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="text-slate-400">{profile.full_name ?? user.email}</span>
            <form action={logout}>
              <button type="submit" className="text-slate-400 hover:text-white transition-colors text-xs">
                Déconnexion
              </button>
            </form>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-52 bg-slate-800 text-slate-300 flex flex-col py-4 shrink-0">
            <nav className="space-y-0.5 px-2">
              <AdminLink href="/admin/moderation" label="Modération" icon={<ClipboardIcon />} />
              <AdminLink href="/admin/listings" label="Toutes les annonces" icon={<ListIcon />} />
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function AdminLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
    >
      {icon}
      {label}
    </a>
  );
}

function ClipboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
