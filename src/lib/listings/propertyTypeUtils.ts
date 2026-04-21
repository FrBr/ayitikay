/** Client-safe — no server imports */

export interface PropertyTypeOption {
  slug: string;
  label_fr: string;
  label_ht: string;
  label_en: string;
}

/** Pick the right label for the current locale */
export function getLabel(pt: PropertyTypeOption, locale: string): string {
  if (locale === 'ht') return pt.label_ht;
  if (locale === 'en') return pt.label_en;
  return pt.label_fr;
}
