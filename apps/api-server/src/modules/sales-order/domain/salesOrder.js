const decimalPattern = /^\d+(\.\d+)?$/;

function requireDecimal(value, field, allowZero = false) {
  if (typeof value !== 'string' && typeof value !== 'number') throw Object.assign(new Error(`${field} must be a decimal value.`), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  const normalized = String(value);
  if (!decimalPattern.test(normalized) || (allowZero ? Number(normalized) < 0 : Number(normalized) <= 0)) throw Object.assign(new Error(`${field} must be ${allowZero ? 'zero or greater' : 'greater than zero'}.`), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  return normalized;
}

export function buildSalesOrder({ tenantId, orderNumber, customerId, companyId, branchId, currency, lines, idempotencyKey, actorId }) {
  if (!tenantId || !orderNumber || !customerId || !companyId || !branchId || !currency || !idempotencyKey || !actorId) {
    throw Object.assign(new Error('Tenant, order context, currency, idempotency key and actor are required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  }
  if (!Array.isArray(lines) || lines.length === 0) throw Object.assign(new Error('At least one order line is required.'), { code: 'VALIDATION_ERROR', statusCode: 400, expose: true });
  return {
    tenantId,
    orderNumber: String(orderNumber).trim(),
    customerId,
    companyId,
    branchId,
    currency: String(currency).toUpperCase(),
    lines: lines.map((line) => ({ ...line, quantity: requireDecimal(line.quantity, 'quantity'), unitPrice: requireDecimal(line.unitPrice, 'unitPrice'), taxRate: line.taxRate === undefined ? '0' : requireDecimal(line.taxRate, 'taxRate', true) })),
    idempotencyKey: String(idempotencyKey).trim(),
    status: 'draft',
    createdBy: actorId,
    updatedBy: actorId
  };
}

export function assertTransition(currentStatus, nextStatus) {
  const valid = (currentStatus === 'draft' && ['confirmed', 'cancelled'].includes(nextStatus));
  if (!valid) throw Object.assign(new Error(`Cannot transition order from ${currentStatus} to ${nextStatus}.`), { code: 'INVALID_ORDER_TRANSITION', statusCode: 409, expose: true });
}