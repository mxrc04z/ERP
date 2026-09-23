import { Router } from 'express';
import { AuditEvent } from './model.js';

export const auditRouter = Router();

auditRouter.get('/', async (request, response, next) => {
  try {
    const events = await AuditEvent.find({ tenantId: request.tenantId }).sort({ createdAt: -1 }).limit(100).lean();
    return response.json({ data: events, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});

auditRouter.post('/', async (request, response, next) => {
  try {
    const event = await AuditEvent.create({ ...request.body, tenantId: request.tenantId });
    return response.status(201).json({ data: event, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
});