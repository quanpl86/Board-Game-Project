# MCP & AI Agent Tools — Economy, Avatar, Rankings, Hall of Fame
**Status:** Proposed API/tool contract, not deployed | **Security:** no direct DB/ledger writes from MCP.

## 1. Architectural policy
AI Agent operates through versioned application services, scoped OAuth principal, tenant and audience/age policy. Multi-step workflow durable through Automation Engine, not held as one long MCP connection. All changing tools need idempotency key, expected revision, task/run correlation and audit. Approval is bound to exact draft revision and cannot be reused for a modified item.

## 2. Read-only tools (low-risk, permission checked)
| Tool | Capability |
|---|---|
| `catalog.items.search` | list public/restricted scoped item definitions and compatible rig versions |
| `catalog.item.get` | get item description, thumbnail, slots, licensing and review status |
| `avatars.compatibility.check` | inspect rig/body/slot conflicts and animation compatibility |
| `assets.item_preview.get` | inspect authorized 2D/3D staging preview artifact |
| `shop.offers.list` | current public/staging offers, dates, stock and eligible audience |
| `economy.aggregate_report.get` | aggregated earn/spend, failed orders and anomalies (no personal student wallets) |
| `rankings.boards.list` | permitted ranking boards, scopes and metric policies |
| `rankings.standings.preview` | staging/aggregated leaderboard preview with privacy filters |
| `honors.entries.list` | approved Hall of Fame publications |
| `marketplace.moderation_queue.list` | authorized limited listing flags, never unrestricted personal data |

## 3. Draft/mutation tools (distinct scopes)
| Tool | State change | Gate |
|---|---|---|
| `catalog.item.draft_create` | staged item definition/variant | scoped content editor, schema validation |
| `catalog.item.draft_update` | revision with expected version | editor scope, re-review after change |
| `avatars.asset_validation.request` | enqueue Blockbench/GLB fit & render tests | job quotas and asset rights |
| `shop.offer.draft_create` | draft price/stock/audience | no listing before approval |
| `shop.offer.preview` | screenshot/stock simulation | no monetary movement |
| `shop.offer.submit_review` | request human review | needs item provenance/license checks |
| `shop.offer.publish_approved` | approved offer publication | publisher role, immutable revision, dual control where needed |
| `honors.nomination.create` | propose recognition from verified result | evidence-backed, no public output |
| `honors.nomination.submit_review` | approval queue | human review, minor visibility consent |
| `rankings.policy.simulate` | dry run ranking calculation | no changes to official scores |
| `rankings.policy.draft_create` | staged ranking metric policy | tournament/ranking admin review |
| `marketplace.listing.flag` | case report | moderator scope and audit |
| `marketplace.listing.suspend` | suspend unsafe listing | authorized safety officer; audit, appeals |

## 4. Explicitly forbidden generic tools
No `wallet.balance.set`, `inventory.instance.mint_unchecked`, `trade.transfer_direct`, `ledger.entries.delete`, `score_records.override`, `honor.publish_without_review`, or `marketplace.enable_minors`. Approved administrative compensation flows must be specialized, evidence-backed, dual-control, rate-limited and logged.

## 5. Multi-agent workflow examples
### Seasonal collection
Brand Agent plans theme → Item Designer drafts avatar/item catalog → Blockbench Asset Agent produces permitted source + preview → Compatibility QA validates rig/glb/animations → Economy Agent proposes price/edition → Safety/License review → Content Manager approval → LiveOps scheduler publishes offer/hero, notifies via permitted audience. Agents cannot change approval snapshot afterward.

### Hall of Fame after tournament
Tournament result finalized → Ranking Worker projects standings → Honors Agent prepares evidence-based nomination and copy → organizer/referee validates results → child-safety policy filters public identity → human publication approval → CMS gallery rendered and eligible cosmetics minted by Rewards Service.

### Marketplace anomaly
Monitoring catches unusual rapid transfers/price changes → Agent summarizes aggregate/provenance evidence in restricted view → moderator reviews case → platform services freeze listing if authorized → human-led resolution/compensating transaction. AI cannot auto-seize items or adjust balances without gate.

## 6. Automation recipes
- Daily: inventory/shipping asset validation, order success rates, fraud indicator summaries.
- Weekly: campaign preview and shop offers expiring soon, ranking projection consistency.
- Monthly: curated seasonal collection and honor nominations.
- Per event: verified tournament standings → award proposals → approved trophy/frame grants.
Conditional notices only on actual threshold crossing, deduplicated and rate-limited.

## 7. Acceptance
Cross-tenant reads denied; agent cannot access minor wallets without explicit lawful authorization; tools cannot publish unapproved offer; retry draft submission deduplicated; revised draft invalidates prior approval; all production item issuance and score corrections are reconcilable; unauthorized direct balance mutation absent from tool inventory.
