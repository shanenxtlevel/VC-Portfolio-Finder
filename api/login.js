// Checks the team passcode and sets the session cookie.
import { checkPasscode, isLocked, sessionCookie, json } from './_lib/auth.js';

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) { chunks.push(c); if (chunks.reduce((n, b) => n + b.length, 0) > 10_000) break; }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Use POST.' });
  if (!isLocked()) return json(res, 200, { ok: true });
  const body = await readBody(req);
  // Slow down guessing a little.
  await new Promise(r => setTimeout(r, 400));
  if (!checkPasscode(body.passcode)) return json(res, 401, { error: 'That passcode is not right.' });
  res.setHeader('Set-Cookie', sessionCookie());
  json(res, 200, { ok: true });
}
