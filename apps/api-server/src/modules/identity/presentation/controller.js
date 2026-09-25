export const listIdentitiesController = ({ listIdentities }) => async (request, response, next) => {
  try {
    const identities = await listIdentities({ tenantId: request.tenantId, userId: request.params.userId });
    return response.json({ data: identities, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createIdentityController = ({ createIdentity }) => async (request, response, next) => {
  try {
    const identity = await createIdentity({ ...request.body, tenantId: request.tenantId });
    return response.status(201).json({ data: identity, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};