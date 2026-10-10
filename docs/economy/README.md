# Cosmetic Economy, Marketplace & Rewards — Documentation Index
**Status:** PRD and architecture design only; no store or payment API has been implemented.

## Read in order
1. [Shop & Marketplace PRD](ECONOMY_SHOP_MARKETPLACE_PRD.md) — closed-loop credits, official offers, supervised phased peer listings.
2. [Avatar and 3D fashion / mascot / pets](../avatars/AVATAR_ITEM_AND_3D_ASSET_SPEC.md) — canonical equipment slots, Blockbench/GLB assets and animation compatibility.
3. [Database & Inventory Ledger](ECONOMY_INVENTORY_DATA_MODEL.md) — ownership instances, atomic orders, balances and trade escrow.
4. [Leaderboard & Hall of Fame](../competition/LEADERBOARD_HALL_OF_FAME_SPEC.md) — verified ranking evidence, awards and safe public recognition.
5. [UI/UX Specification](SHOP_AVATAR_UI_UX.md) — Store, Closet, Avatar Editor, Hall of Fame, Leaderboard, Marketplace.
6. [MCP Agent Tools & Governance](MCP_AGENT_AND_GOVERNANCE.md) — scoped and auditable automated publishing/monitoring.
7. [Delivery & Test Plan](DELIVERY_PLAN_AND_TESTS.md) — phased release and concurrency/permission test scenarios.
8. [ADR-0003](../architecture/adr/0003-economy-and-trading-boundaries.md) — cross-domain economy boundaries.

## Decisions
No real money payments/cash-out or gambling; official shop first, peer marketplace only after legal, child-safety and economic controls. Item cosmetics cannot enhance academic outcomes or ranked gameplay. User ownership and asset file distribution are distinct.

## Upcoming dependencies
KingDragonHub shared design tokens and components are being standardized in separate UI/UX PR. The official host CSS/fonts, player rig assets, paid transaction legal review and high-fidelity screens are not yet finalized.
