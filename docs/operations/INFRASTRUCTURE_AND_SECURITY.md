# Infrastructure, Operations & Security Baseline
**Status:** Design proposal; no production deployment.

## Architecture
Next.js UI/SSR, isolated authoritative multiplayer Node/Colyseus, modular API (NestJS/Fastify), PostgreSQL, optional Redis presence/cache, object storage R2 with CDN, background worker/scheduler, observability, secure code runner physically/logically separated from application API.
Managed MVP option: Vercel, Supabase, Railway and Cloudflare R2; compare with self-hosted Docker VPS only with documented security, backups and on-call.

## Environments
Local, staging, production; separate databases, secrets, OAuth apps, storage buckets and deployment permissions. Infrastructure as code when viable. Secrets in secure environment store, never Git.

## Release quality
Branch review, CODEOWNERS, lint/typecheck/tests, SQL migration review, API/SDK contract checks, SBOM/dependency audit, asset license scan, staging smoke tests, approval to production, rollback strategy.
GitHub Actions workflows must use least-privilege GITHUB_TOKEN and pin important third-party actions.

## Reliability & backup
Define RPO/RTO before pilot; managed DB daily backups + offsite restorable copy, verified restore drills, resilient world snapshots; queue dead-letter, idempotent workers; explicit database migration rollback/forward plan.

## Security
OAuth/OIDC or managed identity; scoped JWT and policy engine; multi-tenant boundaries; RLS where appropriate; MFA for admin; secrets rotation; WAF/rate limiting; abuse reports and moderation; audit trails and safe deletion.
Avoid open DM between strangers and minors. Protect academic evidence, chat, profiles and coding submissions. Privacy and cross-border transfer require legal review prior to storing identifiable student data on overseas services.

## Observability
Structured logs (no token/PII), OpenTelemetry tracing, game session latency, connected rooms/reconnect rate, WebGL asset loading, queue depth, moderation queues, code-judge isolation failures, nightly job results and certificate/storage health.

## Operations
Runbooks for expired OAuth, failed publish, broken game rule version, replay integrity, chat safety incident, failed GLB CDN, outage and restore. Ownership and on-call assigned per service.
