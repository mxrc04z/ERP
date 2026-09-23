export type DateInput = Date | string | number;

export function toDate(value: DateInput): Date {
  const result = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(result.getTime())) throw new Error('Invalid date');
  return result;
}

export function toIsoDate(value: DateInput): string {
  return toDate(value).toISOString();
}

export function formatDate(value: DateInput, locale = 'es-ES', options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(toDate(value));
}