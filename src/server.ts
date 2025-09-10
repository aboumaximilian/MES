declare var module: any;
declare var require: any;
const http = require('http');
import { generateOrderNumber } from './orderNumber';
import { validateOrderInput } from './validation';

interface Order {
  id: string;
  customerId: string;
  status: string;
  createdAt: Date;
}

const orders: Order[] = [];

const server = http.createServer((req: any, res: any) => {
  if (req.url === '/api/orders' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orders));
  } else if (req.url === '/api/orders' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk: any) => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (!validateOrderInput(data)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'customerId required' } }));
          return;
        }
        const order: Order = {
          id: generateOrderNumber(),
          customerId: data.customerId,
          status: 'Neu',
          createdAt: new Date(),
        };
        orders.push(order);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(order));
      } catch (e) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ error: { code: 'INVALID_JSON', message: 'Request body must be JSON' } })
        );
      }
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

if (require.main === module) {
  server.listen(3000, () => console.log('Server running on http://localhost:3000'));
}

export default server;
