export function buildTenant({ key, name, actorId }) {
  if (!key || !name || typeof name !== 'string' || !name.trim()) {
    throw Object.assign(new Error('Tenant key and name are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  return { key: key.toLowerCase(), name: name.trim(), active: true, createdBy: actorId ?? 'system' };
}