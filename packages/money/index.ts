export type DecimalLike = string | number | { toString(): string };

export interface Money {
  amount: string;
  currency: string;
}

export function decimalToString(value: DecimalLike): string {
  const result = typeof value === 'number' ? String(value) : value.toString();
  if (!/^-?\d+(\.\d+)?$/.test(result)) throw new Error(`Invalid decimal value: ${result}`);
  return result;
}

export function money(amount: DecimalLike, currency: string): Money {
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('Currency must be an ISO 4217 code');
  return { amount: decimalToString(amount), currency };
}

export function addMoney(left: Money, right: Money): Money {
  if (left.currency !== right.currency) throw new Error('Cannot add different currencies');
  const [leftWhole, leftFraction = ''] = left.amount.split('.');
  const [rightWhole, rightFraction = ''] = right.amount.split('.');
  const scale = Math.max(leftFraction.length, rightFraction.length);
  const leftScaled = BigInt(`${leftWhole}${leftFraction.padEnd(scale, '0')}`);
  const rightScaled = BigInt(`${rightWhole}${rightFraction.padEnd(scale, '0')}`);
  const total = (leftScaled + rightScaled).toString().padStart(scale + 1, '0');
  const amount = scale === 0 ? total : `${total.slice(0, -scale)}.${total.slice(-scale)}`;
  return money(amount, left.currency);
}