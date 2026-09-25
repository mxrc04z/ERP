import { buildAuditEvent } from '../domain/audit.js';

export const listAuditService = ({ repository }) => ({ tenantId }) => repository.findRecentByTenant(tenantId);

export const createAuditService = ({ repository }) => (input) => repository.create(buildAuditEvent(input));