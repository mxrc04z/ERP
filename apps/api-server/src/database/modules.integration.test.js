import 'dotenv/config';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { connectDatabase } from './connection.js';
import { Product } from '../modules/product/infrastructure/model.js';
import { createProductRepository } from '../modules/product/infrastructure/repository.js';
import { SalesOrder } from '../modules/sales-order/infrastructure/model.js';
import { createSalesOrderRepository } from '../modules/sales-order/infrastructure/repository.js';
import { createSalesOrderService, confirmSalesOrderService } from '../modules/sales-order/application/service.js';

const hasMongoUri = Boolean(process.env.MONGODB_URI);
const skipWithoutDb = { skip: !hasMongoUri };
const productTenants = ['integration-product-a', 'integration-product-b'];
const salesTenant = 'integration-sales';

before(async () => {
  if (hasMongoUri) await connectDatabase();
});

after(async () => {
  if (!hasMongoUri) return;
  await Product.deleteMany({ tenantId: { $in: productTenants } });
  await SalesOrder.deleteMany({ tenantId: salesTenant });
  await mongoose.disconnect();
});

test('Product persiste Decimal128 y aísla registros por tenant', skipWithoutDb, async () => {
  await Product.deleteMany({ tenantId: { $in: productTenants } });
  await Product.create([
    { tenantId: productTenants[0], sku: 'SKU-001', name: 'Producto A', stockByWarehouse: [{ warehouseId: 'warehouse-1', quantity: '12.50', reservedQuantity: '2.50' }], createdBy: 'test', updatedBy: 'test' },
    { tenantId: productTenants[1], sku: 'SKU-001', name: 'Producto B', createdBy: 'test', updatedBy: 'test' }
  ]);

  const tenantAProducts = await Product.find({ tenantId: productTenants[0] }).lean();
  const tenantBProducts = await Product.find({ tenantId: productTenants[1] }).lean();

  assert.equal(tenantAProducts.length, 1);
  assert.equal(tenantBProducts.length, 1);
  assert.equal(tenantAProducts[0].stockByWarehouse[0].quantity.toString(), '12.50');
  assert.equal(tenantAProducts[0].sku, 'SKU-001');
});

test('SalesOrder respeta idempotencia y transiciones de estado', skipWithoutDb, async () => {
  await SalesOrder.deleteMany({ tenantId: salesTenant });
  const repository = createSalesOrderRepository();
  const createOrder = createSalesOrderService({ repository });
  const confirmOrder = confirmSalesOrderService({ repository });
  const input = {
    tenantId: salesTenant,
    orderNumber: 'SO-INT-001',
    customerId: new mongoose.Types.ObjectId(),
    companyId: 'company-1',
    branchId: 'branch-1',
    currency: 'mxn',
    idempotencyKey: 'integration-order-001',
    actorId: 'test',
    lines: [{ productId: new mongoose.Types.ObjectId(), sku: 'SKU-001', description: 'Producto', quantity: '2.00', unitPrice: '100.50', taxRate: '16.00' }]
  };

  const firstOrder = await createOrder(input);
  const repeatedOrder = await createOrder(input);
  assert.equal(repeatedOrder._id.toString(), firstOrder._id.toString());
  assert.equal(firstOrder.status, 'draft');
  assert.equal(firstOrder.lines[0].unitPrice.toString(), '100.50');

  const confirmedOrder = await confirmOrder({ tenantId: salesTenant, orderId: firstOrder._id.toString(), actorId: 'test' });
  assert.equal(confirmedOrder.status, 'confirmed');
  await assert.rejects(
    () => confirmOrder({ tenantId: salesTenant, orderId: firstOrder._id.toString(), actorId: 'test' }),
    { code: 'INVALID_ORDER_TRANSITION' }
  );
});