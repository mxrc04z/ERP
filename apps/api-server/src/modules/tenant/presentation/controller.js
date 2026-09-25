export const currentTenantController = ({ currentTenant }) => async (request, response, next) => {
  try {
    const tenant = await currentTenant({ tenantId: request.tenantId });
    if (!tenant) return response.status(404).json({ code: 'TENANT_NOT_FOUND', message: 'Tenant not found.', traceId: request.id });
    return response.json({ data: tenant, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createTenantController = ({ createTenant }) => async (request, response, next) => {
  try {
    const tenant = await createTenant({ ...request.body, key: request.tenantId, actorId: request.auth?.userId ?? request.body.createdBy });
    return response.status(201).json({ data: tenant, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};