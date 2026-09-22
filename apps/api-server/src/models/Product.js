import mongoose from 'mongoose';

const warehouseStockSchema = new mongoose.Schema(
  {
    warehouseId: { type: String, required: true, trim: true },
    quantity: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0, default: 0 },
    reservedQuantity: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0, default: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true, immutable: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    barcode: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    attributes: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    stockByWarehouse: { type: [warehouseStockSchema], default: [] },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true }
  },
  { timestamps: true, versionKey: 'version' }
);

productSchema.index({ tenantId: 1, sku: 1 }, { unique: true });
productSchema.index({ tenantId: 1, barcode: 1 }, { unique: true, sparse: true });

export const Product = mongoose.model('Product', productSchema);
