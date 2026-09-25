export const listRolesController = ({ listRoles }) => async (request, response, next) => {
  try {
    const roles = await listRoles({ tenantId: request.tenantId });
    return response.json({ data: roles, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createRoleController = ({ createRole }) => async (request, response, next) => {
  try {
    const role = await createRole({ ...request.body, tenantId: request.tenantId });
    return response.status(201).json({ data: role, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};