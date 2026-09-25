import { Router } from 'express';
import { createIdentityController, listIdentitiesController } from './presentation/controller.js';
import { createIdentityService, listIdentitiesService } from './application/service.js';
import { createIdentityRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const identityRouter = Router();

const repository = createIdentityRepository();
const listIdentities = listIdentitiesService({ repository });
const createIdentity = createIdentityService({ repository });

identityRouter.get('/:userId', requirePermission(PERMISSIONS.IDENTITY_READ), listIdentitiesController({ listIdentities }));
identityRouter.post('/', requirePermission(PERMISSIONS.IDENTITY_WRITE), createIdentityController({ createIdentity }));