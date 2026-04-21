import { createClient } from '@/lib/supabase/server';

export interface PropertyTypeOption {
  slug: string;
  label_fr: string;
  label_ht: string;
  label_en: string;
}

export async function getPropertyTypes(): Promise<PropertyTypeOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('property_types')
    .select('slug, label_fr, label_ht, label_en')
    .order('sort_order', { ascending: true });

  return (data ?? []) as PropertyTypeOption[];
}

/** Pick the right label for the current locale */
export function getLabel(pt: PropertyTypeOption, locale: string): string {
  if (locale === 'ht') return pt.label_ht;
  if (locale === 'en') return pt.label_en;
  return pt.label_fr;
}
