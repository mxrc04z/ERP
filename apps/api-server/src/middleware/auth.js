import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-insecure-secret-change-in-production';
const TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY ?? '15m';

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function extractBearerToken(request) {
  const header = request.header('authorization') || request.header('Authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer') return null;
  return token || null;
}

export const attachAuthContext = (request, response, next) => {
  const token = extractBearerToken(request);
  if (!token) {
    request.auth = null;
    return next();
  }
  try {
    const decoded = verifyAccessToken(token);
    request.auth = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      roles: Array.isArray(decoded.roles) ? decoded.roles : [],
      permissions: Array.isArray(decoded.permissions) ? decoded.permissions : [],
      sessionId: decoded.sessionId
    };
    if (decoded.tenantId && !request.tenantId) {
      request.tenantId = decoded.tenantId;
    }
    return next();
  } catch (error) {
    request.auth = null;
    request.log?.warn({ err: error }, 'Invalid access token');
    return next();
  }
};

export const requireAuth = (request, response, next) => {
  if (!request.auth?.userId) {
    return response.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required.',
      traceId: request.id
    });
  }
  return next();
};

export const enforceTenantConsistency = (request, response, next) => {
  if (request.auth?.tenantId && request.tenantId && request.auth.tenantId !== request.tenantId) {
    return response.status(403).json({
      code: 'TENANT_MISMATCH',
      message: 'Tenant context does not match authenticated session.',
      traceId: request.id
    });
  }
  return next();
};
