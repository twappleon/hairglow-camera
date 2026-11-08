# HairGlow recovery — fail-closed deployment preflight (2026-11-08)

## Why this exists
On 2026-11-08 the **GitHub main README initialization** unexpectedly launched a production Git deployment with no entrypoint and made both public privacy aliases return HTTP 404. A restorative Vercel rollback returned both aliases to HTTP 200 (see `INCIDENT_2026-11-08.md`). The unmerged recovery snapshot contains text-only files, **not** a deployable site.

## Verified source findings
- Read directly from this Draft PR's GitHub source: six HTML pages and `snapshot/style.css` link to `/icon.png` and `/khmer.ttf` (plus existing HTML/CSS).
- `snapshot/PROVENANCE.json` explicitly lists excluded `icon.png`, `khmer.ttf`, `OFL-Khmer.txt`, original native-app sources and private API.
- The **current recovery branch does not contain these three asset/license files**. They must not be fabricated or copied without licensing verification.
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
