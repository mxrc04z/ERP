import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { requireCredentials, requireRegistrationData } from '../domain/auth.js';

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const SALT_ROUNDS = 10;

export function createAuthService({ repository, signAccessToken, recordAuditEvent }) {
  const getEffectivePermissions = async (user) => {
    const roles = await repository.findRoles(user.tenantId, user.roles ?? []);
    return [...new Set([...(user.permissions ?? []), ...roles.flatMap((role) => role.permissions ?? [])])];
  };

  return {
    async login({ request, email, password, tenantId }) {
      requireCredentials({ email, password });
      const user = await repository.findUser(tenantId, email.toLowerCase());
      const identity = user && await repository.findLocalIdentity(tenantId, user._id.toString());
      if (!user?.active || !identity?.passwordHash || !(await bcrypt.compare(password, identity.passwordHash))) {
        if (user) await recordAuditEvent(request, { actorId: user._id.toString(), action: 'auth.login.failed', resource: 'auth', metadata: { email } });
        throw Object.assign(new Error('Invalid credentials.'), { code: 'INVALID_CREDENTIALS', statusCode: 401, expose: true });
      }

      const permissions = await getEffectivePermissions(user);
      const sessionId = randomUUID();
      const refreshToken = randomUUID();
      await repository.createSession({ tenantId, userId: user._id.toString(), token: refreshToken, expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS), userAgent: request.headers['user-agent'], ip: request.ip });
      const accessToken = signAccessToken({ userId: user._id.toString(), tenantId, roles: user.roles ?? [], permissions, sessionId });
      await recordAuditEvent(request, { actorId: user._id.toString(), action: 'auth.login.success', resource: 'auth', metadata: { email } });
      return { accessToken, refreshToken, expiresIn: 15 * 60, tokenType: 'Bearer', user: { id: user._id.toString(), email: user.email, displayName: user.displayName, roles: user.roles, permissions, tenantId } };
    },
    async logout({ request, refreshToken }) {
      if (refreshToken) await repository.revokeSession(refreshToken);
      await recordAuditEvent(request, { actorId: request.auth?.userId ?? 'system', action: 'auth.logout', resource: 'auth' });
      return { success: true };
    },
    async me({ tenantId, userId }) {
      const user = await repository.findUserById(tenantId, userId);
      if (!user) throw Object.assign(new Error('User not found.'), { code: 'USER_NOT_FOUND', statusCode: 404, expose: true });
      const permissions = await getEffectivePermissions(user);
      return { id: user._id.toString(), email: user.email, displayName: user.displayName, roles: user.roles, permissions, tenantId: user.tenantId, active: user.active };
    },
    async register({ request, tenantId, email, password, displayName, roles = [] }) {
      requireRegistrationData({ email, password, displayName });
      if (await repository.findUser(tenantId, email.toLowerCase())) throw Object.assign(new Error('User already exists.'), { code: 'USER_EXISTS', statusCode: 409, expose: true });
      const actor = request.auth?.userId || request.body.createdBy || 'system';
      const user = await repository.createUser({ tenantId, email: email.toLowerCase(), displayName, roles, permissions: [], active: true, createdBy: actor, updatedBy: actor });
      await repository.createIdentity({ tenantId, userId: user._id.toString(), provider: 'local', subject: user.email, passwordHash: await bcrypt.hash(password, SALT_ROUNDS), isLocal: true });
      await recordAuditEvent(request, { actorId: actor, action: 'auth.register', resource: 'user', resourceId: user._id.toString(), metadata: { email: user.email } });
      return { id: user._id.toString(), email: user.email, displayName: user.displayName, roles: user.roles, tenantId: user.tenantId };
    }
  };
}