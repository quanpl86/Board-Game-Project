# Agent Quality Gates — Definition of Ready, Done and Release
**Policy status:** Proposed. Applies to human and AI-authored changes.
**Scope:** code, data, game rules, visual, asset, content, workflow and production.

## DoR — before an Agent starts
- [ ] User outcome, task ID, product owner and intended release defined.
- [ ] Assigned executor role and independent reviewer named.
- [ ] Source refs: approved PRD/GDD, F01–F20, screen IDs, ADR/token/schema versions.
- [ ] Risks R0–R4, P0/P1/P2, tenant/age/rights and data classification reviewed.
- [ ] Deliverable, measurable acceptance, test plan, rollback and tool permissions.
- [ ] Any missing human decision marked BLOCKER (not silently guessed).

## QA gates
| Gate | Work type | Required evidence | Human stop/go |
|---|---|---|---|
| Q0 Scope | all | brief, source, acceptance/decision | Product Owner for scope |
| Q1 Domain | DB/API/game/economy | schema, invariant, typed contract, ADR | domain owner |
| Q2 Design | screens/assets/video/copy | KingDragonHub token, mobile/tablet/desktop preview, rights | Brand/UX |
| Q3 Tests | any implemented change | unit/contract/integration/e2e or visual QA, actual logs | QA |
| Q4 Security | auth/minors/commerce/MCP | threat model, permission denial, audit, secrets scan | Security/privacy |
| Q5 Review | PR | code/design diff, CODEOWNERS, CI green, release note | independent reviewer |
| Q6 Staging | deploy/data/assets | live test evidence, migration dry-run, health, rollback | Release Manager |
| Q7 Production | release / mass publish | signed release plan, rollback and communications | authorized human |
| Q8 Postrelease | production | D+1/D+7 metric, incidents, owner verification | Ops/Product |

## Specialized, measurable acceptance
### Database
Empty + existing-schema migration tests, FK/unique/index, RLS + API checks, query plan review, signed schema owner, restore evidence, no blind destructive migration. Shop ledger balances per currency = 0 and instances single owned.

### UI/UX
KingDragonHub token source or PROVISIONAL label; screen ID; 1440 desktop, 1024/768 tablet, 390 phone; state screens and keyboard/focus; WCAG 2.2 AA target; no unrelated neon base; no tiny caption; no redundant host header.

### Content text
Accurate Vietnamese grammar/diacritics, audience, CTA, non-manipulative language, correct numbers/timezone, no unverifiable claims or private data.

### Image
Brief, approved visual reference/style, correct ratio/dimensions, optimized deliverable and alt text; transparent only if verified; model/generator/provenance, rights and preview of actual UI crop.

### Video
Source storyboard + timing + script, actual render file exists/plays, 16:9 or 9:16 as asked, captions, audio rights, age-safe VFX and visual contrast; no fabricated export.

### 3D / rig
Editable Blockbench source, GLB, correct +Y/+Z and pivot, footprint, source rights, animations/compatibility, performance preview, immutable version/hash and fallback.

### Game logic
Deterministic validation, pinned versions, illegal-move and win/draw tests, replay hash exact, player-view private state safe.

### Education
Learning outcome mapped to verified rubric evidence; teacher review and private learner feedback; age-appropriate instructions.

### MCP / automation
OAuth audience+scope, tenant, risk approval bound to exact revision, idempotency, durable retries, audit, injection eval; no generic production SQL, no agent self-approval.

### CI/CD
Lockfile, build/tests/security, staging verification, rollback and real GitHub Actions run; no status inflation.

## Definition of Done reporting status
`DRAFT → IN_REVIEW → MERGED → STAGING_VERIFIED → PRODUCTION_RELEASED → POST_RELEASE_VERIFIED`
An authored doc/PR is **not** a running feature. If any required gate incomplete, report `INCOMPLETE` with evidence and owner.

## Defect severity
- S0 Critical: unauthorized minor data, incorrect wallet/ledger money-like balances, auth bypass, code sandbox escape, production destructive migration → immediate stop and human incident.
- S1 High: broken game result, corrupted match/replay, unsafe public chat, unusable accessibility at critical flow, failed CD rollback → release block.
- S2 Medium: responsive bug, translation issue, asset clipping, limited session reconnect issue → fix before relevant release or explicit waiver.
- S3 Low: polish, optional visual refinements, nonblocking copy → backlog with owner.

Waivers require named human, reason, risk, expiry and mitigation; agents cannot waive S0/S1.
