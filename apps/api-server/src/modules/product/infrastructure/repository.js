import { Product } from './model.js';

export function createProductRepository() {
  return {
    findByTenant: (tenantId) => Product.find({ tenantId }).sort({ sku: 1 }).lean(),
    findById: ({ tenantId, productId }) => Product.findOne({ _id: productId, tenantId }).lean(),
    create: (data) => Product.create(data),
    update: ({ tenantId, productId, data }) => Product.findOneAndUpdate({ _id: productId, tenantId }, { $set: data }, { new: true, runValidators: true }).lean()
  };
}