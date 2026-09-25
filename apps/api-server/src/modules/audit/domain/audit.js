export function buildAuditEvent({ tenantId, actorId = 'system', action, resource, resourceId, metadata = {} }) {
  if (!tenantId || !action || !resource) {
    throw Object.assign(new Error('Tenant, action and resource are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  return { tenantId, actorId, action, resource, resourceId, metadata };
}