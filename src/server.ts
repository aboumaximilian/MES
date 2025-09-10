declare var module: any;
declare var require: any;
const http = require('http');
const { parse } = require('url');
import { generateOrderNumber } from './orderNumber';
import { validateOrderInput, validateCustomerInput, validateOrderUpdate } from './validation';
import { Order, Customer, OrderStatus, OrderPriority } from './models';

interface AuditEntry {
  orderId: string;
  from: OrderStatus;
  to: OrderStatus;
  at: Date;
}

const orders: Order[] = [];
const customers: Customer[] = [];
const logs: AuditEntry[] = [];
let customerSeq = 1;

function readBody(req: any): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c: any) => (body += c));
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req: any, res: any) => {
  const { pathname, query } = parse(req.url || '', true);

  if (pathname === '/api/customers' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(customers));
    return;
  }
  if (pathname === '/api/customers' && req.method === 'POST') {
    const body = await readBody(req);
    try {
      const data = JSON.parse(body || '{}');
      if (!validateCustomerInput(data)) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'name and kundennummer required' } })
        );
        return;
      }
      const customer: Customer = {
        id: `CUST-${String(customerSeq++).padStart(4, '0')}`,
        name: data.name,
        kundennummer: data.kundennummer,
      };
      customers.push(customer);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(customer));
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: { code: 'INVALID_JSON', message: 'Request body must be JSON' } }));
    }
    return;
  }

  if (pathname === '/api/orders' && req.method === 'GET') {
    let result = orders;
    if (typeof (query as any).status === 'string') {
      result = result.filter((o) => o.status === (query as any).status);
    }
    if (typeof (query as any).customerId === 'string') {
      result = result.filter((o) => o.customerId === (query as any).customerId);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
    return;
  }
  if (pathname === '/api/orders' && req.method === 'POST') {
    const body = await readBody(req);
    try {
      const data = JSON.parse(body || '{}');
      if (!validateOrderInput(data)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'customerId required' } }));
        return;
      }
      if (!customers.find((c) => c.id === data.customerId)) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'customer not found' } }));
        return;
      }
      const order: Order = {
        id: generateOrderNumber(),
        customerId: data.customerId,
        status: 'Neu',
        prioritaet: (data.prioritaet || 'Normal') as OrderPriority,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      orders.push(order);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(order));
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: { code: 'INVALID_JSON', message: 'Request body must be JSON' } }));
    }
    return;
  }

  const orderMatch = pathname && pathname.match(/^\/api\/orders\/([^\/]+)$/);
  const logMatch = pathname && pathname.match(/^\/api\/orders\/([^\/]+)\/logs$/);

  if (orderMatch) {
    const orderId = orderMatch[1];
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      res.statusCode = 404;
      res.end();
      return;
    }
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(order));
      return;
    }
    if (req.method === 'PATCH') {
      const body = await readBody(req);
      try {
        const data = JSON.parse(body || '{}');
        if (!validateOrderUpdate(data)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'invalid status' } }));
          return;
        }
        if (data.status && data.status !== order.status) {
          const entry: AuditEntry = { orderId, from: order.status, to: data.status, at: new Date() };
          logs.push(entry);
          order.status = data.status;
          order.updatedAt = new Date();
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(order));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: { code: 'INVALID_JSON', message: 'Request body must be JSON' } }));
      }
      return;
    }
  }

  if (logMatch && req.method === 'GET') {
    const orderId = logMatch[1];
    const result = logs.filter((l) => l.orderId === orderId);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
    return;
  }

  res.statusCode = 404;
  res.end();
});

if (require.main === module) {
  server.listen(3000, () => console.log('Server running on http://localhost:3000'));
}

export default server;
