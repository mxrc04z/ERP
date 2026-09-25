import { buildUser } from '../domain/user.js';

export const listUsersService = ({ repository }) => ({ tenantId }) => repository.findByTenant(tenantId);

export const createUserService = ({ repository }) => (input) => repository.create(buildUser(input));