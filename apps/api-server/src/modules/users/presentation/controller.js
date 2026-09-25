export const listUsersController = ({ listUsers }) => async (request, response, next) => {
  try {
    const users = await listUsers({ tenantId: request.tenantId });
    return response.json({ data: users, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createUserController = ({ createUser }) => async (request, response, next) => {
  try {
    const user = await createUser({ ...request.body, tenantId: request.tenantId, actorId: request.auth?.userId ?? request.body.createdBy });
    return response.status(201).json({ data: user, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};