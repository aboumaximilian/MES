declare var require: any;
const assert = require('assert');
import { generateOrderNumber } from '../src/orderNumber';

const first = generateOrderNumber(new Date('2024-01-01'));
const second = generateOrderNumber(new Date('2024-01-01'));
assert.strictEqual(first, 'ORD-2024-0001');
assert.strictEqual(second, 'ORD-2024-0002');

const newYearFirst = generateOrderNumber(new Date('2025-01-01'));
assert.strictEqual(newYearFirst, 'ORD-2025-0001');

console.log('orderNumber tests passed');
