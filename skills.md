# web-standards-2026.md

## The 15 standards every production site must have

### 1. Core Web Vitals
LCP < 2.5s — Largest Contentful Paint: measures how fast the largest visible element loads (e.g., hero image, main text). Measured from first HTML byte until element is painted. Optimization: optimize images, preload critical assets, cache static files.

INP < 200ms — Interaction to Next Paint: measures delay from when user clicks/taps until page provides visual feedback. Replaced FID as of March 2024. Optimization: break large tasks into <50ms chunks, avoid long-running JS on main thread.

CLS < 0.1 — Cumulative Layout Shift: measures how much elements shift while page loads. Any shift >0.1 annoys users. Optimization: set width/height on images, reserve space for ads/dynamic content, don't inject content above existing content.

### 2. Semantic HTML
<nav> for navigation menus — screen readers announce it as "navigation region". If you use <div class="nav">, screen reader users won't know the menu is there.

<main> for primary content — only one per page. Screen readers jump directly to it when users press shortcut keys. <div id="main"> doesn't have this behavior.

<button> for clicks/submissions — has built-in keyboard support (Enter/Space), focus management, and is announced as a button. <div onclick> has none of these.

<article> for self-contained content (blog post, comment, product) — screen readers let users jump from article to article. <div class="post"> doesn't provide this.

General rule: If you're using <div> or <span> with a role attribute, there's probably a semantic tag that does the same job better.

### 3. Performance budget
JavaScript (compressed): ≤ 500 KB — measured after gzip/brotli. Every KB above means parse + compile + execute time. Exceeding this makes the site slow on mid-range phones.

CSS: ≤ 100 KB — after compression. Too much CSS means parse + style recalculation time. Optimization: remove unused CSS, code splitting, inline critical CSS.

Images (above the fold): ≤ 2 MB — with lazy loading for below-fold images. Any image over 200KB without lazy loading hurts LCP.

Third-party scripts (analytics, fonts, widgets): ≤ 300 KB — Google Fonts, Facebook Pixel, Intercom, etc. Every third-party is a black box that can kill performance. Use defer/async, or Partytown for heavy scripts.

Main thread blocking: ≤ 50 ms — any task (JS chunk) lasting over 50ms makes the page "stutter". Break large operations with setTimeout, requestIdleCallback, or Web Workers.

### 4. Security headers
CSP: Content-Security-Policy: "default-src 'self'" — allows only your own scripts, styles, images. Blocks inline styles/scripts (onclick, <style>), XSS, and loading from external sources. If you need externals, add e.g., script-src https://cdn.example.com.

X-Frame-Options: DENY — prevents your site from being embedded in other pages' iframes. Protects against clickjacking (attacks where user thinks they're clicking your button but click elsewhere).

X-Content-Type-Options: nosniff — prevents browser from guessing MIME type of a file. If you send a script with content-type text/plain, browser won't execute it. Protects against MIME confusion attacks.

Referrer-Policy: strict-origin-when-cross-origin — when user leaves your site, you send only the domain (e.g., https://site.com) without the full URL path. Sensitive paths don't leak (e.g., /admin/profile?token=123).

Permissions-Policy: geolocation=(), microphone=(), camera=() — completely disables access to geolocation, microphone, camera. Each API can be disabled individually. User never even sees the permission popup.

HSTS: Strict-Transport-Security: "max-age=31536000; includeSubDomains" — tells browser: "for one year, only use HTTPS, even if user types http://". includeSubDomains extends to all subdomains.

### 5. Error handling
Sentry/Bugsnag for errors: every exception, rejected promise, and HTTP 5xx error automatically goes to error tracking. Needs setup: DSN key in .env. Production without error tracking is blind.

ELK/Loki for logs: structured JSON logs only (e.g., {"level":"info","message":"user logged in","userId":123}). NOT string concatenation logs ("User 123 logged in"). JSON logs go into Elasticsearch/Loki and are easily searchable.

Prometheus for metrics: latency (how slow the API is), throughput (requests/sec), error rate (percentage of 5xx). Exported to Grafana dashboard.

Jaeger/Tempo for traces: p99 trace < 1s. Trace = one entire request passing through load balancer → API → DB → cache → response. If p99 >1s, something is slow. Traces show exactly which step is delayed.

### 6. API design
REST:
- GET: retrieval, idempotent (do it 100 times, same result), cacheable
- POST: creation, not idempotent
- PUT: full update (send entire object), idempotent
- PATCH: partial update (send only what changed)
- DELETE: deletion, idempotent

Status codes:
- 200 OK: all good (GET, PUT, PATCH, DELETE)
- 201 Created: resource created (POST), with Location header
- 400 Bad Request: bad input (e.g., missing field)
- 401 Unauthorized: no token or expired token
- 403 Forbidden: have token but no permission (e.g., user tried to delete admin)
- 404 Not Found: resource doesn't exist
- 422 Unprocessable Entity: correct format but logic error (e.g., email already exists)
- 500 Internal Server Error: client not at fault, server broke

Versioning: /api/v1/users → when you break the API (change response format or remove field), create /api/v2/users and keep v1 for old clients.

GraphQL:
- Pagination: cursors (base64 encoded pointers) instead of offset (offset means skip N rows, which becomes slow on large databases). Example: after: "cursor123".
- Query complexity: depth ≤ 5 (if query has 6 nested fields, reject). Max nodes ≤ 100 (total fields requested). Protects against DoS (someone requesting posts.posts.comments.user.profile.picture, etc.).
- Persisted queries: client sends hash, not full query string. Store queries server-side. Smaller payload, more secure.

### 7. Database
Every table REQUIRED:
- id UUID PRIMARY KEY DEFAULT gen_random_uuid() — not serial integers (predictable, vulnerable to IDOR attacks). UUID v4 is random.
- created_at TIMESTAMP DEFAULT NOW() — when row was created.
- updated_at TIMESTAMP DEFAULT NOW() — auto-updated via trigger (or application level).

Index on every query WHERE clause:
- If you run SELECT * FROM users WHERE email = 'x', you need index on email.
- If you JOIN ON users.id = orders.user_id, you need index on both columns.
- If you ORDER BY created_at, you need index on created_at.

N+1 queries forbidden:
- N+1 = fetch N posts (1 query), then for each post run 1 query for comments (total N+1). Solution: JOIN or batch loading (DataLoader).

Connection pool: min 5, max 20 per instance. Each query takes a connection from the pool. Without a pool, every query opens/closes a connection (slow). With pool max 20 and 30 replicas, total 600 DB connections.

### 8. Caching
Browser cache (Cache-Control): static assets (JS, CSS, images) → max-age=3600 (1 hour). Versioned URLs (main.a1b2c3.js) instead of main.js. When asset changes, hash changes → new URL → browser re-downloads.

CDN cache (CloudFlare/CloudFront): 1 day. CDN keeps copy of page (or image) on edge servers close to user. Invalidation: purge by path (e.g., /products/123) when product changes.

Application cache (Redis): 5 minutes. Store results of expensive queries (e.g., SELECT * FROM products WHERE category='electronics'). Write-through: when you write, write to cache too. 5 minute TTL means data is at most 5 minutes stale.

### 9. Testing pyramid
Unit tests (70%): test one function/component in isolation. Fast (ms), many. Mock all dependencies (DB, API, filesystem). Coverage: 80% of lines.

Integration tests (20%): test API ↔ DB ↔ cache communication. Use real DB (test container), not mocks. Slower than unit (seconds), fewer.

E2E tests (10%): test critical flows (login → add to cart → checkout). Run in real browser (Cypress/Playwright). Slow (minutes), few. Run only on staging, not on every commit.

### 10. CI/CD pipeline
1. Lint: ESLint (JavaScript errors), Prettier (formatting), TypeScript (type errors). If fails, stop.

2. Test: unit + integration (--runInBand to avoid parallel execution). Coverage threshold 80%.

3. Build: next build, vite build, docker build. Cache dependencies for speed.

4. Security: npm audit (vulnerabilities), Snyk (dependencies), Trivy (Docker image). If critical vulnerability found, stop.

5. E2E: staging environment only. User login, checkout flow, payment simulation.

6. Deploy: blue/green (two environments, switch traffic) or canary (5% traffic → monitor → 100%). No deployment without rollback plan (kubectl rollout undo).

### 11. Monitoring (RED method)
Rate: requests/sec at load balancer. If exceeds 30% capacity for 5 minutes, alert → scale up.

Errors: percentage of requests returning 5xx. If >1% for 2 minutes, alert → rollback or investigate.

Duration: p99 response time (99% of requests are faster than X). If p99 >500ms for 3 minutes, alert → optimize queries or scale.

### 12. Disaster recovery
Database backup: every 6 hours, automatic pg_dump or snapshot. Retention: 30 days (keep last 120 backups). RTO (Recovery Time Objective): 1 hour — from DB loss until running again. RPO (Recovery Point Objective): 15 minutes — lose at most 15 minutes of data (next backup).

File storage (S3, images, uploads): every 24 hours, replicate to another region. Retention: 90 days. RTO: 4 hours (restore from backup). RPO: 24 hours (lose one day of uploads).

Code (git): real-time backup (git is distributed). RTO: 10 minutes (git clone). RPO: 0 (no lost commits if push frequently).

Test backup monthly: restore from backup to staging and verify it works. If you haven't tested it, it's not a backup.

### 13. .env rules
ALWAYS .env.example in repo: contains all keys without values (API_KEY=your_key_here, DB_PASSWORD=changeme). New developer copies to .env and adds real values.

NEVER .env in git: add .env to .gitignore. If someone commits .env, rotate all secrets immediately (they're considered compromised).

Validation on startup: application must check that all required env vars exist. If anything missing, throw error and don't start.

Development/production separation: .env.development (local DB, mock APIs), .env.production (real values, secrets manager). In production, DO NOT read from .env file — use secrets manager.

JWT secret: at least 32 random characters (e.g., from openssl rand -base64 32). Don't use "secret", "12345", or company name.

### 14. Input validation & sanitization
Email validation regex: /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/ — then send email verification link. Never assume an email is "valid" without verification.

Greek mobile: ^69\d{8}$ (6912345678, 6945678901). 10 digits, starts with 69. Landline: ^21\d{9}$.

URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/ — http/https only, not javascript: or data:.

UUID v4: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.

HTML sanitization: NEVER use regex replace for XSS. Use DOMPurify (client) or dompurify (server with jsdom). Turns <script>alert(1)</script> into empty string, but keeps <b>text</b>.

SQL injection: 100% parameterized queries (prepared statements). NEVER: `SELECT * FROM users WHERE id = ${userId}`. ALWAYS: `SELECT * FROM users WHERE id = $1` with [userId] as parameter. Applies to PostgreSQL, MySQL (?, ?), SQLite.

Client-side + server-side validation REQUIRED both:
- Client-side (HTML pattern, JavaScript): UX (fast feedback)
- Server-side (regex, validation library): security (no one is required to send requests from your frontend)

### 15. Secrets rotation
Every 90 days: rotate all secrets (API keys, JWT secret, database passwords). Don't wait for a leak to happen.

Least privilege: your application has ONLY the permissions it needs. E.g., if it only reads from S3 bucket, it doesn't need write permission. If the app gets hacked, the attacker has only those permissions.

No secrets in logs: if .env has DB_PASSWORD, code does NOT console.log(process.env.DB_PASSWORD). No log should contain secrets. If you need to debug, write "DB_PASSWORD=***redacted***".

Secrets manager for production: AWS Secrets Manager, HashiCorp Vault, Doppler, or encrypted vault. .env file only for development. In production, app pulls secrets from manager at startup.

Audit log: every time a secret changes (rotation), log who changed it, when, and why. In case of leak, you know what happened.

## Forbidden (red flags)
- .env committed to git — immediate reject. Rotate all secrets and educate the developer who did it.
- console.log(process.env) or console.log(process.env.API_KEY) in production — can leak to log aggregators (ELK, Datadog) and be seen by everyone.
- SQL with ${variable} or string concatenation — even if you think it "doesn't come from user". Leads to SQL injection sooner or later.
- dangerouslySetInnerHTML without sanitize — equivalent to eval(). If you need to insert user HTML, sanitize ONLY with DOMPurify.
- input validation only on frontend (HTML pattern or JS) without backend validation — anyone can send raw HTTP requests without a browser.
- JWT secret "secret", "12345", "password" — cracks with dictionary attack in seconds.
- Magic numbers (e.g., if(status === 3)) — no context. Use const STATUS_ACTIVE = 3.
- TODO or FIXME without issue number — // TODO: fix this is only acceptable if issue #123 exists in tracker.
- any type in TypeScript — destroys all TS benefits. Use unknown and type guards.
- secrets in logs (anything containing password, token, key) — red flag even in development.

## Validation commands
npx lighthouse https://site.com --view — runs Core Web Vitals, Performance, Accessibility, SEO, Best Practices. Target >90 on all.

curl -I https://site.com | grep -i "content-security-policy" — checks if CSP header exists. If missing, site is vulnerable to XSS.

npm audit — checks for dependency vulnerabilities. If critical found, stop deployment.

kubectl rollout undo deployment/web — rollback to previous version. If you don't have a rollback plan, you don't deploy.
