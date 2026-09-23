export const colors = {
  ink: '#17221D',
  muted: '#68736D',
  surface: '#F7F8F5',
  line: '#DDE3DE',
  brand: '#2F6B4F',
  danger: '#B5463A',
  warning: '#B8782C'
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const typography = {
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 12, lineHeight: 16 },
  heading: { fontSize: 28, lineHeight: 34 }
} as const;

export type DesignTokenSet = typeof colors & typeof spacing & typeof typography;