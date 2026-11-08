# HairGlow public legal site — source recovery QA | 2026-11-08

**Verified original source:** Production Vercel CLI deployment `dpl_FFmkHu15g9VfF3AsQeJdc4mDfGYB` (READY, source `cli`), deployed at `https://hairglow-camera-h7d1vt1d3-twappleons-projects.vercel.app`. All 10 sampled HTTP routes returned **200** from this immutable deployment: `/`, four privacy locales, support, CSS, robots, app-ads and policy JSON. The `vercel.json` security headers were read from the deployment source, not invented. Locale navigation 4/4, title/H1 4/4, root equals privacy HTML. Paths and evidence in `snapshot/PROVENANCE.json`.

**P0 domain routing discrepancy:** The two project aliases `hairglow-camera.vercel.app` and `hairglow-camera-twappleons-projects.vercel.app` both returned **404 NOT_FOUND** for `/privacy.html` at approximately 00:24 UTC 2026-11-08, while the immutable deployment-specific URL returned **200**. This may affect any App Store / Google Play privacy URL pointing to the alias. READY != reachable alias. No attempt to change DNS, domain assignments or live deployment. Recheck and diagnose routing before considering owner-approved repair.

This public GitHub repository was empty. Initial `main` README permits a reversible Draft PR, but **only public text content** has been captured into `snapshot/`. Binary icon and Khmer font/license, native app code, server APIs, and credentials are **NOT RECOVERED**. This is not a complete deployable app and legal-page statements are not verified against actual app behavior. The root privacy policy may be intentional, not a product defect.

Local static contract: `node --test tests/public-site-snapshot.test.mjs`. GitHub runner CI and device/browser playback remain NOT VERIFIED. No production deployment, external promotion, payment, deletion or data access occurred. Keep PR Draft; rollback = abandon branch. Source and domain issues are separate.

**Lesson:** Back up already-live CLI-generated legal pages with exact-route provenance before modifying them, and independently verify official aliases rather than inferring health from Vercel READY.
