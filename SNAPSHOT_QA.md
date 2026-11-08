# HairGlow public legal site — source recovery QA | 2026-11-08

**CURRENT DOMAIN STATUS: RESTORED, HTTP 200 on both official aliases after emergency rollback.** The historical outage below occurred during this automation's GitHub initialization. Do not read the historical 404 as the present state.


**Verified original source:** Production Vercel CLI deployment `dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB` (READY, source `cli`), deployed at `https://hairglow-camera-h7d1vt1d3-twappleons-projects.vercel.app`. All 10 sampled HTTP routes returned **200** from this immutable deployment: `/`, four privacy locales, support, CSS, robots, app-ads and policy JSON. The `vercel.json` security headers were read from the deployment source, not invented. Locale navigation 4/4, title/H1 4/4, root equals privacy HTML. Paths and evidence in `snapshot/PROVENANCE.json`.

**P0 domain routing discrepancy:** The two project aliases `hairglow-camera.vercel.app` and `hairglow-camera-twappleons-projects.vercel.app` both returned **404 NOT_FOUND** for `/privacy.html` at approximately 00:24 UTC 2026-11-08, while the immutable deployment-specific URL returned **200**. This may affect any App Store / Google Play privacy URL pointing to the alias. READY != reachable alias. No attempt to change DNS, domain assignments or live deployment. Recheck and diagnose routing before considering owner-approved repair.

This public GitHub repository was empty. Initial `main` README permits a reversible Draft PR, but **only public text content** has been captured into `snapshot/`. Binary icon and Khmer font/license, native app code, server APIs, and credentials are **NOT RECOVERED**. This is not a complete deployable app and legal-page statements are not verified against actual app behavior. The root privacy policy may be intentional, not a product defect.

Local static contract: `node --test tests/public-site-snapshot.test.mjs`. GitHub runner CI and device/browser playback remain NOT VERIFIED. No production deployment, external promotion, payment, deletion or data access occurred. Keep PR Draft; rollback = abandon branch. Source and domain issues are separate.

**Lesson:** Back up already-live CLI-generated legal pages with exact-route provenance before modifying them, and independently verify official aliases rather than inferring health from Vercel READY.

## Corrective incident note — verified rollback

A newly initialized GitHub `main` README commit `c6d55485b7dfd8d9b692fb9a30d537cbd225b2c9` **unexpectedly triggered Vercel Git production deployment** `dpl_DCQ5VwQv7a82Ag6GcJphg11VitVE`, containing no website entrypoint. Both public aliases then returned HTTP 404. This was a side effect of this automation's write, not an unexplained external outage. After verifying the previous CLI deployment's privacy page returned 200, an emergency **restorative rollback** to `dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB` was executed and independently verified. Both official domains then returned HTTP 200 for `/privacy.html`; Vercel alias API confirmed `deploymentId=dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB`.

**Permanent safety rule:** `hairglow-camera` is Git-linked despite initially being deployed by CLI. Do not edit `main`, merge this Draft PR, or allow any auto-production deployment before obtaining approval and auditing/controlling the Git production connection. This text-only snapshot intentionally remains in an unmerged recovery branch. See `INCIDENT_2026-11-08.md`.
