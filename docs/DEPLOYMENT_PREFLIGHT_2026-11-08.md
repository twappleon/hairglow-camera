# HairGlow recovery — fail-closed deployment preflight (2026-11-08)

## Why this exists
On 2026-11-08 the **GitHub main README initialization** unexpectedly launched a production Git deployment with no entrypoint and made both public privacy aliases return HTTP 404. A restorative Vercel rollback returned both aliases to HTTP 200 (see `INCIDENT_2026-11-08.md`). The unmerged recovery snapshot contains text-only files, **not** a deployable site.

## Verified source findings
- Read directly from this Draft PR's GitHub source: six HTML pages and `snapshot/style.css` link to `/icon.png` and `/khmer.ttf` (plus existing HTML/CSS).
- `snapshot/PROVENANCE.json` explicitly lists excluded `icon.png`, `khmer.ttf`, `OFL-Khmer.txt`, original native-app sources and private API.
- At the initial snapshot audit, **three asset/license files were missing**. The exact original `OFL-Khmer.txt` license was recovered later (see final checkpoint below); `icon.png` and `khmer.ttf` remain absent.
- On 2026-11-08 the two official privacy aliases and the production icon/font URLs were independently queried via Vercel: each returned **HTTP 200**, proving the **restored original deployment** is serving assets. This says nothing about the unmerged incomplete Git snapshot.
- Existing product and privacy claims are not independently checked against native mobile App behavior.

## New reversible preflight
- `node scripts/deployment-preflight.mjs`: checks required pages, route provenance, all local HTML/CSS file references, declared omitted assets/license and explicit-approval metadata. Returns nonzero when the supplied snapshot is incomplete.
- `node --test tests/deployment-preflight.test.mjs`: isolated fixture regression covering complete synthetic static package, missing icon/font, missing declared font-license file, missing Khmer privacy locale and missing explicit-approval gate.
- **Isolated local execution: 5/5 PASS, 0 FAIL** on Node 22.16.0. The exact Git blobs committed here were matched to the local-tested files (`scripts/deployment-preflight.mjs` blob `aab3efd21e903712b87a4be7c864a0286b98e1f8`, test blob `4c2a5167fd2f1f0a961010d13aefb32b1bbc69b7`).
- Real branch audit by source-file inventory: **BLOCKED** — missing `icon.png`, `khmer.ttf`, `OFL-Khmer.txt`. The full checker has **not** been run against all original GitHub snapshot bytes in one native runtime. This is not a claim of deployment-readiness.
- GitHub Actions Runner, browser runtime and App Store/Play Store validation remain NOT VERIFIED.

## Release safety / rollback
**DO NOT MERGE / DEPLOY.** This is not a production build gate automatically enforced by Vercel; a future deployment pipeline must explicitly run the preflight before production and then independently verify both official alias routes and their linked assets. Passing file completeness is **not** deployment authorization, legal license proof or mobile-app testing. Do not alter `main`, Git integration, production domain assignment or payment settings without approval.

All changes in this iteration are two new Node files plus this document on existing Draft PR #1; rollback = revert these branch-only commits or abandon Draft PR. No production service, source asset or server data was altered.

## Next valuable step
Recover the original asset bytes **with licensing evidence**, verify the actual mobile app's privacy practices, and obtain an owner-approved reproducible build workflow. Keep production on known-good deployment `dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB` until those gates pass.

## 2026-11-08 independent immutable-source reconciliation (new)
Recovered the file list of the **known-good immutable CLI Vercel deployment** `dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB` via its deployment source-tree API. Independently established that Vercel `uid` is a raw-file SHA-1 by decoding the **complete** `robots.txt` and `app-ads.txt` source responses and hashing their raw bytes. Re-read **all 11 existing GitHub snapshot text files** on the recovery branch and calculated SHA-1 of their UTF-8 bytes; **11/11 matched** their original deployment source-tree identifiers, including `vercel.json`, the full policy JSON, all locale HTML and the stylesheet. This is stronger evidence than route status alone; it does not assert that any mobile app implementation matches the privacy policy.

New files: `snapshot/ORIGIN_HASHES.json` pins **14** original public-source SHA-1 identifiers, `scripts/origin-lock.mjs` independently audits exact bytes, and `tests/origin-lock.test.mjs` adds positive/negative cases. `deployment-preflight.mjs` now **fails closed** on missing/mismatched source bytes even if all expected filenames exist. Synthetic fixture tests were updated to include origin checks. Native Node.js `node --test tests/{deployment-preflight,origin-lock}.test.mjs` ran **12/12 PASS** on local test fixtures, including modified HTML, substituted icon, truncated font, missing license, malicious extra entry, missing manifest, wrong deployment ID, and the original checks. All five resulting code/manifest files were **re-fetched from GitHub and independently matched by raw SHA-1 to the exact locally tested files**.

**Historical checkpoint (before upstream license recovery): 11/14 files verified, with three files absent.** As of the final checkpoint below the archive is **still BLOCKED** but 12/14 are byte-verified; only `icon.png` and `khmer.ttf` remain absent. The Vercel source-content connector truncates the large binary/base64 responses, and external container HTTP/DNS retrieval failed; do not write truncated, fabricated, or unlicensed assets to GitHub. The manifest preserves their original hashes so recovery can be independently verified if complete source bytes become available. Vercel UID uses SHA-1 and is an archival identity check, **not a modern collision-resistant security signature or proof of asset licensing**. A passing preflight is never permission to deploy, merge, update production aliases, or assert the Android/iOS app privacy claims.

No `main` writes, merge, Git production deploy, Vercel alias changes, payments or modifications to the actual deployed privacy site occurred. Existing Draft PR is still **DO NOT MERGE / DO NOT DEPLOY**. Run the real-archive preflight only in a complete reproducible checkout after source files are recovered; local tests above exercise synthetic fixtures, not a full restored deployment.

## 2026-11-08 incremental source recovery: Khmer license (12/14)

Found the exact upstream license at https://github.com/notofonts/khmer/blob/main/OFL.txt and checked its **raw-file SHA-1** against the immutable Vercel source-tree identifier for `OFL-Khmer.txt`: `dc631d7889d9480d9eb15285266fbe0a9e5d159d` (MATCH). Archived the full 4,381-character original text at `snapshot/OFL-Khmer.txt` in the existing Draft recovery branch; the upstream Git blob ID is `fddb7127172332edd0d0a0097ab3ad92ead7ba6b`. Recorded source attribution in `snapshot/PROVENANCE.json`. The repository license file was re-fetched at the new HEAD and matched against the immutable origin identifier; see final checkpoint below. The originally verified 11/14 text files remain unchanged, so the latest coverage is **12/14**.

**Still BLOCKED**: binary `icon.png` and `khmer.ttf` not recovered or byte-validated. No executable full archive preflight or mobile privacy review occurred in this incremental recovery. Do not manufacture or substitute the missing files merely to make a build pass, and do not merge, deploy, or alter production aliases. The verified OFL text alone cannot establish the missing font binary's legal provenance.

### Verified final checkpoint — 2026-11-08

Re-read the **14** paths from `snapshot/ORIGIN_HASHES.json` on recovery Draft PR #1 HEAD `d4093557fe016133448e6919d94217acc03bda29`, computed independent raw SHA-1 from every available GitHub source file and compared it with the original Vercel CLI deployment: **12 matches, 0 mismatches, exactly 2 missing (`icon.png`, `khmer.ttf`)**. The recovered `OFL-Khmer.txt` exactly matches original origin UID `dc631d7889d9480d9eb15285266fbe0a9e5d159d`; original upstream Git blob is `fddb7127172332edd0d0a0097ab3ad92ead7ba6b`. Verified Draft PR not merged and official HairGlow alias still targets known-good production deployment `dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB`. SHA-1 is used only for immutable source correspondence, not anti-tamper security. Full archive build and native app still NOT TESTED. **DO NOT MERGE / DEPLOY**.
