---
name: economy-inventory
description: Control cosmetic item definitions/versions, verified ownership, earned currency ledger, official shop and restricted future marketplace with fraud and minor safety protections.
version: 1.0.0
owner_role: BGU-LIVEOPS
---

# Skill: economy-inventory
**Purpose:** Control cosmetic item definitions/versions, verified ownership, earned currency ledger, official shop and restricted future marketplace with fraud and minor safety protections.

## Activate for
shop, Coin, currency, wallet, collectible, inventory, trade, offer, price, marketplace, item

## Read before acting
- `docs/economy/ECONOMY_SHOP_MARKETPLACE_PRD.md`
- `docs/economy/ECONOMY_INVENTORY_DATA_MODEL.md`
- `docs/architecture/adr/0003-economy-and-trading-boundaries.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Define item definition/edition/version, current owned instance or stack, binding/tradability, compatible rig and approved asset manifest independently.
2. Start with earned closed-loop Coins and official cosmetic shop; explicit price/revision, stock, age/tenant eligibility, no real payment/cash-out in MVP.
3. Use immutable balanced double-entry transactions, atomic stock decrement, order and item grant, unique idempotency key; balance projection is not authoritative.
4. Test two concurrent buyers, insufficiency, out-of-stock, duplicate calls, refunds via compensating entries, transfer/revoke while equipped.
5. For later marketplace, implement adult eligibility, fixed listing, item escrow/hold, time limits, atomic buyer/seller/fee settlement and fraud review; NEVER turn on for minors by default.
6. Reward from game results requires verified score/achievement event and human-approved policy; cannot sell rank or teacher assessment credit.
7. Send receipts, accessible error/status and ledger reconciliation anomaly to restricted ops dashboard; publication through reviewed shop offer version.

## Non-negotiable rules
- No generic tool `wallet.set_balance`, direct inventory mint or score overwrite.
- No speculative scarce asset investment / lootbox / gambling style monetization at P0.
- No arbitrary seller-to-buyer messaging necessary for trade.
- Every inventory instance has auditable provenance and one current owner.

## Required output artifacts
- Item catalog and offer schema
- Ledger and transaction test plans
- Shop/closet UX and safety rules
- Reconciliation and antifraud report

## Validation / Definition of Done
- [ ] Ledger balances and item ownership reconcile
- [ ] Concurrent operations exactly once
- [ ] Minor access denied server-side; cosmetics never alter gameplay metrics

## Handoff
Use `docs/agents/templates/HANDOFF.md`; cross-domain changes require affected skill/owner and independent human approval at risk R3/R4.
