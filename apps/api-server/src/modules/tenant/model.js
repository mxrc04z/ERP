import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true, lowercase: true, unique: true },
    name: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

export const Tenant = mongoose.model('Tenant', tenantSchema);