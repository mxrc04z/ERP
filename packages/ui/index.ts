export type Size = 'sm' | 'md' | 'lg';

export interface UiState {
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface TableColumn<Row> {
  key: string;
  header: string;
  render?: (row: Row) => unknown;
}