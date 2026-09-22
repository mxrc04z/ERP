export interface WarehouseStockDto {
  warehouseId: string;
  quantity: string;
  reservedQuantity: string;
}

export interface ProductDto {
  id: string;
  tenantId: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  attributes: Record<string, unknown>;
  stockByWarehouse: WarehouseStockDto[];
  active: boolean;
}

export type SalesOrderStatus = 'draft' | 'confirmed' | 'cancelled';

export interface SalesOrderLineDto {
  productId: string;
  sku: string;
  description: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
}

export interface SalesOrderDto {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerId: string;
  companyId: string;
  branchId: string;
  status: SalesOrderStatus;
  currency: string;
  lines: SalesOrderLineDto[];
}

export interface UserDto {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  companyIds: string[];
  branchIds: string[];
}
