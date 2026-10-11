# BGU-005 — Gomoku Rules Engine / Game SDK Implementation Handoff

**Task:** [Issue #11](https://github.com/quanpl86/Board-Game-Project/issues/11)
**Authoring role:** BGU-GAME / BGU-BACK implementation scope
**Independent reviewers required:** BGU-ARCH + BGU-QA; Human Product Owner for any product/ruleset scope decision
**Status:** IN_PR candidate — **NOT MERGED**, not staging/production.
**Risk:** R2 isolated pure rules; future live authenticated room and scoring = R3/R4 and separately gated.

## Read and traceability
- `AGENTS.md`, `.agents/roles/bgu-game.md`, `.agents/skills/game-sdk/SKILL.md`, `.agents/skills/realtime-multiplayer/SKILL.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md` F03/F04; `docs/games/GAME_CATALOG_AND_ROADMAP.md`; `docs/agents/QUALITY_GATES.md`
- Proposed screens: GAME-04 board, GAME-09 turns, GAME-10 result, GAME-11 replay, GAME-12 reconnect.

## Changes
- `packages/game-sdk/`: shared typed GamePlugin / manifest / action verification contract.
- `games/gomoku/`: 15×15 freestyle reducer, v1 draft manifest, deterministic canonical SHA-256 hash, replay, local console demo, typed tests.
- `package.json`: include Gomoku tests in root CI test script.
- `pnpm-lock.yaml`: register new workspace packages without adding remote libraries.
- `docs/implementation/GOMOKU_SDK_DEV_HANDOFF.md`: this handoff.

## Verification checklist
- [ ] GitHub CI on exact PR HEAD: platform lint/typecheck/test/build PASS with links.
- [ ] Independent game rule review: freestyle 5+ versus Renju 5-exact, age/content/rights, version pin.
- [ ] Independent QA confirms illegal action, win/draw, pure immutability, replay hash mismatch and no hidden IDs in player view.
- [ ] QA confirms test runner actually invoked in PR CI, not only generated documents.
- [ ] Release manager confirms no playable online services, databases or student data touched.

## Explicit non-deliverables & subsequent tasks
- No authenticated/authorized principal-to-seat binding; Issue #9 KingDragonHub SSO remains open.
- No Colyseus room, concurrency arbitration, move transaction/outbox, reconnect, persistence or signed result: independent Backend/Realt ime PR required.
- No Next.js GAME-04 interactive board, no visual QA, game launch, rewards, leaderboard, education grade or Coin.
- No dynamic bot, spectator auth, rule publishing pipeline or cross-game certification.
- No production or staging deploy; do not auto merge without human signoff.

## Review/rollback
All changes isolated in a feature branch. No data migration or upgrade of live state. Reject or revert draft changes without touching DB. Future persisted match snapshots must pin ruleset ID and state schema version, with backward-compatible replay readers.
