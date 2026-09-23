import { Router } from 'express';
import { Identity } from './model.js';

export const identityRouter = Router();

identityRouter.get('/:userId', async (request, response, next) => {
  try {
    const identities = await Identity.find({ tenantId: request.tenantId, userId: request.params.userId }).lean();
    return response.json({ data: identities, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});

identityRouter.post('/', async (request, response, next) => {
  try {
    const identity = await Identity.create({ ...request.body, tenantId: request.tenantId });
    return response.status(201).json({ data: identity, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});