import { Router } from 'express';
import { createRoleController, listRolesController } from './presentation/controller.js';
import { createRoleService, listRolesService } from './application/service.js';
import { createRoleRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const iamRouter = Router();

const repository = createRoleRepository();
const listRoles = listRolesService({ repository });
const createRole = createRoleService({ repository });

iamRouter.get('/roles', requirePermission(PERMISSIONS.ROLES_READ), listRolesController({ listRoles }));
iamRouter.post('/roles', requirePermission(PERMISSIONS.ROLES_WRITE), createRoleController({ createRole }));