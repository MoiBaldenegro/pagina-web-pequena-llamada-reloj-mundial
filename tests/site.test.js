import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
let server;
let base;

beforeAll(async () => {
  server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      const rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      const file = path.resolve(root, '.' + rel);
      if (file !== root && !file.startsWith(root + path.sep)) throw new Error('fuera');
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('no encontrado');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
});

describe('sitio', () => {
  it('sirve el HTML con las 4 ciudades en orden', async () => {
    const res = await fetch(`${base}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Reloj mundial');
    expect(html).toContain('lang="es"');
    const idx = ['Ciudad de México', 'Madrid', 'Tokio', 'Nueva York'].map((n) => html.indexOf(n));
    expect(idx.every((i) => i >= 0)).toBe(true);
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
  });

  it('sirve módulos JS y CSS', async () => {
    for (const p of ['/src/time.js', '/js/main.js']) {
      const r = await fetch(base + p);
      expect(r.status).toBe(200);
      expect(r.headers.get('content-type')).toContain('javascript');
    }
    expect((await fetch(`${base}/css/styles.css`)).status).toBe(200);
  });
});
