import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  { tenantId: { type: String, required: true, index: true }, companyId: { type: String, required: true, index: true }, name: { type: String, required: true, trim: true }, code: { type: String, required: true, trim: true, uppercase: true }, address: { type: String, trim: true }, active: { type: Boolean, default: true }, createdBy: { type: String, required: true }, updatedBy: { type: String, required: true } },
  { timestamps: true, versionKey: 'version' }
);
branchSchema.index({ tenantId: 1, companyId: 1, code: 1 }, { unique: true });
export const Branch = mongoose.model('Branch', branchSchema);