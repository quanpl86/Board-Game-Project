# Student Profile / Character / Asset / Wallet — Open Decisions

**Status:** P0 planning decisions for the next implementation workstream. Proposed extension, no physical SQL.

| ID | Owner | Decision requiring written approval | Required verification |
|---|---|---|---|
| STU-01 | Identity/Privacy | Stable SSO subject, learner account type and student profile age/stage source | Real KingDragonHub auth schema; no exact DOB in profile |
| STU-02 | Privacy | Verified guardian and school access by cohort and child rights | Cross-org/guardian negative permission matrix |
| STU-03 | Product | Public alias, privacy switches, default private and revocation | UI/DB policy parity + audited consent |
| STU-04 | Education | How school membership and student profile join | No second duplicate student user row |
| CHAR-01 | Avatar/3D | Template/rig/version and per-student character instances | GLB rig animation and version replay |
| CHAR-02 | Product | Initial free character grant and multi-character ownership | Atomic entitlement and uniqueness |
| CHAR-03 | Avatar/UX | Per-game versus global active appearance, costume slot conflict | Owner cross-FK/rig/slot tests |
| CHAR-04 | Privacy | Visibility/withdrawal for student character gallery | Minor private/public policy |
| ASSET-01 | Creator/Privacy | Student-generated model file ownership and moderation | Source provenance, malware/file scanning, license |
| ASSET-02 | Creator/Storage | Retention, object-store access and public release | Signed URLs, deletion/export rules |
| OWN-01 | Economy/DBA | Stackable items vs unique instances, provenance and quantity reservations | Concurrent claim/consume/revoke tests |
| OWN-02 | Security | Whether item transfer/trade is ever allowed for minors | Default disabled, child safety approval |
| COIN-01 | Product/Economy | Official Coin types, currency issuer, earning and redeemability | No cashout or hidden pay-to-win |
| COIN-02 | DBA | Posted ledger per-currency exact zero-sum | Deferred transaction-posting gate / negative SQL tests |
| COIN-03 | DBA/QA | Holds and available balance under concurrent purchases | Double-spend race, no negative spend |
| COIN-04 | Economy/QA | Atomic shop charge, offer price, stock, inventory and receipt | Exactly once / rollback / compensation tests |
| COIN-05 | Product/Privacy | Reward sources from game/teacher/classroom and daily caps | Anti-fraud, adult-only authorizers, source verifiability |
| COIN-06 | Privacy | Guardian spending limits and disclosure | Verified guardian scope, audit, withdrawal |
| AWARD-01 | Education/LiveOps | Achievement badges vs scores vs grades vs wallet rewards | No automatic conversion without policy revision |
| SEC-01 | Security/Release | RLS, migration owner separation, retention and replay tests | Production migration requires separate human approval |

## Critical missing physical guarantees

Existing P1 Commerce spec is still **not** an executable ledger: `ledger_entries` alone cannot guarantee same-currency zero-sum, owner/tenant access, or sufficient funds. Those guarantees must be implemented in a separately reviewed migration and posting domain service with concurrency tests. `student.*` and `economy.wallet_balance_projections` must not be deployed as a shortcut.

Keep learner-owned character state, item ownership events, grant receipts and wallet ledger history separately. Never put `coins`, `items_json`, `characters_json` into `identity.users` or `identity.profiles` as writable authority.
