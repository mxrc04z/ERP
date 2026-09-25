export const authController = ({ operation, service }) => async (request, response, next) => {
  try {
    let data;
    if (operation === 'login') data = await service.login({ request, ...request.body, tenantId: request.body.tenantId || request.tenantId });
    if (operation === 'logout') data = await service.logout({ request, ...request.body });
    if (operation === 'me') {
      if (!request.auth?.userId) return response.status(401).json({ code: 'UNAUTHORIZED', message: 'Authentication required.', traceId: request.id });
      data = await service.me({ tenantId: request.auth.tenantId, userId: request.auth.userId });
    }
    if (operation === 'register') data = await service.register({ request, ...request.body, tenantId: request.body.tenantId || request.tenantId });
    return response.status(operation === 'register' ? 201 : 200).json({ data, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};