import { assertTransition, buildSalesOrder } from '../domain/salesOrder.js';

export const listSalesOrdersService = ({ repository }) => ({ tenantId }) => repository.findByTenant(tenantId);

export const getSalesOrderService = ({ repository }) => ({ tenantId, orderId }) => repository.findById({ tenantId, orderId });

export const createSalesOrderService = ({ repository }) => async (input) => {
  const existing = await repository.findByIdempotency({ tenantId: input.tenantId, idempotencyKey: input.idempotencyKey });
  if (existing) return existing;
  return repository.create(buildSalesOrder(input));
};

const transitionSalesOrder = (nextStatus) => ({ repository }) => async ({ tenantId, orderId, actorId }) => {
  const order = await repository.findById({ tenantId, orderId });
  if (!order) return null;
  assertTransition(order.status, nextStatus);
  return repository.updateStatus({ tenantId, orderId, status: nextStatus, actorId });
};

export const confirmSalesOrderService = transitionSalesOrder('confirmed');
export const cancelSalesOrderService = transitionSalesOrder('cancelled');