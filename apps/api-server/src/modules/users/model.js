import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    roles: { type: [String], default: [] },
    permissions: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true }
  },
  { timestamps: true, versionKey: 'version' }
);
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
export const User = mongoose.model('User', userSchema);