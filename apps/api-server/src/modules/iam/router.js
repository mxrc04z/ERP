import { Router } from 'express';
import { Role } from './model.js';

export const iamRouter = Router();

iamRouter.get('/roles', async (request, response, next) => {
  try {
    const roles = await Role.find({ tenantId: request.tenantId }).sort({ name: 1 }).lean();
    return response.json({ data: roles, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});

iamRouter.post('/roles', async (request, response, next) => {
  try {
    const role = await Role.create({ ...request.body, tenantId: request.tenantId });
    return response.status(201).json({ data: role, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});