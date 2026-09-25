import { Identity } from './model.js';

export function createIdentityRepository() {
  return {
    findByUser: ({ tenantId, userId }) => Identity.find({ tenantId, userId }).lean(),
    create: (data) => Identity.create(data)
  };
}