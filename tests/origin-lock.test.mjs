import test from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { auditOriginAssets, ORIGIN_DEPLOYMENT_ID, ORIGIN_FILENAMES } from '../scripts/origin-lock.mjs';

function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'hairglow-origin-test-'));
  try {
    const files = {};
    for (const name of ORIGIN_FILENAMES) {
      writeFileSync(join(root, name), 'synthetic content for ' + name);
      files[name] = createHash('sha1').update(readFileSync(join(root, name))).digest('hex');
    }
    writeFileSync(join(root, 'ORIGIN_HASHES.json'), JSON.stringify({
      deploymentId: ORIGIN_DEPLOYMENT_ID, algorithm: 'sha1', files
    }));
    run(root);
  } finally { rmSync(root, { recursive: true, force: true }); }
}
test('exact fixture matches all source file hashes (synthetic only)', () => fixture(root => {
  const result = auditOriginAssets(root);
  assert.equal(result.ok, true, result.problems.join(', '));
  assert.equal(result.matched, ORIGIN_FILENAMES.length);
}));
test('modified HTML must not retain source identity', () => fixture(root => {
  writeFileSync(join(root, 'privacy-km.html'), 'tampered HTML');
  const result = auditOriginAssets(root);
  assert.equal(result.ok, false);
  assert.ok(result.problems.some(x => x.includes('privacy-km.html')));
}));
test('fake or truncated font must be rejected even when present', () => fixture(root => {
  writeFileSync(join(root, 'khmer.ttf'), 'truncated');
  const result = auditOriginAssets(root);
  assert.ok(result.problems.some(x => x.includes('khmer.ttf')));
}));
test('missing source icon blocks recovery', () => fixture(root => {
  unlinkSync(join(root, 'icon.png'));
  const result = auditOriginAssets(root);
  assert.ok(result.problems.some(x => x.includes('icon.png')));
}));
test('missing or untrusted manifest blocks recovery', () => fixture(root => {
  unlinkSync(join(root, 'ORIGIN_HASHES.json'));
  assert.equal(auditOriginAssets(root).ok, false);
}));
test('unexpected deployment or injected filename blocks recovery', () => fixture(root => {
  const path = join(root, 'ORIGIN_HASHES.json');
  const bad = JSON.parse(readFileSync(path, 'utf8'));
  bad.deploymentId = 'different';
  bad.files['../../elsewhere'] = 'a'.repeat(40);
  writeFileSync(path, JSON.stringify(bad));
  const r = auditOriginAssets(root);
  assert.equal(r.ok, false);
  assert.ok(r.problems.some(x => x.includes('wrong immutable source deployment')));
  assert.ok(r.problems.some(x => x.includes('unexpected source hash entry')));
}));
