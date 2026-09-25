export const listProductsController = ({ listProducts }) => async (request, response, next) => {
  try {
    return response.json({ data: await listProducts({ tenantId: request.tenantId }), meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const getProductController = ({ getProduct }) => async (request, response, next) => {
  try {
    const product = await getProduct({ tenantId: request.tenantId, productId: request.params.id });
    if (!product) return response.status(404).json({ code: 'PRODUCT_NOT_FOUND', message: 'Product not found.', traceId: request.id });
    return response.json({ data: product, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const createProductController = ({ createProduct }) => async (request, response, next) => {
  try {
    const product = await createProduct({ ...request.body, tenantId: request.tenantId, actorId: request.auth?.userId ?? request.body.createdBy });
    return response.status(201).json({ data: product, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};

export const updateProductController = ({ updateProduct }) => async (request, response, next) => {
  try {
    const product = await updateProduct({ ...request.body, tenantId: request.tenantId, productId: request.params.id, actorId: request.auth?.userId ?? request.body.updatedBy });
    if (!product) return response.status(404).json({ code: 'PRODUCT_NOT_FOUND', message: 'Product not found.', traceId: request.id });
    return response.json({ data: product, meta: {}, traceId: request.id });
  } catch (error) {
    return next(error);
  }
};