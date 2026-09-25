import { User } from './model.js';

export function createUserRepository() {
  return {
    findByTenant: (tenantId) => User.find({ tenantId }).sort({ displayName: 1 }).lean(),
    create: (data) => User.create(data)
  };
}