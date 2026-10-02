import test from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const load = async () => import('../api/_lib/auth.js?' + Math.random());

test('open when no passcode is set', async () => {
  delete process.env.FINDER_PASSCODE;
  const a = await load();
  assert.equal(a.isLocked(), false);
  assert.equal(a.isAuthed({ headers: {} }), true);
});

test('locked when a passcode is set; cookie unlocks', async () => {
  process.env.FINDER_PASSCODE = 'test-only-passcode';
  const a = await load();
  assert.equal(a.isLocked(), true);
  assert.equal(a.isAuthed({ headers: {} }), false);
  assert.equal(a.checkPasscode('wrong'), false);
  assert.equal(a.checkPasscode('test-only-passcode'), true);
  const cookie = a.sessionCookie().split(';')[0];
  assert.equal(a.isAuthed({ headers: { cookie } }), true);
  assert.equal(a.isAuthed({ headers: { cookie: 'vcf_s=nope' } }), false);
  delete process.env.FINDER_PASSCODE;
});

test('company data is valid and complete', () => {
  const d = JSON.parse(gunzipSync(readFileSync(new URL('../data/companies.json.gz', import.meta.url))));
  assert.ok(d.firms.length >= 24);
  assert.ok(d.rows.length > 10000);
  const slugs = new Set(d.firms.map(f => f.s));
  for (const r of d.rows) { assert.ok(r.n, 'row has a name'); for (const f of r.f) assert.ok(slugs.has(f), 'known firm ' + f); }
});
