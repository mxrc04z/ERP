import { auditRouter } from './audit/router.js';
import { branchRouter } from './branch/router.js';
import { companyRouter } from './company/router.js';
import { iamRouter } from './iam/router.js';
import { identityRouter } from './identity/router.js';
import { tenantRouter } from './tenant/router.js';
import { usersRouter } from './users/router.js';

export function registerCoreModules(app) {
  app.use('/api/tenant', tenantRouter);
  app.use('/api/iam', iamRouter);
  app.use('/api/audit', auditRouter);
  app.use('/api/identity', identityRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/branches', branchRouter);
  app.use('/api/companies', companyRouter);
}