import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

// Immutable source deployment: use only to audit the restoration snapshot.
// Passing this audit does NOT authorize deployment or verify app privacy claims.
export const ORIGIN_DEPLOYMENT_ID = 'dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB';
export const ORIGIN_FILENAMES = Object.freeze([
  'index.html', 'privacy.html', 'privacy-zh-hans.html', 'privacy-zh-hant.html',
  'privacy-km.html', 'support.html', 'style.css', 'robots.txt', 'app-ads.txt',
  'policy-content.json', 'vercel.json', 'icon.png', 'khmer.ttf', 'OFL-Khmer.txt'
]);

export function auditOriginAssets(root) {
  const base = resolve(root);
  const problems = [];
  let manifest;
  try { manifest = JSON.parse(readFileSync(resolve(base, 'ORIGIN_HASHES.json'), 'utf8')); }
  catch { return { ok: false, matched: 0, expected: ORIGIN_FILENAMES.length,
    problems: ['missing or invalid ORIGIN_HASHES.json'] }; }
  if (manifest?.deploymentId !== ORIGIN_DEPLOYMENT_ID) problems.push('wrong immutable source deployment');
  if (manifest?.algorithm !== 'sha1') problems.push('unsupported source hash algorithm');
  const files = manifest?.files && typeof manifest.files === 'object' && !Array.isArray(manifest.files)
    ? manifest.files : {};
  let matched = 0;
  for (const name of ORIGIN_FILENAMES) {
    const expected = files[name];
    if (typeof expected !== 'string' || !/^[a-f0-9]{40}$/.test(expected)) {
      problems.push('missing/invalid expected SHA-1: ' + name);
      continue;
    }
    const file = resolve(base, name);
    if (!existsSync(file)) {
      problems.push('missing immutable source file: ' + name);
      continue;
    }
    const actual = createHash('sha1').update(readFileSync(file)).digest('hex');
    if (actual !== expected) problems.push('immutable source mismatch: ' + name);
    else matched++;
  }
  for (const name of Object.keys(files)) {
    if (!ORIGIN_FILENAMES.includes(name)) problems.push('unexpected source hash entry: ' + name);
  }
  return { ok: problems.length === 0, matched, expected: ORIGIN_FILENAMES.length,
    problems: [...new Set(problems)].sort() };
}
