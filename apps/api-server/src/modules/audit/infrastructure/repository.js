import { AuditEvent } from './model.js';

export function createAuditRepository() {
  return {
    findRecentByTenant: (tenantId) => AuditEvent.find({ tenantId }).sort({ createdAt: -1 }).limit(100).lean(),
    create: (data) => AuditEvent.create(data)
  };
}