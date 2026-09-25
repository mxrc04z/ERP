import { Router } from 'express';
import { createUserController, listUsersController } from './presentation/controller.js';
import { createUserService, listUsersService } from './application/service.js';
import { createUserRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const usersRouter = Router();

const repository = createUserRepository();
const listUsers = listUsersService({ repository });
const createUser = createUserService({ repository });

usersRouter.get('/', requirePermission(PERMISSIONS.USERS_READ), listUsersController({ listUsers }));
usersRouter.post('/', requirePermission(PERMISSIONS.USERS_WRITE), createUserController({ createUser }));