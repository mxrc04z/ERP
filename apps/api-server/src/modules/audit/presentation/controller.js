export const listAuditController = ({ listAudit }) => async (request, response, next) => {
  try {
    const events = await listAudit({ tenantId: request.tenantId });
    return response.json({ data: events, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createAuditController = ({ createAudit }) => async (request, response, next) => {
  try {
    const event = await createAudit({ ...request.body, tenantId: request.tenantId, actorId: request.auth?.userId ?? request.body.actorId });
    return response.status(201).json({ data: event, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};