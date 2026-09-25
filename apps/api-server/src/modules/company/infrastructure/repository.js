import { Company } from './model.js';

export function createCompanyRepository() {
  return {
    findByTenant: (tenantId) => Company.find({ tenantId }).sort({ name: 1 }).lean(),
    create: (data) => Company.create(data)
  };
}