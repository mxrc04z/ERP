export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  issues: ValidationIssue[];
}

export function validate<T>(value: T, checks: Array<(value: T) => ValidationIssue | null>): ValidationResult<T> {
  const issues = checks.map((check) => check(value)).filter((issue): issue is ValidationIssue => issue !== null);
  return issues.length ? { success: false, issues } : { success: true, data: value, issues: [] };
}

export const required = (path: string, message = 'This field is required') => (value: unknown): ValidationIssue | null =>
  value === null || value === undefined || value === '' ? { path, message } : null;