export const listSalesOrdersController = ({ listSalesOrders }) => async (request, response, next) => {
  try {
    return response.json({ data: await listSalesOrders({ tenantId: request.tenantId }), meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const getSalesOrderController = ({ getSalesOrder }) => async (request, response, next) => {
  try {
    const order = await getSalesOrder({ tenantId: request.tenantId, orderId: request.params.id });
    if (!order) return response.status(404).json({ code: 'SALES_ORDER_NOT_FOUND', message: 'Sales order not found.', traceId: request.id });
    return response.json({ data: order, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createSalesOrderController = ({ createSalesOrder }) => async (request, response, next) => {
  try {
    const order = await createSalesOrder({ ...request.body, tenantId: request.tenantId, actorId: request.auth?.userId ?? request.body.createdBy });
    return response.status(201).json({ data: order, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

const transitionController = (operation, service) => async (request, response, next) => {
  try {
    const order = await service({ tenantId: request.tenantId, orderId: request.params.id, actorId: request.auth?.userId ?? request.body.updatedBy ?? request.body.createdBy });
    if (!order) return response.status(404).json({ code: 'SALES_ORDER_NOT_FOUND', message: 'Sales order not found.', traceId: request.id });
    return response.json({ data: order, meta: { operation }, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const confirmSalesOrderController = ({ confirmSalesOrder }) => transitionController('confirm', confirmSalesOrder);
export const cancelSalesOrderController = ({ cancelSalesOrder }) => transitionController('cancel', cancelSalesOrder);