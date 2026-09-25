import { buildProduct, buildProductUpdate } from '../domain/product.js';

export const listProductsService = ({ repository }) => ({ tenantId }) => repository.findByTenant(tenantId);

export const getProductService = ({ repository }) => ({ tenantId, productId }) => repository.findById({ tenantId, productId });

export const createProductService = ({ repository }) => (input) => repository.create(buildProduct(input));

export const updateProductService = ({ repository }) => ({ tenantId, productId, ...input }) => repository.update({ tenantId, productId, data: buildProductUpdate(input) });