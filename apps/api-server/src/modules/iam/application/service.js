import { buildRole } from '../domain/role.js';

export const listRolesService = ({ repository }) => ({ tenantId }) => repository.findByTenant(tenantId);

export const createRoleService = ({ repository }) => (input) => repository.create(buildRole(input));