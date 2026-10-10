# Cross-Domain Commands, Events and Consistency V2
**Status:** Proposed API/event contract map, not implemented.
**Purpose:** Connect full application flows to stable service boundaries before schema or MCP tool contracts are frozen.

## 1. Core command/event convention
Commands are intent submitted by authenticated user/Agent/workflow with tenant context, explicit scope and idempotency/expected_revision. Services reject unauthorized or invalid commands. Within a transaction they persist the authoritative domain change and an outbox record. Events are **facts** emitted after committed transaction and are not instructions to mutate another aggregate directly.

Event envelope v1:
```json
{
  "event_id": "uuid",
  "event_type": "match.finalized.v1",
  "aggregate_type": "match",
  "aggregate_id": "uuid",
  "tenant_id": null,
  "correlation_id": "uuid",
  "causation_id": "uuid",
  "schema_version": 1,
  "occurred_at": "2026-10-10T09:00:00Z",
  "actor_type": "USER|SERVICE|AGENT",
  "actor_id": "uuid",
  "payload": { "match_id": "uuid", "result_id": "uuid" }
}
```
Payload intentionally minimizes PII. Consumer is at-least-once + idempotent; event version bump and consumer compatibility test required. Public rooms and child data projections must be filtered by policy.

## 2. Command → source aggregate → published event → consumers
| Flow | Command/service | Primary aggregate / transaction | Event(s) | Consumers / guards |
|---|---|---|---|---|
| F01 Identity | `RegisterOrLinkIdentity` | users + linked_identities unique provider+subject | `identity.linked.v1` | onboarding/policy; no duplicate account |
| F01 Tenant | `AcceptOrgInvitation` | scoped membership & invite | `membership.accepted.v1` | teacher/class; prevents orphan |
| F02 Game catalog | `PublishGameVersion` | immutable game_versions | `game.version_published.v1` | catalog/CDN/compatibility |
| F03 Room | `ReserveSeat`, `StartMatch` | room+seat lock, match pin | `room.started.v1` | realtime; unique active seat |
| F04 Gameplay | `SubmitMatchCommand` | match command seq + snapshot | `match.command_accepted.v1` | sanitized per-player view; no secret card leakage |
| F04 Finalization | `FinalizeMatch` | result + entries | `match.finalized.v1` | ranking/reward/evidence; one-time |
| F05 World | `CommitCityConstruction` | world revision+accepted match action | `world.changed.v1` | 3D rendering/science evidence |
| F06 Assignment | `SubmitLearningAttempt` | attempt version+learning evidence | `assignment.submitted.v1` | teacher assessment; no grade leak |
| F07 Teacher | `GradeWithRubric` | rubric revision + assessment | `assessment.finalized.v1` | student private feedback |
| F08 Social | `SendChannelMessage` | message+channel membership | `message.created.v1` | chat fanout/moderation; minor policy |
| F08 Report | `FileSafetyReport` | case+restricted evidence | `moderation.reported.v1` | safeguarding queue |
| F09 Event | `RegisterForEvent`, `CheckIn` | event capacity/waitlist+eligibility | `event.registered.v1` | registration notification |
| F10 Tournament | `FinalizeFixture` | fixture + verified result/referee | `fixture.finalized.v1` | ranking/fixture progression |
| F10 Ranking | `RecordScoreEvidence` | score ledger with unique source | `score.recorded.v1` | projections/fraud detection |
| F11 Honors | `PublishHonor` | reviewed exact nomination revision | `honor.published.v1` | gallery/rewards |
| F12 Rewards | `GrantVerifiedReward` | grant + item instance/ledger | `reward.granted.v1` | inventory/notification |
| F13 Shop | `PurchaseOfficialOffer` | offer stock + ledger + order + grant | `shop.order_completed.v1` | receipt/inventory |
| F14 Avatar | `EquipOwnedItem` | loadout + inventory ownership check | `avatar.loadout_updated.v1` | avatar preview/profile |
| F15 Marketplace | `SettleTrade` | listing+item hold+balanced currency | `trade.settled.v1` | seller/buyer receipts; adult gated |
| F16 Coding | `SubmitSolution` | immutable submission/version+judge job | `coding.submitted.v1` | isolated judge |
| F16 Judge | `FinalizeJudgeRun` | verdict/test results pinned to judge image | `coding.judged.v1` | code ranking/learning |
| F17 CMS | `PublishApprovedCampaign` | approved immutable revision + publication slot | `campaign.published.v1` | site slots, notifications |
| F17 Notify | `EnqueueNotification` | template version+recipient policy/dedupe | `notification.enqueued.v1` | delivery queues |
| F18 Support | `ResolveSupportCase` | case resolution + evidence/restriction | `support.resolved.v1` | requester communication |
| F19 MCP | `ApproveAgentAction` | approval bound to exact artifact hash/scope | `automation.approved.v1` | durable runner, not generic DB CRUD |
| F19 Automation | `ExecuteApprovedWorkflowStep` | durable run/step + attempt ledger | `automation.step_completed.v1` | next step; retry safe |
| F20 Creator | `PublishApprovedGameTemplate` | creator asset/game immutable revision | `creator.publication_published.v1` | catalog and moderation |

## 3. Mandatory business invariants
### Identity and safety
- Unique external identity, no cross-tenant user/member search without permission.
- Minor default no unrestricted stranger chat or peer trading.
- Account age-band/guardian policy revision and approval cannot be faked via profile JSON.
- Moderator/admin access is purpose limited and audited.

### Game / ranking
- A match has one authoritative terminal result; retries don't create a new result.
- One seat per active participant; private hand/hidden state not shared with observers.
- Finalized score must cite authoritative result and immutable policy version.
- Recompute leaderboard from score ledger; scores never reflect shop purchases.

### Economy
- Item definition/asset not equivalent to owned inventory copy.
- Currency ledger posted entries balanced per transaction/currency.
- Buyer cannot go negative, sold edition cannot oversell; duplicate purchase idempotent.
- One item instance cannot be simultaneously transferred/sold/equipped in prohibited state.
- Compensation adjusts immutable ledgers without erasing original source.

### Education and AI
- Academic rubric private by default, no student grade exposed in public ranking.
- Agent only acts under token scope, tenant, service API and exact-approved revision.
- Cancellation or failed automation step cannot silently drop a partially completed external change; retry or compensate with audit.
- Source GitHub PR reviewed before merge; MCP cannot inject direct production DB operations.

## 4. Transaction ownership and eventual consistency
| Need | Strong consistency | Eventual / materialized projection |
|---|---|---|
| reserve final room seat | room DB transaction | lobby presence updates |
| commit legal game move | match room command/persist seq | animations, chat/system notices |
| finish match | finalize-once result + entries | leaderboard, achievements, teacher charts |
| purchase offer | balance/stock/order/grant in ONE transaction | notification, frontend updated catalog |
| marketplace settle (future) | item transfer + balanced ledger + listing finalize | emails/receipt UI, fraud dashboards |
| CMS publish | revision approval check + publication pointer | cache invalidation/search/reindex |
| agent workflow step | run lock + atomic step state | notifications and reporting |

**No shared distributed transaction over API, R2, GitHub, notifications or AI generation.** Use outbox, compensating actions, external artifact hashes, prepared staging and verifiable postconditions.

## 5. Errors and retry statuses
- `NOT_AUTHORIZED`, `TENANT_DENIED`, `AGE_POLICY_DENIED`, `EXPIRED_REVISION`, `INVALID_RULE`, `DUPLICATE_REQUEST`, `INSUFFICIENT_BALANCE`, `ITEM_NOT_OWNED`, `SOLD_OUT`, `REQUIRES_APPROVAL`, `SERVICE_UNAVAILABLE`, `CONFLICT`.
- UI shows actionable localized text; internal diagnostics use correlation_id, never expose private resource details to unauthorized user.
- Retry target states must be explicit; clients can safely query by idempotency key if network dropped after server-side commit.

## 6. Required contract tests
1. Replay accepted commands under pinned game version produces same state hash.
2. One-time finalize across server reconnect and race conditions.
3. Concurrent last-seat joins yield exactly one winner.
4. Rank worker duplicate event creates no extra score.
5. Cross-tenant reading of a private match/grade/wallet denied.
6. Same purchase idempotency returns same receipt without double credit debit.
7. Two buyers racing for item stock or trade listing cannot both win.
8. Stale approval cannot publish changed CMS revision.
9. Child account cannot invoke restricted MCP/shop/chat actions.
10. Broken asset, judge or notification service cannot corrupt match/economy authoritative state.
