# HairGlow Camera — SAFE RECOVERY BRANCH (do not merge)

This repository previously had **no commits**; a small README was committed to `main` to create a recoverable Git history. **Important corrected finding:** although previous HairGlow production was a Vercel CLI upload, the Vercel project was already **Git-connected**, and that initial GitHub `main` commit unexpectedly triggered a README-only production deployment. Both official URLs returned 404. A restorative rollback to the verified prior CLI deployment restored both aliases to HTTP 200. Full incident evidence: [INCIDENT_2026-11-08.md](INCIDENT_2026-11-08.md).

This **unmerged Draft PR** contains an exact-response, text-only snapshot of the existing public privacy/support website. It does NOT contain binary assets, font/license, private API/server code, or the native mobile app. It is **not deployable** and must **never be merged to main or published** without separate approval, a complete build, and a verified domain rollback plan.

Available check: `node --test tests/public-site-snapshot.test.mjs` (Node 18+). The linked Vercel project should be treated as production-sensitive even when GitHub is otherwise empty. Static contracts checked from the committed files; Node runner and native devices remain unverified.
