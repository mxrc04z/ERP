import mongoose from 'mongoose';

const identitySchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    provider: { type: String, required: true },
    subject: { type: String, required: true },
    passwordHash: { type: String },
    isLocal: { type: Boolean, default: false }
  },
  { timestamps: true }
);
identitySchema.index({ tenantId: 1, provider: 1, subject: 1 }, { unique: true });
export const Identity = mongoose.model('Identity', identitySchema);