# Security Review Remediation — 2026-09-09

This documents the fixes applied against the security review completed
2026-09-02 (report: `kdr-tech-security-review.md`, sent to the site owner
directly — not committed here since it names the specific leaked secret
values). Organized by severity, matching the original report.

## 🔴 Critical — code fixed, but **you must still take manual action**

### 1. Supabase service-role key was committed to git
**Code fix (done):** [.env.local.example](.env.local.example) rewritten to contain only
placeholders. The file previously had a real, working `SUPABASE_SERVICE_ROLE_KEY`
pasted into it.

**Your action (not done — I have no Supabase dashboard access):**
1. Supabase Dashboard → Settings → API → **reset the `service_role` key now.**
   Treat the old one as permanently compromised — this repo is public, and
   public repos get scraped for exactly this pattern within minutes.
2. Put the new key only in Vercel's environment variables. Never in a
   committed file.
3. Consider purging the old key from git history (`git filter-repo` or BFG)
   and force-pushing — this is optional cleanup *after* rotation (rotation
   is what actually neutralizes the leak; history-purging just tidies up).
   I did not do this myself: it rewrites every commit hash and requires a
   force-push, which is destructive enough that it needs your explicit
   go-ahead, not an autonomous decision.

### 2. A real admin password was documented in a migration file
**Code fix (done):** [migrations/003_create_admin_user.sql](migrations/003_create_admin_user.sql)
rewritten to describe the setup *procedure* without embedding a real
email/password pair.

**Your action (not done):** rotate the `admin@kdrtech.com` password in
Supabase Dashboard → Authentication → Users regardless of whether it's
"still" the one in use, and enable MFA on that account if you haven't.

---

## 🟠 High — fixed

### 3. No security response headers
**Fixed:** [next.config.js](next.config.js) now sets CSP, `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
a stronger HSTS (`includeSubDomains; preload`), and disables `X-Powered-By`.

Verified live in a local build: `/admin/login` can no longer be framed,
headers are present on every response, and — after two iterations — the
CSP doesn't break the homepage's third-party client logos, direct-video
testimonials, or YouTube/Vimeo embeds (see the comment in `next.config.js`
for why `img-src`/`media-src` are intentionally broad: this admin CMS lets
an authenticated user enter arbitrary external URLs for those, so there's
no fixed domain list to allow — the directives actually protecting against
XSS/clickjacking here are `script-src`, `object-src`, `base-uri`, and
`frame-ancestors`).

### 4. Dependency CVEs
**Fixed:** `npm audit fix` applied — resolved 19 of 20 advisories
(brace-expansion ReDoS, `ws` memory disclosure/DoS, `sharp`/libvips CVEs,
`picomatch` ReDoS, etc.), all within existing semver ranges. `package-lock.json`
updated accordingly.

**Deliberately not fixed:** one remaining advisory (PostCSS XSS/arbitrary
file read, nested inside `next`'s own build tooling) only resolves via
`next@15 → 16`, a major version bump. I did not force this: it's a
build-time tool vulnerability with no exploitable runtime path in this app
(nothing here processes attacker-supplied CSS at runtime), and a Next.js
major bump is a breaking-change migration that deserves its own tested
pass — not something to bundle into a security patch on faith. Recommend
scheduling the Next 16 migration separately, then re-running `npm audit`.

---

## 🟡 Medium — fixed (except where noted)

### 5. Debug/test endpoints in production
**Fixed:** deleted `app/api/debug-env/route.ts` (unauthenticated env/platform
info disclosure) and `app/admin/login-test/page.tsx` (leftover debug login
form that console.log'd login attempts).

### 6. Single-item GET routes skipped the visibility filter their list endpoints apply
**Fixed** — added the same `.eq('status','published')` / `.eq('visible', true)`
filter (for unauthenticated requests) to all 8 affected routes:
[app/api/blog/[slug]/route.ts](<app/api/blog/[slug]/route.ts>),
[app/api/case-studies/[id]/route.ts](<app/api/case-studies/[id]/route.ts>),
[app/api/faqs/[id]/route.ts](<app/api/faqs/[id]/route.ts>),
[app/api/footer-links/[id]/route.ts](<app/api/footer-links/[id]/route.ts>),
[app/api/showcase/[id]/route.ts](<app/api/showcase/[id]/route.ts>),
[app/api/team/[id]/route.ts](<app/api/team/[id]/route.ts>),
[app/api/testimonials/text/[id]/route.ts](<app/api/testimonials/text/[id]/route.ts>),
[app/api/testimonials/video/[id]/route.ts](<app/api/testimonials/video/[id]/route.ts>).
This was already mitigated by RLS in practice; this is the defense-in-depth
backstop so a future RLS mistake doesn't become an immediate leak.

### 7. `site_settings` had no RLS policy at all
**Fixed (migration written, not yet applied):**
[migrations/014_site_settings_rls.sql](migrations/014_site_settings_rls.sql)
adds an explicit "public read, authenticated write" policy.

**Your action:** run this migration in the Supabase SQL Editor — I don't
have Supabase database access from this session (it requires OAuth
authorization you'd do via `claude mcp` or your claude.ai connector
settings). Current table contents are harmless either way; this just closes
the gap for anything added later.

### 8. SSRF in the documents "view" proxy
**Fixed:** [app/api/documents/[id]/view/route.ts](<app/api/documents/[id]/view/route.ts>)
now validates that `document.file_url`'s host matches your configured
Supabase project before fetching it server-side, instead of fetching
whatever URL is stored with no restriction.

### 9. Unrestricted file upload
**Fixed:** [app/admin/documents/page.tsx](app/admin/documents/page.tsx)'s dropzone now
enforces a 50MB max size (matching what the UI already claimed) and an
allow-list of file types (images, PDF, HTML, text/CSV/JSON, zip, Office
docs), with a visible error toast on rejection.

**Known limitation, not fully closed:** this is client-side (dropzone)
enforcement. A malicious actor with a valid authenticated session could
still call the Supabase Storage upload API directly, bypassing the
dropzone's checks. Real enforcement needs a bucket-level file-size limit
and allowed-MIME-types list set in Supabase Dashboard → Storage →
`documents` bucket → Edit bucket — a dashboard action I can't perform from
here.

### 10. No rate limiting
**Fixed (partial, documented limitation):** added a lightweight in-memory
rate limiter ([lib/rate-limit.ts](lib/rate-limit.ts)) to the public
`/api/leads` POST endpoint (5 submissions/IP/hour). This only protects a
single warm serverless instance — it resets on cold start and doesn't
share state across concurrent instances, so it's a real deterrent against
a naive scripted loop, not a hard guarantee. For robust protection, swap in
Upstash Redis (`@upstash/ratelimit` + `@upstash/redis`) — the file has a
comment marking exactly where.

**Not fixable from this codebase:** the admin login form calls
`supabase.auth.signInWithPassword` directly from the browser via the
Supabase SDK — that request goes straight to Supabase's own Auth API, not
through any of our Next.js routes, so there's no server-side code path
here to rate-limit. Brute-force protection for login has to be configured
in Supabase Dashboard → Authentication → Settings (enable CAPTCHA — hCaptcha
or Turnstile integration).

### 11. Missing middleware-level admin auth enforcement
**Fixed:** [middleware.ts](middleware.ts) and
[lib/supabase/middleware.ts](lib/supabase/middleware.ts) now redirect any
unauthenticated request to `/admin/*` (except `/admin/login`) to the login
page, as a backstop — previously, protection depended entirely on each
individual admin page and API route remembering to check auth itself
(which they all did, but with no single choke point). Verified live:
`/admin/tickets` and other admin pages now redirect cleanly to
`/admin/login` for a logged-out visitor, with no redirect loop.

### 12. Documents storage bucket is public, no signed URLs
**Fixed (2026-09-09), following you switching the `documents` bucket to
private in Supabase Dashboard.** Added
[lib/documents-storage.ts](lib/documents-storage.ts) with a shared helper
that extracts the bucket-relative path from the (now non-functional as a
direct URL) `file_url` value stored at upload time. Every place that reads
document content now mints a fresh short-lived signed URL server-side
instead of trusting `file_url` directly:

- [app/api/documents/[id]/view/route.ts](<app/api/documents/[id]/view/route.ts>) —
  HTML snippet preview proxy now signs its own fetch target. This also
  fully closes the SSRF concern from item 8 (previously mitigated by a
  host allow-list; now there's no client-influenced fetch target at all).
- [app/api/documents/[id]/signed-url/route.ts](<app/api/documents/[id]/signed-url/route.ts>) —
  new endpoint for non-HTML files (images, PDFs, etc.), since those are
  opened directly by the browser rather than proxied (proxying binary
  content through `.text()` would corrupt it).
- [app/api/documents/[id]/route.ts](<app/api/documents/[id]/route.ts>) (DELETE) —
  now uses the shared path-extraction helper instead of inline string
  splitting.
- [app/admin/documents/page.tsx](app/admin/documents/page.tsx) — "open in new
  tab" and the preview dialog both fetch a signed URL first (for non-HTML
  files) instead of linking `doc.file_url` directly, which would now 403.

Verified: `tsc`/build clean, and confirmed live that all three document
routes still correctly return 401 for unauthenticated requests (no
regression in the auth checks while rewiring the storage access).

### 13. No Privacy Policy
**Fixed:** added [app/(public)/privacy-policy/page.tsx](<app/(public)/privacy-policy/page.tsx>),
matching the style of the Terms/Refund/Shipping/Contact pages added
previously. Linked from the footer and referenced under the lead-capture
form ("By submitting, you agree to our Privacy Policy") in
[components/main/LeadMagnetSection.tsx](components/main/LeadMagnetSection.tsx).

### 14. Mass assignment on POST/PUT routes
**Not fixed — deliberately deferred.** Every write route spreads the
request body into `.insert()`/`.update()` with no schema validation. Given
there's no lower-privilege authenticated role to escalate from today (any
authenticated user is already treated as a full admin), the practical risk
is low, and adding Zod schemas to ~13 routes is a distinct, sizeable piece
of work I didn't want to rush through inside this remediation pass and
risk breaking working admin forms. `zod` is already a dependency —
flagging this as good follow-up work, not doing it speculatively tonight.

---

## Verification performed

- `tsc --noEmit` — clean, no type errors, after every batch of changes.
- `npm run build` — clean production build, no errors (only pre-existing
  ESLint warnings unrelated to this work).
- Live dev-server checks: unauthenticated `/admin` and `/admin/tickets`
  correctly redirect to `/admin/login` with no loop; `/admin/login-test`
  and `/api/debug-env` return nothing (removed); response headers on `/`
  confirmed to include CSP, X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy, and strengthened HSTS; zero CSP console violations
  after the `img-src`/`media-src`/`frame-src` correction; all homepage API
  calls (`/api/showcase`, `/api/settings`, `/api/case-studies`,
  `/api/testimonials/*`, `/api/faqs`) return 200.

## Still outstanding — action items for you

1. **Rotate the Supabase service-role key** (Critical, do this first).
2. **Rotate/verify the `admin@kdrtech.com` password**, enable MFA (Critical).
3. Run [migrations/014_site_settings_rls.sql](migrations/014_site_settings_rls.sql) in the Supabase SQL editor.
4. Enable CAPTCHA on Supabase Auth (login brute-force protection).
5. Set a file-size limit + allowed MIME types on the `documents` storage bucket.
6. ~~Decide on the `documents` bucket privacy + signed-URL migration~~ — done 2026-09-09 (bucket is now private, code updated to match, see item 12 above).
7. Enable GitHub secret scanning + push protection, and Dependabot, on the repo.
8. Schedule a deliberate Next.js 15→16 upgrade to close the last dependency advisory.
9. Optional: Zod validation on write routes; Sentry/error monitoring; git-history purge of the old leaked keys.
