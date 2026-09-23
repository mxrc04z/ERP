import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  { tenantId: { type: String, required: true, index: true }, name: { type: String, required: true, trim: true }, permissions: { type: [String], default: [] } },
  { timestamps: true }
);
roleSchema.index({ tenantId: 1, name: 1 }, { unique: true });
export const Role = mongoose.model('Role', roleSchema);