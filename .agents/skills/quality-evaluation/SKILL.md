---
name: quality-evaluation
description: Verify functional correctness, cross-browser/visual consistency, child privacy, security, game invariants, AI agent evals and release criteria with reproducible evidence.
version: 1.0.0
owner_role: BGU-QA
---

# Skill: quality-evaluation
**Purpose:** Verify functional correctness, cross-browser/visual consistency, child privacy, security, game invariants, AI agent evals and release criteria with reproducible evidence.

## Activate for
QA, testing, evaluation, E2E, accessibility, performance, regression, acceptance

## Read before acting
- `docs/agents/QUALITY_GATES.md`
- `docs/design/MASTER_SCREEN_INVENTORY_V2.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `docs/economy/DELIVERY_PLAN_AND_TESTS.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Translate task acceptance into test matrix: unit, property-based, integration, contract, Playwright browser, visual, device, performance, security, recovery and AI eval as relevant.
2. Build reproducible clean environment, fixture/setup/teardown and independent test data; use minimal child-safe synthetic records.
3. Exercise happy/error/permission/expiry/offline/reconnect/slow network/concurrency and locale variants.
4. UI: visual compare KingDragonHub screenshots/design tokens at 1440/1024/768/390, 200% zoom, screenreader/keyboard, contrast AA, reduced-motion and 3D fallback; flag absent high fidelity artifacts.
5. Game: deterministic seed, old version replay and illegal moves; economy: purchase idempotency, balanced ledger, race item/seat; MCP: safe role scopes, prompt injection, stale approval.
6. Report exact command, environment, observed vs expected, screenshot/log link, severity, reproduction, owner and fix verification; don't hide flaky failures.
7. Gate critical security/financial/child-safety failures as blockers; author cannot self-mark review passed; attach green CI/staging evidence to PR.

## Non-negotiable rules
- No fake test result or screenshot.
- Do not treat visual aesthetic review as substitute for keyboard or accessibility testing.
- Independent reviewer needed for high-risk changes.
- A planned QA checklist is not executed evidence.

## Required output artifacts
- Test plan & matrix
- Execution report and repro
- Screenshot/diff/metrics
- Go/no-go recommendation

## Validation / Definition of Done
- [ ] All P0 and safety-critical cases pass on real tested build
- [ ] No untriaged severity-1 or privacy issues
- [ ] Failed or untested cases plainly reported

## Handoff
Use `docs/agents/templates/HANDOFF.md`. Report confirmed artifacts, not intentions. Critical incidents and R3/R4 changes wait for authorized human gate.
