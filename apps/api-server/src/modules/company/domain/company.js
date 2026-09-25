export function buildCompany({ tenantId, name, taxId, actorId }) {
  if (!tenantId) throw Object.assign(new Error('Tenant context is required.'), { code: 'TENANT_CONTEXT_REQUIRED', statusCode: 400, expose: true });
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw Object.assign(new Error('Company name is required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  if (!actorId) throw Object.assign(new Error('Actor context is required.'), { code: 'ACTOR_CONTEXT_REQUIRED', statusCode: 400, expose: true });

  return { tenantId, name: name.trim(), taxId: taxId?.trim(), active: true, createdBy: actorId, updatedBy: actorId };
}