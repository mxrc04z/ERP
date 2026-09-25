import { Router } from 'express';
import { authController } from './presentation/controller.js';
import { createAuthService } from './application/service.js';
import { createAuthRepository } from './infrastructure/repository.js';
import { requireAuth, signAccessToken } from '../../middleware/auth.js';
import { recordAuditEvent } from '../../middleware/audit.js';

export const authRouter = Router();

const repository = createAuthRepository();
const auth = createAuthService({ repository, signAccessToken, recordAuditEvent });

const login = authController({ operation: 'login', service: auth });
const logout = authController({ operation: 'logout', service: auth });
const me = authController({ operation: 'me', service: auth });
const register = authController({ operation: 'register', service: auth });

authRouter.post('/login', login);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/me', requireAuth, me);
authRouter.post('/register', register);