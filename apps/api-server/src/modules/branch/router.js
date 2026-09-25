import { Router } from 'express';
import { createBranchController, listBranchesController } from './presentation/controller.js';
import { createBranchService, listBranchesService } from './application/service.js';
import { createBranchRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const branchRouter = Router();

const repository = createBranchRepository();
const listBranches = listBranchesService({ repository });
const createBranch = createBranchService({ repository });

branchRouter.get('/', requirePermission(PERMISSIONS.BRANCHES_READ), listBranchesController({ listBranches }));
branchRouter.post('/', requirePermission(PERMISSIONS.BRANCHES_WRITE), createBranchController({ createBranch }));