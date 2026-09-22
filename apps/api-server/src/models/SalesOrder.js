import mongoose from 'mongoose';

const salesOrderLineSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    sku: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    quantity: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
    unitPrice: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
    taxRate: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0, default: 0 }
  },
  { _id: false }
);

const salesOrderSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true, immutable: true },
    orderNumber: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    companyId: { type: String, required: true },
    branchId: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'cancelled'],
      default: 'draft'
    },
    currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
    lines: { type: [salesOrderLineSchema], required: true, validate: [(lines) => lines.length > 0, 'At least one line is required'] },
    idempotencyKey: { type: String, required: true, trim: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true }
  },
  { timestamps: true, versionKey: 'version' }
);

salesOrderSchema.index({ tenantId: 1, orderNumber: 1 }, { unique: true });
salesOrderSchema.index({ tenantId: 1, idempotencyKey: 1 }, { unique: true });

salesOrderSchema.statics.createTransactional = async function createTransactional(payload, work) {
  const session = await this.db.startSession();
  try {
    let createdOrder;
    await session.withTransaction(async () => {
      [createdOrder] = await this.create([payload], { session });
      if (work) await work({ order: createdOrder, session });
    });
    return createdOrder;
  } finally {
    await session.endSession();
  }
};

export const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);
