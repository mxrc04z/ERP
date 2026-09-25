import { SalesOrder } from './model.js';

export function createSalesOrderRepository() {
  return {
    findByTenant: (tenantId) => SalesOrder.find({ tenantId }).sort({ createdAt: -1 }).lean(),
    findById: ({ tenantId, orderId }) => SalesOrder.findOne({ _id: orderId, tenantId }).lean(),
    findByIdempotency: ({ tenantId, idempotencyKey }) => SalesOrder.findOne({ tenantId, idempotencyKey }).lean(),
    create: (data) => SalesOrder.create(data),
    updateStatus: ({ tenantId, orderId, status, actorId }) => SalesOrder.findOneAndUpdate({ _id: orderId, tenantId }, { $set: { status, updatedBy: actorId } }, { new: true, runValidators: true }).lean()
  };
}