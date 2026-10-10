# Logical Data Model — Wallets, Inventory, Shop, Trades, Avatar
**Status:** Proposed relational schema inventory; NOT executable migrations.
**DB:** PostgreSQL source of truth, UUID PK, timestamptz, strict tenant/safety boundaries, immutable history and validated JSONB only for versioned configs.

## 1. Bounded contexts and source of truth
- **Identity:** user, pseudonym, verified age band/school policy; no PII duplicated into shop tables.
- **Catalog:** immutable item definitions and versions; cross-game capabilities/equipment slots.
- **Assets:** immutable approved 2D/GLB/animation asset versions.
- **Economy:** currency accounts, ledger and platform-store orders; verified receipts.
- **Inventory:** ownership state and equip presets, separated from current appearance of assets.
- **Trade:** listings/escrow/reservations/settlement, safety and dispute lifecycle.
- **Ranking/Honors:** verified points and curated awards; may grant cosmetics, not exchange scores for cash.

## 2. Candidate physical tables (split later only when proven necessary)
| Table | Critical fields / constraints | Notes |
|---|---|---|
| `item_categories` | id, slug unique, parent_id, visibility | taxonomic categories |
| `equipment_slots` | id, code unique, parent_id, stacking_rule | registry for hair/head/face/hands/legs/body/pets etc |
| `item_definitions` | id, code unique, type, origin, status, publisher_tenant_id | logical product |
| `item_versions` | id, item_id, revision unique by item, body_type/rig compatibility, binding_policy, transfer_policy, rarity, publish_hash, status | published immutable |
| `item_version_assets` | item_version_id, asset_version_id, role | 2D thumbnail, GLB, animation, effects |
| `item_slot_rules` | item_version_id, equip_slot_id, operation, priority, exclusivity_group | outfit conflict resolution |
| `item_editions` | id, item_version_id, issuance_cap, issued_count, start/end, origin_event_id | scarcity policy |
| `inventory_instances` | id, owner_user_id, edition_id, item_version_id, status, bound_at, provenance_id, created_at | unique/nonfungible owned copy |
| `inventory_stacks` | owner_user_id, edition_id, stack_key, available_qty, locked_qty | stackable cosmetics/consumables |
| `inventory_events` | id, instance_id/stack_key, from_owner, to_owner, kind, reason, actor_id, source_ref, occurred_at | immutable ownership audit |
| `avatar_rig_definitions` | id, revision, skeleton_contract_hash, compatible_body_types | canonical rig |
| `avatar_presets` | id, owner_user_id, base_rig_id, label | saved outfit |
| `avatar_loadouts` | id, user_id, preset_id, context_game_id, is_active | profile or game |
| `avatar_loadout_items` | loadout_id, slot_id, inventory_instance_id or stack ownership ref, priority | validated equipped entries |
| `pet_instances` | inventory_instance_id, config_version, state | optional pet cosmetics |
| `currency_definitions` | id, currency_code, tenant_scope, spendability, expires_at | earned coins / event token |
| `ledger_accounts` | id, owner_kind, owner_id, currency_id, status, unique owner+currency+purpose | player, platform pool, escrow, fees |
| `ledger_transactions` | id, type, idempotency_key unique, correlation_id, actor_id, status, created_at | immutable posted entry header |
| `ledger_entries` | id, transaction_id, account_id, signed_amount bigint, created_at | sum per currency/transaction = 0 |
| `wallet_balance_projections` | account_id PK, available, held, updated_at | derived/cache, rebuildable from ledger |
| `shop_offer_revisions` | id, offer_id, item_edition_id, price_amount, currency_id, max_per_user, stock, audience_policy_json, dates, approved_at | immutable published offer |
| `shop_orders` | id, buyer_user_id, offer_revision_id, quantity, charged_currency, total_amount, status, idempotency_key | snapshot purchase receipt |
| `shop_order_lines` | order_id, item_version_id, quantity, granted_instance_id | grant trace |
| `trade_listings` | id, seller_user_id, inventory_instance_id, currency_id, price_amount, version int, status, expires_at | one active listing per instance |
| `trade_reservations` | id, listing_id, buyer_id, reserved_until, hold_transaction_id, status | concurrency safety |
| `trade_settlements` | id, reservation_id, buyer_id, seller_id, ledger_tx_id, ownership_event_id, status | atomic settlement refs |
| `marketplace_policy_revisions` | id, scope, account_age/age_band, price_limits, fees, moderation, approved_at | scoped active policy |
| `trade_disputes` | id, trade_id, reporter_id, status, evidence_ref, resolver_id, result | incident handling |
| `item_moderation_actions` | id, instance_id/item_id/listing_id, actor_id, reason, action, timestamps | quarantine/revoke |
| `honor_entries` | id, award_definition_id, subject, evidence, visibility, approved_revision | published recognition |
| `honor_nominations` | id, nomination_target, submitter_id, reviewer_id, status, evidence | review pipeline |

No requirement to materialize all tables in P0: create shop/wallet/inventory core first, trade tables only when marketplace release passes approval.

## 3. Key constraints and relationships
- `item_definitions 1:N item_versions`; `item_versions N:M asset_versions`; `inventory_instances N:1 item_versions`.
- `users 1:N inventory_instances`; each unique instance has exactly one current owner (or escrow owner state). Marketplace listing references owned instance, never arbitrary file URL.
- `trade_listings` partial unique index on `inventory_instance_id` where status in (LISTED, RESERVED).
- `ledger_entries` linked to posted `ledger_transactions`, currency comes from ledger_account. Enforce balanced entries with transaction service/deferrable validation as appropriate.
- Nonnegative available balance checked under row lock/transaction, not calculated client-side.
- `shop_orders` unique (buyer_id, idempotency_key) and stock reductions serialized to avoid overselling.
- `avatar_loadout_items` refer to current owned and compatible inventory; invalidated/rejected when transferred.
- Composite FK to scope/tenant where needed; RLS and API authorization both enforced.

## 4. Atomic purchase pseudocode
```text
BEGIN TRANSACTION
  validate user/age/tenant/shop offer revision/availability
  SELECT ledger_account FOR UPDATE
  ensure available funds and purchase limit
  reserve stock with conditional UPDATE
  INSERT posted ledger transaction + balanced entries
  INSERT shop_order + inventory grant + inventory_event
  INSERT domain_outbox(event=shop.order_completed.v1)
COMMIT
```
Retry by idempotency key must return same order. No independent wallet decrement outside ledger.

## 5. Atomic market settlement pseudocode (later)
```text
BEGIN TRANSACTION
  SELECT trade_listing FOR UPDATE
  lock buyer/seller accounts and owned instance in canonical order
  validate seller ownership, age/rights, hold TTL and currency/price revision
  post balanced buyer/seller/fee/escrow entries
  transfer one instance and record inventory_event
  mark listing SOLD, settlement finalized
  INSERT outbox events
COMMIT
```
Prevent cross-account item cloning via unique instance and lock. No cash-out.

## 6. Event contracts
`item.published.v1`, `shop.offer_published.v1`, `shop.order_completed.v1`, `inventory.item_granted.v1`, `inventory.item_transferred.v1`, `avatar.loadout_updated.v1`, `trade.listed.v1`, `trade.settled.v1`, `trade.suspended.v1`, `honor.published.v1`. Version schemas and use transactional outbox; consumers idempotent.

## 7. Retention / disclosure / security
Private buyer/seller IDs and receipts visible only to parties and scoped operators; no public purchase history of minors. Logs redact PII and secret tokens. Honor publicity requires proper assent/authorization; no default named public minor profiles. Incident evidence can require restricted retention, all retention periods must be documented before production.

## 8. Migration plan
P0: item catalog, item asset mapping, ownership, avatar slot/loadout, wallet ledger, official offers/orders. P1: editions/bundles, seasonal shop and honor entries. P2: reviewed marketplace listings/escrow/settlement/disputes. Apply expand/migrate/contract with reversible rollout and independent audit.
