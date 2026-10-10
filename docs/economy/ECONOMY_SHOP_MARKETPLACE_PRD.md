# PRD — Economy, Official Shop & Player Marketplace
**Status:** Proposed specification (not implemented) | **Owner:** Product / Economy | **Version:** 0.1 | **Date:** 2026-10-10

## 1. Objective & scope
Create a reusable multi-game **cosmetic economy**: earn approved in-platform credits, collect cosmetics and trophies, purchase from an official item catalog, equip a cross-game avatar and — only for eligible accounts after additional safeguards — list/transfer eligible owned items to another player. Separate educational evaluation from purchased goods and competitive scoring.

### Product boundaries
- **Official Shop:** publisher-controlled offers, bundles, seasonal items, transparent prices, stock/time limits and claims.
- **Marketplace:** verified player inventory units (not arbitrary asset files), fixed-price sale listing, reservation, escrow and atomic settlement; delayed rollout.
- **Inventory:** ownership of copies/instances, entitlement, quantity, bound status, equipped loadouts and detailed provenance.
- **Appearance:** avatar base, hair/face/body parts, full mascot costume, pet, profile background/frame/emotes and game cosmetic skins.
- **Rewards:** item drops from *verified deterministic achievements, events and competitions* (not pay-to-chance loot boxes).

## 2. Account audiences
- General adult player: official shop access; marketplace only after fraud checks and policies.
- Minor/student: shop, earned points and cosmetic awards **under school/guardian/age policy**; public cross-user trade, user-to-user messaging and cash payments off by default. Organizations may disable commerce entirely.
- Teacher/organization administrator: configure classroom-safe awarded items and school cosmetics; no default access to private wallet/purchase info beyond necessary controls.
- Publisher/merchant editor: draft item/offer; cannot bypass release approval or mint arbitrary rare items.
- Economy operator/referee: approve corrections through recorded compensating transactions, not direct balance changes.

## 3. Two-stage currency design
| Currency | Source | Uses | Constraints |
|---|---|---|---|
| XP / learning progression | validated participation/evidence | leveling, unlock eligibility only | Not a wallet and never purchase power; no public comparison of child academic scores |
| Earned Coins | confirmed match/mission/event reward | official cosmetic purchases | closed-loop virtual units; no withdrawal, no redemption for real money, subject to anti-bot caps |
| Event Tokens | season-specific verified quests | seasonal cosmetics | expiry and event provenance explicit |
| Marketplace Credits (future) | defined allowed internal settlement | peer listing payment | only after economic/legal review; double-entry ledger and holds |

**No real-money checkout, transfer to external wallets, cash-out, speculative item trading, gambling-style loot boxes or NFT in the initial product.** If real payment is ever added, it requires separate legal, consumer-protection, parental-consent, refunds, taxes, fraud and payment-provider architecture review, not merely a `price_real` field.

## 4. Item catalog model
Item category/slot taxonomy lives in [Avatar customization](../avatars/AVATAR_ITEM_AND_3D_ASSET_SPEC.md); logical `item_definition` is stable, published `item_version` immutable; separate `asset_version` for GLB/PNG and language metadata, edition, release provenance and rights.
Core properties: id, name/i18n, category, rarity/display tier, equip slots and slot conflicts, compatible avatar rigs, entitlement rules, adult/minor allowlist, tradability, giftability, bind policy, stacking/quantity cap, item origin, asset manifest hash, seasonal availability, usage grants.

## 5. Official Shop lifecycle
`DRAFT → REVIEW → APPROVED → SCHEDULED → LIVE → ENDED/PAUSED → ARCHIVED`. Listing belongs to edition, audience, tenant, time zone, price revision, purchase limits, inventory stock and campaign. Always validate actual price and eligibility at commit time, not trusting frontend.
Transaction:
1. UI shows fixed offer revision, price, quantity, cosmetic preview and restrictions.
2. Client sends idempotency key + offer revision + selected recipient/profile.
3. Server verifies account, tenant, policy, stock, per-user limits, price and wallet balance.
4. DB transaction: reserve/deduct wallet via ledger, decrement stock safely, create order and grant item instance/quantity, persist outbox.
5. Return receipt, show inventory, send async notification; retry must return same result without double charge/grant.
6. Failure rolls back all changes; refunds and policy corrections use new compensating ledger entries.

## 6. Marketplace lifecycle (later release)
`LISTED → RESERVED → SOLD` or `LISTED → CANCELLED/EXPIRED/SUSPENDED`. Draft rejected if not owned, untradeable, bound, already equipped under no-trade policy, sanctioned or wrong audience.
- Seller lists **actual specific owned instance/quantity** at a fixed price and explicit expiry. No speculative buy/sell offers or auctions in first release.
- Instance is held/escrowed while listed so it cannot be equipped-transferred-sold twice; read-only preview may remain.
- Buyer authorizes purchase; server checks policy, buyer funds, seller status, listing revision/expiry and reserve token.
- In one atomic transaction: debit buyer, credit seller minus configured fee where allowed, transfer item instance, finalize listing, create buyer/seller receipts and outbox. Double-entry accounting must balance.
- Moderation/appeal/compensation recorded; fraud freeze and rollback through ledger reconciliation. No direct SQL edits to balances.
- Rate limits, transaction limits, suspicious-price and circular-trading heuristics, trading cooldown, account age/trust and anti-bot tests.
- No stranger-to-child DM/chat or contact exchange required for trade; minor marketplace off by default.

## 7. Item binding and lifecycle
- `TRADEABLE`: one eligible sale at a time; ownership provenance retained.
- `ACCOUNT_BOUND`: earned education/trophy reward or purchased bind-on-acquire; no sale/transfer.
- `SOULBOUND`: identity-specific honorary prestige item, cannot be traded.
- `CONSUMABLE`: must define burn/expiry and transactional quantity update.
- `REVOKED/QUARANTINED`: fraud, rights or safety action; do not erase audit.

Rarity is presentation metadata only, not guaranteed economic value. Limited editions require clear issuance caps, disclosed availability and history.

## 8. Economy health
Track verified earn vs spend, outstanding currency liability, inflation, transaction failure, stock exhaustion, suspicious transfers, top-item concentration, item issuance and support refunds. Limit repetitive grinding and bots. Prevent buying ranking placement or educational rubric credit.

## 9. Permissions & approval
| Action | Player | Adult eligible | Shop Editor | Economy Admin | Safety officer |
|---|---|---|---|---|---|
| Browse safe catalog | ✓ | ✓ | ✓ | ✓ | as needed |
| Buy with earned coins | policy-bound | ✓ | no override | support workflow | no override |
| Equip owned item | ✓ | ✓ | — | support | — |
| Create trade listing | no by default for minors | ✓ after verification | — | manage rules | revoke/suspend |
| Create item draft | — | — | ✓ | ✓ | — |
| Publish stock/price | — | — | request approval | authorized approval | policy veto |
| Mint/revoke holdings | — | — | — | dual-control compensated action | safety-authorized review |
| Read private trade data | own only | own only | aggregate | scoped, audited | only approved incident |

## 10. MVP scope and acceptance
**MVP:** official cosmetic shop, 20–30 seeded items across major slots, earned coins, profile inventory, preset/3D avatar preview, equip/loadout/save, 2D fallback, achievements→rewards and audit. **P1:** seasonal offers/bundles/gifting policy and shop LiveOps. **P2:** restricted player marketplace after child safety, concurrency and economy review. **P3:** advanced trading/creator commerce only with additional review.

Must pass: duplicate buy retries create one order; negative wallet balances impossible; concurrent listing/sell of one item cannot both succeed; item asset version pin remains stable; cosmetics do not modify gameplay score; disabled marketplace remains inaccessible from API for minors; every correction can be audited.

## 11. Cross-domain integration
Ranking/achievement triggers `reward.granted` → inventory item grant; LiveOps campaigns target official shop offers; asset pipeline pins Blockbench/GLB versions; MCP drafts offers and audits without direct wallet write; avatar loadout projects same cosmetics to profiles, 2D board, 3D world and Hall of Fame.
