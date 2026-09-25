export function buildUser({ tenantId, email, displayName, roles = [], permissions = [], actorId }) {
  if (!tenantId || !email || !displayName) {
    throw Object.assign(new Error('Tenant, email and displayName are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  return { tenantId, email: email.toLowerCase().trim(), displayName: displayName.trim(), roles, permissions, active: true, createdBy: actorId ?? 'system', updatedBy: actorId ?? 'system' };
}