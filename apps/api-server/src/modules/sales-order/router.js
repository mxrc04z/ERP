import { Router } from 'express';
import { cancelSalesOrderController, confirmSalesOrderController, createSalesOrderController, getSalesOrderController, listSalesOrdersController } from './presentation/controller.js';
import { cancelSalesOrderService, confirmSalesOrderService, createSalesOrderService, getSalesOrderService, listSalesOrdersService } from './application/service.js';
import { createSalesOrderRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const salesOrderRouter = Router();

const repository = createSalesOrderRepository();
const listSalesOrders = listSalesOrdersService({ repository });
const getSalesOrder = getSalesOrderService({ repository });
const createSalesOrder = createSalesOrderService({ repository });
const confirmSalesOrder = confirmSalesOrderService({ repository });
const cancelSalesOrder = cancelSalesOrderService({ repository });

salesOrderRouter.get('/', requirePermission(PERMISSIONS.SALES_ORDERS_READ), listSalesOrdersController({ listSalesOrders }));
salesOrderRouter.get('/:id', requirePermission(PERMISSIONS.SALES_ORDERS_READ), getSalesOrderController({ getSalesOrder }));
salesOrderRouter.post('/', requirePermission(PERMISSIONS.SALES_ORDERS_WRITE), createSalesOrderController({ createSalesOrder }));
salesOrderRouter.post('/:id/confirm', requirePermission(PERMISSIONS.SALES_ORDERS_WRITE), confirmSalesOrderController({ confirmSalesOrder }));
salesOrderRouter.post('/:id/cancel', requirePermission(PERMISSIONS.SALES_ORDERS_WRITE), cancelSalesOrderController({ cancelSalesOrder }));