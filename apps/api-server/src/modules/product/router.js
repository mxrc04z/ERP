import { Router } from 'express';
import { createProductController, getProductController, listProductsController, updateProductController } from './presentation/controller.js';
import { createProductService, getProductService, listProductsService, updateProductService } from './application/service.js';
import { createProductRepository } from './infrastructure/repository.js';
import { requirePermission } from '../../middleware/authorization.js';
import { PERMISSIONS } from '../../middleware/permissions.js';

export const productRouter = Router();

const repository = createProductRepository();
const listProducts = listProductsService({ repository });
const getProduct = getProductService({ repository });
const createProduct = createProductService({ repository });
const updateProduct = updateProductService({ repository });

productRouter.get('/', requirePermission(PERMISSIONS.PRODUCTS_READ), listProductsController({ listProducts }));
productRouter.get('/:id', requirePermission(PERMISSIONS.PRODUCTS_READ), getProductController({ getProduct }));
productRouter.post('/', requirePermission(PERMISSIONS.PRODUCTS_WRITE), createProductController({ createProduct }));
productRouter.patch('/:id', requirePermission(PERMISSIONS.PRODUCTS_WRITE), updateProductController({ updateProduct }));