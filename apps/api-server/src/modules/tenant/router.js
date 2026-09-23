import { Router } from 'express';
import { Tenant } from './model.js';

export const tenantRouter = Router();

tenantRouter.get('/current', async (request, response, next) => {
  try {
    const tenant = await Tenant.findOne({ key: request.tenantId }).lean();
    if (!tenant) return response.status(404).json({ code: 'TENANT_NOT_FOUND', message: 'Tenant not found.' });
    return response.json({ data: tenant, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});

tenantRouter.post('/', async (request, response, next) => {
  try {
    const tenant = await Tenant.create({ ...request.body, key: request.tenantId, createdBy: request.body.createdBy ?? 'system' });
    return response.status(201).json({ data: tenant, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});