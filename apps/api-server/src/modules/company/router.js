import { Router } from 'express';
import { Company } from './model.js';

export const companyRouter = Router();

companyRouter.get('/', async (request, response, next) => {
  try {
    const companies = await Company.find({ tenantId: request.tenantId }).sort({ name: 1 }).lean();
    return response.json({ data: companies, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});

companyRouter.post('/', async (request, response, next) => {
  try {
    const actor = request.body.createdBy ?? 'system';
    const company = await Company.create({ ...request.body, tenantId: request.tenantId, createdBy: actor, updatedBy: actor });
    return response.status(201).json({ data: company, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});