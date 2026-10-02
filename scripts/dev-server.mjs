// Runs the site on your own computer: static files from public/ plus the three API functions.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.svg': 'image/svg+xml' };
const api = { '/api/data': '../api/data.js', '/api/session': '../api/session.js', '/api/login': '../api/login.js' };

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  try {
    if (api[path]) { const mod = await import(api[path]); return await mod.default(req, res); }
    const rel = normalize(path === '/' ? '/index.html' : path).replace(/^(\.\.[/\\])+/, '');
    const body = await readFile(join(root, 'public', rel));
    res.writeHead(200, { 'Content-Type': types[extname(rel)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(e.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
    res.end(e.code === 'ENOENT' ? 'Not found' : 'Server error');
  }
}).listen(port, () => console.log(`VC Portfolio Finder running at http://localhost:${port}`));
