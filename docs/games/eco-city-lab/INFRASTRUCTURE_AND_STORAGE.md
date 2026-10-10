# Eco City Lab — Infrastructure & Storage
**Status:** Infrastructure proposal; no live service deployed.

## Recommended managed deployment
Next.js on Vercel; managed PostgreSQL/Auth via Supabase; 3D GLBs, textures, audio and media on Cloudflare R2 + custom-domain CDN; separate continuously-running Node/Colyseus game server on Railway; GitHub Actions for CI; logs/traces/Sentry + uptime monitoring.

## Storage categories
- Identity/classroom, cards/version metadata, game sessions/matches/score, world entities and snapshots: PostgreSQL, restricted by tenant and access policy.
- Live room presence and ephemeral messages: realtime server / optional Redis, never sole persistent source.
- Blockbench .bbmodel private versioned source: git-lfs or private source bucket.
- Optimized .glb and textures: immutable CDN object keys with hash/version in manifest.
- Secure artifacts and backups: separate restricted storage with restore tests.

## Reconnection / multiplayer
The client sends commands; server validates turn, permissions, budget, footprint and rules; persist verified action, update state, broadcast result; client animates model. Do not stream video/render per student; 3D renders locally.

## Reliability
Daily backups and separate restore copies per policy; retry/idempotent message processing; game autosave; restore tests; deployment staging; error monitoring; status and incident runbook.
For student data, avoid collecting unnecessary identifiers and validate applicable data protection requirements and cross-border processing before production.

## Cost & scaling
Begin with managed services and a single authoritative game server; load-test 30–90 then 100–300 concurrent clients; scale realtime separately from web and assets. Actual monthly cloud cost depends on usage and plan and should be rechecked before procurement. Redis, sharded/chunked worlds and worker scaling are optional until measured.
