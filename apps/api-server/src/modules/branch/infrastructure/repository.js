import { Branch } from './model.js';

export function createBranchRepository() {
  return {
    findByTenant: ({ tenantId, companyId }) => {
      const filter = { tenantId };
      if (companyId) filter.companyId = companyId;
      return Branch.find(filter).sort({ name: 1 }).lean();
    },
    create: (data) => Branch.create(data)
  };
}