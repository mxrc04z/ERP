import { Router } from 'express';
import { createAuditController, listAuditController } from './presentation/controller.js';
import { createAuditService, listAuditService } from './application/service.js';
import { createAuditRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const auditRouter = Router();

const repository = createAuditRepository();
const listAudit = listAuditService({ repository });
const createAudit = createAuditService({ repository });

auditRouter.get('/', requirePermission(PERMISSIONS.AUDIT_READ), listAuditController({ listAudit }));
auditRouter.post('/', requirePermission(PERMISSIONS.AUDIT_WRITE), createAuditController({ createAudit }));