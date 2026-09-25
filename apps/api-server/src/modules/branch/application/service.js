import { buildBranch } from '../domain/branch.js';

export const listBranchesService = ({ repository }) => ({ tenantId, companyId }) => repository.findByTenant({ tenantId, companyId });

export const createBranchService = ({ repository }) => (input) => repository.create(buildBranch(input));