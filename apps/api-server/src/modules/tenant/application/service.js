import { buildTenant } from '../domain/tenant.js';

export const currentTenantService = ({ repository }) => ({ tenantId }) => repository.findByKey(tenantId);

export const createTenantService = ({ repository }) => (input) => repository.create(buildTenant(input));