import { Router } from 'express';
import { Branch } from './model.js';

export const branchRouter = Router();

branchRouter.get('/', async (request, response, next) => {
  try {
    const filter = { tenantId: request.tenantId };
    if (request.query.companyId) filter.companyId = request.query.companyId;
    const branches = await Branch.find(filter).sort({ name: 1 }).lean();
    return response.json({ data: branches, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});

branchRouter.post('/', async (request, response, next) => {
  try {
    const actor = request.body.createdBy ?? 'system';
    const branch = await Branch.create({ ...request.body, tenantId: request.tenantId, createdBy: actor, updatedBy: actor });
    return response.status(201).json({ data: branch, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});