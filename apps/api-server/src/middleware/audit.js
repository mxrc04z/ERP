import { createAuditService } from '../modules/audit/application/service.js';
import { createAuditRepository } from '../modules/audit/infrastructure/repository.js';

const createAudit = createAuditService({ repository: createAuditRepository() });

export const audit = (options = {}) => {
  const {
    action,
    resource,
    getResourceId = (request) => request.params?.id || request.body?._id || request.body?.id,
    getMetadata = () => ({})
  } = options;

  return async (request, response, next) => {
    response.on('finish', async () => {
      if (response.statusCode >= 400) return;
      try {
        const actorId = request.auth?.userId || request.body?.createdBy || 'system';
        await createAudit({
          tenantId: request.tenantId,
          actorId,
          action,
          resource,
          resourceId: getResourceId(request) ?? undefined,
          metadata: getMetadata(request, response)
        });
      } catch (error) {
        request.log?.warn({ err: error }, 'Failed to record audit event');
      }
    });
    return next();
  };
};

export async function recordAuditEvent(request, event) {
  try {
    const actorId = request.auth?.userId || event.actorId || 'system';
    await createAudit({
      tenantId: request.tenantId,
      actorId,
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId,
      metadata: event.metadata ?? {}
    });
  } catch (error) {
    request.log?.warn({ err: error }, 'Failed to record audit event');
  }
}
