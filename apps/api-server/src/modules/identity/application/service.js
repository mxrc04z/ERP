import { buildIdentity } from '../domain/identity.js';

export const listIdentitiesService = ({ repository }) => ({ tenantId, userId }) => repository.findByUser({ tenantId, userId });

export const createIdentityService = ({ repository }) => (input) => repository.create(buildIdentity(input));