export function buildIdentity({ tenantId, userId, provider, subject, passwordHash, isLocal = false }) {
  if (!tenantId || !userId || !provider || !subject) {
    throw Object.assign(new Error('Tenant, user, provider and subject are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  return { tenantId, userId, provider, subject, passwordHash, isLocal };
}