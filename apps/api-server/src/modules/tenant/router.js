import { Router } from 'express';
import { currentTenantController, createTenantController } from './presentation/controller.js';
import { currentTenantService, createTenantService } from './application/service.js';
import { createTenantRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const tenantRouter = Router();

const repository = createTenantRepository();
const currentTenant = currentTenantService({ repository });
const createTenant = createTenantService({ repository });

tenantRouter.get('/current', requirePermission(PERMISSIONS.TENANT_READ), currentTenantController({ currentTenant }));
tenantRouter.post('/', requirePermission(PERMISSIONS.TENANT_WRITE), createTenantController({ createTenant }));