# Skill Router — Select Smallest Sufficient Capability Set
**Rule:** `AGENTS.md` + charter + role are ALWAYS loaded; then load skills by affected work. Do not blindly stuff every skill into a single context window.

| Work type / trigger | Responsible role | Required skills | Additional review |
|---|---|---|---|
| Project planning, assignments, reports | PD | `project-delivery`, `product-specification` | Product Owner |
| Functional PRD/screen coverage | PRODUCT | `product-specification`, `ux-flows` | UX/ARCH |
| Modules, API, event/version design | ARCH/BACK | `architecture-contracts`, `quality-evaluation` | Security |
| PostgreSQL migration, RLS, query performance | DBA | `database-engineering`, `privacy-security` | DB owner/SEC |
| Player/teacher UX flow and wireframes | UX | `ux-flows`, `design-tokens`, `ux-copy` | Brand/QA |
| KingDragonHub palette, typography, spacing | UX/UI | `design-tokens`, `react-frontend` | Brand/accessibility |
| Buttons, cards, icons, UI implementation | UI | `react-frontend`, `iconography`, `design-tokens` | UX/QA |
| Labels, error, onboarding, Vietnamese voice | COPY | `ux-copy`, `education-pedagogy` when school | Brand/Privacy |
| Banner, card illustrations, icon assets, images | IMAGE | `image-production`, `design-tokens`, `privacy-security` | Brand/rights |
| Tutorial, event promo, video clip and caption | VIDEO | `video-production`, `ux-copy`, `design-tokens` | QA/rights |
| Blockbench, GLB, rig, asset package | 3D | `blockbench-3d`, `avatar-wardrobe` | GAME/UX |
| Avatar outfit, hair, mascot, pet compatibility | 3D/GAME | `avatar-wardrobe`, `economy-inventory` | QA/safety |
| New game engine, rules, bot | GAME | `game-sdk`, `quality-evaluation` | ARCH/QA |
| Online rooms, reconnect, card private hand | BACK/GAME | `realtime-multiplayer`, `privacy-security` | QA |
| STEM assignment and rubrics | EDU | `education-pedagogy`, `ux-copy` | Teacher/Privacy |
| Blockly/code challenge and runner | EDU/BACK | `coding-arena`, `privacy-security` | SEC/QA |
| Item shop, ledger, trading | ECONOMY/DBA | `economy-inventory`, `database-engineering` | SEC/human |
| Event, leaderboard, Hall of Fame | LIVEOPS | `liveops-competition`, `economy-inventory` for reward | Referee/Privacy |
| Campaign scheduling and dynamic CMS | LIVEOPS | `cms-content-liveops`, `ux-copy` | Brand |
| MCP tool schemas, scopes, approvals | MCP | `mcp-automation`, `privacy-security`, `quality-evaluation` | SEC/human |
| CI/CD, cloud, DB/asset deploy | RELEASE | `devops-release`, `observability-incident` | QA/SEC |
| E2E, performance, evals, regression | QA | `quality-evaluation`, `observability-incident` | domain lead |
| Audit, child protection, abuse/malware | SEC | `privacy-security` | Human safety authority |

## Skill naming
Root is `.agents/skills/<skill-id>/SKILL.md`; every name in this document must exist. The registry `registry.json` also carries owner role, priority, trigger and review.

## Workflow invocation example
```yaml
task: "Implement game library filter"
role: BGU-UI
skills: [react-frontend, design-tokens, iconography, ux-copy, quality-evaluation]
inputs: [docs/design/MASTER_SCREEN_INVENTORY_V2.md, docs/design/tokens/kingdragonhub.tokens.json]
risk: R1
output: [feature-branch, component-spec, screenshots, e2e-test, PR]
approval: [BGU-UX, human-product-owner-if-global-brand-change]
```

## Re-evaluation
If work touches other domain (e.g. shop offers with Coin), add `database-engineering`, `economy-inventory`, `privacy-security`; do not proceed as UI-only change. Skill list evolves by reviewed PR and passing evaluations.
