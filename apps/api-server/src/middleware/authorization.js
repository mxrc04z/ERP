import { hasPermission, hasAnyPermission } from '@erp/permissions';

export function getEffectivePermissions(actor = {}) {
  const roles = Array.isArray(actor.roles) ? actor.roles : [];
  const permissions = Array.isArray(actor.permissions) ? actor.permissions : [];
  return [...new Set([...permissions, ...roles.flatMap((role) => role?.permissions ?? role ?? [])])];
}

export const requirePermission = (permission) => (request, response, next) => {
  if (!request.auth?.userId) {
    return response.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required.',
      traceId: request.id
    });
  }

  const effective = {
    permissions: request.auth.permissions ?? []
  };
  if (hasPermission(effective, permission)) {
    return next();
  }
  return response.status(403).json({
    code: 'FORBIDDEN',
    message: `Missing required permission: ${permission}`,
    traceId: request.id
  });
};

export const requireAnyPermission = (permissions = []) => (request, response, next) => {
  if (!request.auth?.userId) {
    return response.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required.',
      traceId: request.id
    });
  }
  const effective = {
    permissions: request.auth.permissions ?? []
  };
  if (hasAnyPermission(effective, permissions)) {
    return next();
  }
  return response.status(403).json({
    code: 'FORBIDDEN',
    message: 'Missing required permissions.',
    traceId: request.id
  });
};
