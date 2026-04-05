import { createClient } from '@/lib/supabase/server';
import { Header } from './Header';

// Thin server wrapper — fetches auth state, passes it down to the client Header
export async function HeaderServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <Header user={user ? { id: user.id, email: user.email ?? '' } : null} />;
}
