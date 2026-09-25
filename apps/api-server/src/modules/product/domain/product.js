export function buildProduct({ tenantId, sku, barcode, name, description, attributes = {}, stockByWarehouse = [], actorId }) {
  if (!tenantId || !sku || !name || typeof name !== 'string' || !name.trim()) {
    throw Object.assign(new Error('Tenant, SKU and product name are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  if (!actorId) throw Object.assign(new Error('Actor context is required.'), { code: 'ACTOR_CONTEXT_REQUIRED', statusCode: 400, expose: true });
  return { tenantId, sku: sku.trim().toUpperCase(), barcode: barcode?.trim(), name: name.trim(), description: description?.trim(), attributes, stockByWarehouse, active: true, createdBy: actorId, updatedBy: actorId };
}

export function buildProductUpdate({ name, barcode, description, attributes, active, actorId }) {
  if (!actorId) throw Object.assign(new Error('Actor context is required.'), { code: 'ACTOR_CONTEXT_REQUIRED', statusCode: 400, expose: true });
  const update = { updatedBy: actorId };
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) throw Object.assign(new Error('Product name cannot be empty.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
    update.name = name.trim();
  }
  if (barcode !== undefined) update.barcode = barcode?.trim();
  if (description !== undefined) update.description = description?.trim();
  if (attributes !== undefined) update.attributes = attributes;
  if (active !== undefined) update.active = Boolean(active);
  return update;
}