export type Permission = string;

export interface PermissionSubject {
  permissions: readonly Permission[];
  roles?: readonly string[];
}

export function hasPermission(subject: PermissionSubject, permission: Permission): boolean {
  return subject.permissions.includes(permission) || subject.permissions.includes('*');
}

export function hasAnyPermission(subject: PermissionSubject, permissions: readonly Permission[]): boolean {
  return permissions.some((permission) => hasPermission(subject, permission));
}