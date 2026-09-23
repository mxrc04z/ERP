import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  { tenantId: { type: String, required: true, index: true }, name: { type: String, required: true, trim: true }, taxId: { type: String, trim: true }, active: { type: Boolean, default: true }, createdBy: { type: String, required: true }, updatedBy: { type: String, required: true } },
  { timestamps: true, versionKey: 'version' }
);
companySchema.index({ tenantId: 1, name: 1 }, { unique: true });
export const Company = mongoose.model('Company', companySchema);