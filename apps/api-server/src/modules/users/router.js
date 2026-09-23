import { Router } from 'express';
import { User } from './model.js';

export const usersRouter = Router();

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({ tenantId: request.tenantId }).sort({ displayName: 1 }).lean();
    return response.json({ data: users, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});

usersRouter.post('/', async (request, response, next) => {
  try {
    const actor = request.body.createdBy ?? 'system';
    const user = await User.create({ ...request.body, tenantId: request.tenantId, createdBy: actor, updatedBy: actor });
    return response.status(201).json({ data: user, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});