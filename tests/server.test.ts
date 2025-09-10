declare var require: any;
declare var process: any;
const http = require('http');
const assert = require('assert');
import server from '../src/server';

function request(port: number, method: string, path: string, data?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      port,
      method,
      path,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(options, (res: any) => {
      let body = '';
      res.on('data', (chunk: any) => (body += chunk));
      res.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : undefined);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function requestText(port: number, path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = { port, method: 'GET', path };
    const req = http.request(options, (res: any) => {
      let body = '';
      res.on('data', (chunk: any) => (body += chunk));
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const srv = server.listen(0);
  await new Promise((r) => srv.once('listening', r));
  const port = (srv.address() as any).port;

  const cust = await request(port, 'POST', '/api/customers', {
    name: 'Acme',
    kundennummer: 'K1',
  });
  assert.ok(cust.id);

  const order = await request(port, 'POST', '/api/orders', {
    customerId: cust.id,
  });
  assert.strictEqual(order.status, 'Neu');

  await request(port, 'PATCH', `/api/orders/${order.id}`, { status: 'In_Arbeit' });

  const logs = await request(port, 'GET', `/api/orders/${order.id}/logs`);
  assert.strictEqual(logs.length, 1);
  assert.strictEqual(logs[0].to, 'In_Arbeit');

  await request(port, 'POST', '/api/orders', { customerId: cust.id });
  const filtered = await request(port, 'GET', '/api/orders?status=In_Arbeit');
  assert.strictEqual(filtered.length, 1);

  const drawing = await request(port, 'POST', '/api/drawings', {
    lines: [{ points: [0, 0, 10, 10] }],
  });
  assert.ok(drawing.id);

  const fetched = await request(port, 'GET', `/api/drawings/${drawing.id}`);
  assert.strictEqual(fetched.lines.length, 1);

  const page = await requestText(port, '/draw');
  assert.ok(page.includes('<canvas'));

  srv.close();
  console.log('server tests passed');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
