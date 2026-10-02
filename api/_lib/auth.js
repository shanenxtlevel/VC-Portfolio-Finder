// Optional team passcode. If FINDER_PASSCODE is not set, the tool is open to anyone with the link.
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'vcf_s';
const passcode = () => (process.env.FINDER_PASSCODE || '').trim();

export const isLocked = () => passcode().length > 0;

const token = () => createHmac('sha256', passcode()).update('vc-portfolio-finder:session:v1').digest('hex');

function same(a, b) {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPasscode(input) {
  return isLocked() && same(String(input || '').trim(), passcode());
}

export function isAuthed(req) {
  if (!isLocked()) return true;
  const raw = req.headers.cookie || '';
  const hit = raw.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='));
  return !!hit && same(hit.slice(COOKIE.length + 1), token());
}

export function sessionCookie() {
  return `${COOKIE}=${token()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
