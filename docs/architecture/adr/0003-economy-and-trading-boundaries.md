# ADR-0003 — Cosmetic Economy, Verified Item Ownership & Gated Marketplace
**Status:** Proposed for architectural review
**Date:** 2026-10-10

## Context
Board Game Universe must support collection, personalization, achievement rewards, mascot suits, pets, avatar fashion and eventually player-to-player trade. A simplistic `user.items` JSON blob, unverified balance field or allowing client-supplied transfers would create duplications, abuse, untraceable corrections and risks for minor users.

## Decision proposal
1. Catalog `item_definition/item_version` identifies immutable versioned cosmetics; `asset_version` identifies reusable GLB/2D files. Inventory separately tracks current instance or quantity ownership.
2. Server-owned double-entry virtual currency ledger is the sole source of spendable balances. Balance cache is a projection.
3. Official Shop may sell only approved cosmetics for earned non-redeemable in-platform credits in MVP, with no real money, cash-out or chance-based paid drops.
4. Marketplace is **not enabled by default** and can only be implemented through specific instance locking/escrow, fixed-price listing and atomic settlement after safety/legal review; no open trading for children/strangers.
5. Cross-game loadout registry uses canonical rig + slot conflicts; all items remain cosmetic and never affect competitive score/hitboxes/academic rubric.
6. Leaderboards are dynamic verified projections, Hall of Fame curated permanent-but-revocable publications supported by evidence, and achievements are signed/verified grants.
7. MCP tools can draft items/offers and simulate ranking, but cannot write wallets directly or publish without authorized approval.

## Consequences
Added bounded contexts Economy, Inventory, Marketplace and Avatar within modular monolith, and more specialized documentation. Initial MVP implementation may defer physical marketplace tables. Explicit migration/testing for concurrency, anti-fraud and minor access required.

## Alternative rejected
A single `cosmetics` blob on `users`; storing sale price only on client; direct database admin mutations for balances; NFT/blockchain-first design; public real-money peer trade at MVP.

## Future re-evaluation
Paid purchases, trading jurisdiction, creator monetization, non-cosmetic game economies or cross-platform virtual-currency redemption require a new ADR with legal/payment/privacy/security review.
