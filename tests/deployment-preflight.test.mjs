import test from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { mkdtempSync, rmSync, writeFileSync, unlinkSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inspectStaticSite } from '../scripts/deployment-preflight.mjs';

const pages = ['index.html', 'privacy.html', 'privacy-zh-hans.html',
  'privacy-zh-hant.html', 'privacy-km.html', 'support.html'];
const routes = ['/', '/privacy.html', '/privacy-zh-hans.html', '/privacy-zh-hant.html',
  '/privacy-km.html', '/support.html', '/style.css', '/robots.txt',
  '/app-ads.txt', '/policy-content.json'];
function fixture(callback) {
  const root = mkdtempSync(join(tmpdir(), 'hairglow-deploy-gate-'));
  try {
    for (const page of pages) writeFileSync(join(root, page),
      '<html><head><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/style.css"></head><body>HairGlow</body></html>');
    writeFileSync(join(root, 'style.css'), "@font-face{src:url('/khmer.ttf')}");
    for (const file of ['robots.txt', 'app-ads.txt', 'policy-content.json', 'icon.png', 'khmer.ttf', 'OFL-Khmer.txt']) writeFileSync(join(root, file), 'fixture-only');
    writeFileSync(join(root, 'PROVENANCE.json'), JSON.stringify({
      productionDeployed: false, requiresExplicitApprovalForDeployment: true,
      routes: routes.map(route => ({ route })),
      excludedBinaryAndPrivate: ['icon.png', 'khmer.ttf', 'OFL-Khmer.txt', 'native app source']
    }));
    callback(root);
  } finally { rmSync(root, { recursive: true, force: true }); }
}
test('complete fixture passes content/dependency readiness (not user authorization)', () => fixture(root => {
  const r = inspectStaticSite(root);
  assert.equal(r.deployable, true, r.problems.join(', '));
  assert.ok(r.referencedFiles.includes('khmer.ttf'));
}));
test('missing icon and font cannot pass static deployment gate', () => fixture(root => {
  unlinkSync(join(root, 'icon.png')); unlinkSync(join(root, 'khmer.ttf'));
  const r = inspectStaticSite(root);
  assert.equal(r.deployable, false);
  assert.ok(r.problems.some(x => x.includes('icon.png')));
  assert.ok(r.problems.some(x => x.includes('khmer.ttf')));
}));
test('missing declared font license blocks incomplete recovery', () => fixture(root => {
  unlinkSync(join(root, 'OFL-Khmer.txt'));
  const r = inspectStaticSite(root);
  assert.equal(r.deployable, false);
  assert.ok(r.problems.some(x => x.includes('OFL-Khmer.txt')));
}));
test('missing privacy locale blocks snapshot readiness', () => fixture(root => {
  unlinkSync(join(root, 'privacy-km.html'));
  const r = inspectStaticSite(root);
  assert.equal(r.deployable, false);
  assert.ok(r.problems.some(x => x.includes('privacy-km.html')));
}));
test('approval provenance is mandatory even when all assets exist', () => fixture(root => {
  const f = join(root, 'PROVENANCE.json');
  const value = JSON.parse(readFileSync(f, 'utf8'));
  value.requiresExplicitApprovalForDeployment = false;
  writeFileSync(f, JSON.stringify(value));
  const r = inspectStaticSite(root);
  assert.equal(r.deployable, false);
  assert.ok(r.problems.some(x => x.includes('explicit-deployment-approval')));
}));
