export function buildBranch({ tenantId, companyId, name, code, address, actorId }) {
  if (!tenantId || !companyId) {
    throw Object.assign(new Error('Tenant and company contexts are required.'), { code: 'CONTEXT_REQUIRED', statusCode: 400, expose: true });
  }
  if (!name || typeof name !== 'string' || !name.trim() || !code || typeof code !== 'string' || !code.trim()) {
    throw Object.assign(new Error('Branch name and code are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  if (!actorId) throw Object.assign(new Error('Actor context is required.'), { code: 'ACTOR_CONTEXT_REQUIRED', statusCode: 400, expose: true });

  return { tenantId, companyId, name: name.trim(), code: code.trim().toUpperCase(), address: address?.trim(), active: true, createdBy: actorId, updatedBy: actorId };
}