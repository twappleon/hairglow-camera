import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { auditOriginAssets } from './origin-lock.mjs';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../snapshot');
const required = ['index.html', 'privacy.html', 'privacy-zh-hans.html', 'privacy-zh-hant.html', 'privacy-km.html', 'support.html', 'style.css', 'robots.txt', 'app-ads.txt', 'policy-content.json', 'PROVENANCE.json'];
export function inspectStaticSite(root = defaultRoot) {
  const base = resolve(root), problems = [];
  for (const name of required) if (!existsSync(resolve(base, name))) problems.push('missing required file: ' + name);
  if (problems.length) return { deployable: false, problems };
  let provenance;
  try { provenance = JSON.parse(readFileSync(resolve(base, 'PROVENANCE.json'), 'utf8')); }
  catch (e) { return { deployable: false, problems: ['invalid provenance: ' + e.message] }; }
  if (provenance.requiresExplicitApprovalForDeployment !== true) problems.push('missing explicit-deployment-approval gate');
  if (provenance.productionDeployed !== false) problems.push('snapshot must remain non-production');
  const routes = new Set((Array.isArray(provenance.routes) ? provenance.routes : []).map(x => x.route));
  for (const name of required.slice(0, -1)) {
    const route = name === 'index.html' ? '/' : '/' + name;
    if (!routes.has(route)) problems.push('route absent from provenance: ' + route);
  }
  const refs = new Set();
  for (const name of required.filter(x => /\.html$|\.css$/.test(x))) {
    const source = readFileSync(resolve(base, name), 'utf8');
    const urls = [...source.matchAll(/\b(?:src|href)\s*=\s*(['"])(.*?)\1/gi)].map(x => x[2]);
    urls.push(...[...source.matchAll(/\burl\(\s*['"]?([^'"\)]+)['"]?\s*\)/gi)].map(x => x[1].trim()));
    for (const url of urls) {
      if (!url.startsWith('/') || url.startsWith('//')) continue;
      let decoded;
      try { decoded = decodeURIComponent(url.split(/[?#]/)[0]); }
      catch { problems.push('malformed URL in ' + name); continue; }
      const dest = resolve(base, '.' + decoded), rel = relative(base, dest);
      if (isAbsolute(rel) || rel === '..' || rel.startsWith('..' + sep)) { problems.push('path escape in ' + name); continue; }
      refs.add(rel);
      if (!existsSync(dest)) problems.push('missing referenced asset: ' + rel);
    }
  }
  for (const name of Array.isArray(provenance.excludedBinaryAndPrivate) ? provenance.excludedBinaryAndPrivate : []) {
    if (/^[A-Za-z0-9_.-]+\.(png|jpe?g|webp|ttf|otf|woff2?|txt)$/i.test(name) && !existsSync(resolve(base, name))) problems.push('missing source asset/license: ' + name);
  }
  const origin = auditOriginAssets(base);
  problems.push(...origin.problems.map(problem => 'immutable origin: ' + problem));
  return { deployable: problems.length === 0, problems: [...new Set(problems)].sort(), referencedFiles: [...refs].sort(), originMatched: origin.matched, originExpected: origin.expected };
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const result = inspectStaticSite(process.argv[2] || defaultRoot);
  console.log(JSON.stringify(result, null, 2));
  if (!result.deployable) process.exitCode = 1;
}
