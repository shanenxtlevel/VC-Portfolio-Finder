// Serves the company data (pre-compressed) to people who are allowed in.
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { isAuthed, json } from './_lib/auth.js';

let cached;
const load = () => cached || (cached = readFileSync(new URL('../data/companies.json.gz', import.meta.url)));

export default function handler(req, res) {
  if (!isAuthed(req)) return json(res, 401, { error: 'Passcode needed.' });
  const gz = load();
  const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.setHeader('Vary', 'Accept-Encoding, Cookie');
  if (acceptsGzip) { res.setHeader('Content-Encoding', 'gzip'); res.end(gz); }
  else res.end(gunzipSync(gz));
}
