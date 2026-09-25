import { Tenant } from './model.js';

export function createTenantRepository() {
  return {
    findByKey: (key) => Tenant.findOne({ key }).lean(),
    create: (data) => Tenant.create(data)
  };
}