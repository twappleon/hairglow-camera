import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const base=resolve(dirname(fileURLToPath(import.meta.url)), "../snapshot");
const read=(name)=>readFileSync(resolve(base,name),"utf8");
const locales=["privacy.html","privacy-zh-hans.html","privacy-zh-hant.html","privacy-km.html"];
test("English privacy is intentionally the recovered root page",()=>assert.equal(read("index.html"),read("privacy.html")));
test("four privacy pages have H1, title and complete language navigation",()=>{
  for(const page of locales){const h=read(page);assert.match(h,new RegExp('<title>[^<]+</title>','i'));assert.match(h,new RegExp('<h1>[^<]+</h1>','i'));for(const p of locales)assert.ok(h.includes("/"+p),page+" missing "+p);}
});
test("support, styling and provenance are present",()=>{
  assert.match(read("support.html"),/<h1>Support/);assert.ok(read("style.css").length>100);
  const p=JSON.parse(read("PROVENANCE.json"));assert.equal(p.productionDeployed,false);assert.equal(p.routes.length,10);
  assert.equal(p.aliasesHTTPStatusDuringAudit,404);
  assert.ok(p.excludedBinaryAndPrivate.includes("khmer.ttf"));
});
test("CLI security response headers are saved",()=>{
  const cfg=JSON.parse(read("vercel.json"));assert.ok(cfg.headers.some(item=>item.headers?.some(h=>h.key==="X-Content-Type-Options")));
});
