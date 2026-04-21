/** Server-only — uses next/headers via createClient */
import { createClient } from '@/lib/supabase/server';
import type { PropertyTypeOption } from './propertyTypeUtils';

export type { PropertyTypeOption } from './propertyTypeUtils';

export async function getPropertyTypes(): Promise<PropertyTypeOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('property_types')
    .select('slug, label_fr, label_ht, label_en')
    .order('sort_order', { ascending: true });

  return (data ?? []) as PropertyTypeOption[];
}
