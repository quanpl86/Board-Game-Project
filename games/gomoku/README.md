# Gomoku (Cờ caro) — deterministic Game SDK vertical slice (DEV/CI)

**Status: DRAFT / not merged, not deployed.** Scope: pure game rules and replay, independent of KingDragonHub SSO, browser, websocket, PostgreSQL, leaderboard, Coin/Shop. There is no public playable room, real identity, signed match result, bot, or authorized score.

## Commands

From the repository root (Node >=22; pnpm 10.14.0):

```bash
pnpm install --frozen-lockfile
pnpm --filter @bgu/gomoku typecheck
pnpm --filter @bgu/gomoku test
pnpm --filter @bgu/gomoku demo
```

Root `pnpm test` also executes Gomoku tests in CI. `pnpm typecheck` covers `@bgu/game-sdk` and `@bgu/gomoku`.

## Rules (pinned draft ruleset)

- `gomoku.freestyle.15x15.v1`; 15×15, two sides **black** then **white**.
- Freestyle: **five or more** connected stones horizontally, vertically, or diagonally wins; no Renju forbidden moves.
- Exactly one legal stone per turn in an unoccupied cell; zero-based row and column 0–14.
- Command envelope `place_stone`: player side, row, col, unique commandId, expectedRevision.
- Illegal/out-of-turn/stale/duplicate/occupied/out-of-bounds/finalized command is rejected with a stable error code.
- A completely filled board with no 5 is a draw; terminal state cannot accept moves.
- Pure state transitions always copy the board and history. No `Date.now`, random global state, network, DB or external tool calls.
- All moves are replayable from the identical seed and ordered, accepted command log; explicit canonical SHA-256 hash detects mismatches **but is not cryptographic authenticity proof**.
- Public view copies the board and filters internal commandId. Gomoku itself has no concealed tiles/cards.

## Game plugin and state

`packages/game-sdk/src/index.ts` defines a generic `GamePlugin`, manifest, validation result and stable rule exception.

`src/index.ts` defines the Gomoku reducer, manifest, DTOs, terminal candidate evidence, state hash and replay function. Source shape is intentionally extensible to a second game but **no cross-game conformance runner or published version registry yet**.

### Trust and safety boundary

The `player` string in a local game action **is not a verified account identity**. A future server must:
1. Authenticate principal and tenant, check membership/eligibility and seat -> side binding **before** passing a command to the reducer.
2. Serialize moves per match, compare revision, persist command with idempotency and state hash in a durable transaction, and finalize once.
3. Pin published manifest and score policy versions, generate signed/verifiable server evidence; never treat the reducer's `source: unverified_rules_engine` as real points, rewards or academic grades.
4. Reconstruct from durable snapshots/logs on reconnect and redact private game-specific information.
5. Reject forged winner/score claims; browser/AI/MCP cannot mint final result or write leaderboard.
6. Keep student accounts, UGC, guardian policy, wallets and shop **OFF** until separate security approval.
7. Handle malformed/untrusted state through validated persistence schema; this candidate reducer assumes state is produced by its own verified generator/replay.

## Acceptance / test matrix

| Case | Implementation | Evidence path |
|---|---|---|
| Initial state, manifest, seed | Yes | `tests/rules.test.ts` |
| Turn order, revision, immutability | Yes | `tests/rules.test.ts` |
| Invalid bounds, occupied, duplicate ID, stale revision | Yes | `tests/rules.test.ts` |
| Black horizontal and white vertical win | Yes | `tests/rules.test.ts` |
| Both diagonal axes | Yes | `tests/rules.test.ts` |
| Full-board draw | Yes | `tests/rules.test.ts` |
| Replay state hash / tampering | Yes | `tests/rules.test.ts` |
| Viewer command ID redaction | Yes | `tests/rules.test.ts` |
| Verified server identity/seat | **NOT IMPLEMENTED** | Issue #9 |
| Authoritative room / persistence / reconnect | **NOT IMPLEMENTED** | Issue #11 / Backend handoff |
| Game 2D browser viewport & E2E | **NOT IMPLEMENTED** | GAME-04 / UI handoff |
| Staging and production | **NOT VERIFIED** | Human release gates |

## Domain / UX / rollout references

- `docs/agents/QUALITY_GATES.md` and `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `docs/design/MASTER_SCREEN_INVENTORY_V2.md`: GAME-04 board, GAME-09 turn history, GAME-10 result, GAME-11 replay (P1), GAME-12 reconnect
- `docs/roadmap/MASTER_ROADMAP.md` and Issue [#11](https://github.com/quanpl86/Board-Game-Project/issues/11)

**No changes to published game rules, public catalog visibility, scores, database, students, product milestones or production.**
