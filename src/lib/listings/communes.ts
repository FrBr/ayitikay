import { createClient } from '@/lib/supabase/server';

export async function getCommunes(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('communes')
    .select('name')
    .order('name', { ascending: true });

  return (data ?? []).map((r) => r.name as string);
}
