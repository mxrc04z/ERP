export type MessageCatalog = Record<string, string>;

export interface Translator {
  locale: string;
  t(key: string, values?: Record<string, string | number>): string;
}

export function createTranslator(locale: string, catalog: MessageCatalog, fallback: MessageCatalog = {}): Translator {
  return {
    locale,
    t: (key, values = {}) => {
      const template = catalog[key] ?? fallback[key] ?? key;
      return template.replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? `{${name}}`));
    }
  };
}