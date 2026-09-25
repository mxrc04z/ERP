export function buildRole({ tenantId, name, permissions = [] }) {
  if (!tenantId || !name || typeof name !== 'string' || !name.trim()) {
    throw Object.assign(new Error('Tenant and role name are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  return { tenantId, name: name.trim(), permissions };
}