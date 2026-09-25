import { Role } from './model.js';

export function createRoleRepository() {
  return {
    findByTenant: (tenantId) => Role.find({ tenantId }).sort({ name: 1 }).lean(),
    create: (data) => Role.create(data)
  };
}