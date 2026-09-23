export interface AuthSession {
  accessToken: string;
  expiresAt: number;
  userId: string;
  tenantId: string;
}

export interface AuthStorage {
  get(): Promise<AuthSession | null> | AuthSession | null;
  set(session: AuthSession): Promise<void> | void;
  clear(): Promise<void> | void;
}

export function isSessionExpired(session: AuthSession, now = Date.now()): boolean {
  return session.expiresAt <= now;
}

export function createMemoryAuthStorage(): AuthStorage {
  let session: AuthSession | null = null;
  return {
    get: () => session,
    set: (value) => { session = value; },
    clear: () => { session = null; }
  };
}