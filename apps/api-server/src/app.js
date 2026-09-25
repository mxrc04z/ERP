import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { registerCoreModules } from './modules/index.js';
import { attachAuthContext, enforceTenantConsistency } from './middleware/auth.js';

const tenantHeader = 'x-tenant-id';

export const tenantContext = (request, response, next) => {
  const tenantId = request.header(tenantHeader);

  if (!tenantId || !/^[a-zA-Z0-9_-]{2,100}$/.test(tenantId)) {
    return response.status(400).json({
      code: 'TENANT_CONTEXT_REQUIRED',
      message: `A valid ${tenantHeader} header is required.`,
      traceId: request.id
    });
  }

  request.tenantId = tenantId;
  return next();
};

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp());
  app.use(attachAuthContext);
  app.use(tenantContext);
  app.use(enforceTenantConsistency);

  app.get('/health', (request, response) => {
    response.json({ data: { status: 'ok' }, meta: {}, traceId: request.id });
  });

  registerCoreModules(app);

  app.use((error, request, response, next) => {
    request.log.error(error);
    response.status(error.statusCode ?? 500).json({
      code: error.code ?? 'INTERNAL_SERVER_ERROR',
      message: error.expose ? error.message : 'An unexpected error occurred.',
      details: {},
      traceId: request.id
    });
  });

  return app;
};
