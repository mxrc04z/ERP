import mongoose from 'mongoose';

const auditEventSchema = new mongoose.Schema(
  { tenantId: { type: String, required: true, index: true }, actorId: { type: String, required: true }, action: { type: String, required: true }, resource: { type: String, required: true }, resourceId: String, metadata: { type: mongoose.Schema.Types.Mixed, default: {} } },
  { timestamps: true, versionKey: false }
);
auditEventSchema.index({ tenantId: 1, createdAt: -1 });
export const AuditEvent = mongoose.model('AuditEvent', auditEventSchema);