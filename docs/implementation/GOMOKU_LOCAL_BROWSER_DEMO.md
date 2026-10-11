# GAME-04 — Gomoku local browser demo (DEV / staged PR candidate)

**Status:** IN_PR candidate after PR is opened; no live URL, no staging/production verification.
**Parent dependency:** [PR #30 — Game SDK + Gomoku deterministic rules](https://github.com/quanpl86/Board-Game-Project/pull/30).
**Work item:** [BGU-005 Issue #11](https://github.com/quanpl86/Board-Game-Project/issues/11).
**Executor role:** BGU-UI + BGU-GAME; **independent review:** BGU-UX + BGU-QA + BGU-ARCH.
**Screen:** `GAME-04`, related `GAME-09` turn history, `GAME-10` result, and prototype-only `GAME-11` replay.
**Actor:** two synthetic local players on one browser; public/guest **no account created**.
**Risk:** R2 reversible UI/DEV rules. A future authenticated game is R3 and cannot reuse untrusted identity or scores.

## What is implemented
- Browser route `/games/gomoku/demo`, discoverable by a clearly labeled local-demo link on the homepage catalog. Catalog continues to say `planned`, not published.
- Keyboard and mouse/touch playable 15×15 game board using **exact same pure reducer** as Game SDK; NO independent React win/turn rules.
- 44 × 44 CSS px grid cell targets. Mobile board scrolls horizontally rather than shrinking to inaccessible targets. Arrow keys and Home/End move the roving focus; Enter/Space activate native buttons. Visible focus, logical row/column labels and live status announcements.
- One browser controls black/white alternately. New game, undo latest turn, read-only replay with seek/previous/next/exit, move history and concise freestyle rules.
- Preview warnings: no login, score, account, network, shared room, persistent history, Coin, rewards, rankings or real student data. Refresh discards all game state.
- KingDragonHub **provisional** brand CSS variables inherited from `apps/web/app/globals.css`; no claim of pixel-perfect host stylesheet.

## Browser/server isolation
```text
packages/game-sdk/src/index.ts          pure typed GamePlugin contract
games/gomoku/src/core.ts                browser-safe deterministic rules
games/gomoku/src/local-session.ts       browser-safe local controller/replay
games/gomoku/src/client.ts              limited browser export, no node:crypto
games/gomoku/src/index.ts               Node SHA256 hash, full server candidate
apps/web/app/games/gomoku/demo/page.tsx server metadata + shell
apps/web/app/games/gomoku/demo/GomokuLocalBoard.tsx client React interaction
```

Do not import the Node entry `@bgu/gomoku` into Next client components. Client imports `@bgu/gomoku/client`. The DEV browser result is not authoritative; backend must bind authenticated principal to seat and use transactional commands/outbox before multiplayer or scoring.

## Manual acceptance script (needs human QA browser evidence)
| # | Given | When | Then |
|---|---|---|---|
| 1 | Visit Home | Select Gomoku local preview | Route displays preview disclaimer, GAME-04 board and history |
| 2 | Initial board | Select an empty cell | Black stone appears; status says White next |
| 3 | Occupied cell | Select same cell | Turn unchanged; visible actionable error |
| 4 | At least 3 moves | Select Undo | Latest move disappears; original player turn resumes |
| 5 | Moves recorded | Select Replay and seek step | Board shows exact prefix, live match unchanged and placement blocked |
| 6 | During replay | Exit replay | Latest full live board returns |
| 7 | Win position | Make fifth in line | Winner announced and further placement denied |
| 8 | Any match | Select Restart | Empty 15×15 board, black turn, 0 moves |
| 9 | Keyboard | Tab to grid, use arrows/Home/End, Enter | One roving focus, visible focus ring, correct cell selected |
| 10 | Viewport 390, 768, 1024, 1440 px | Navigate game | Board scrolls horizontally on narrow view, controls accessible, no hidden critical content |
| 11 | Prefers reduced motion | Navigate | No required animation / motion for comprehension |
| 12 | Browser reload | Refresh route | No persistence or accidental grade/rank/signed score |

**Required visual/e2e evidence:** screenshots at 390/768/1024/1440, tablet landscape, keyboard flow, VoiceOver/NVDA or equivalent, contrast audit; link artifacts to PR. None is presumed complete merely from Next build.

## Automated checks
- `pnpm install --frozen-lockfile` (workspace lock must match).
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` via Platform Foundation CI.
- `pnpm --filter @bgu/gomoku test` — existing rule tests plus local-session replay, undo, invalid clicks, terminal and browser-import isolation.
- No Playwright screenshot/E2E runner introduced in this PR; **NOT RUN** until a browser QA environment is configured.
- No actual OAuth, WebSocket, PostgreSQL or staging health tests, because those services remain outside this candidate.

## Definition of done / release gate
- **DEV tested** when CI PASS at PR head and independent test review complete.
- **IN_PR** until separately approved/merged. A green CI does not constitute release.
- **STAGING_VERIFIED** only after a real approved staging URL and manual/automated browser test artifacts.
- No production deployment, live scoring/ledger, changed Student data, author self-approval, or unreviewed changes to KingDragonHub header.

## Risks and follow-ups
- **Blocked:** Real KingDragonHub SSO and seat-authority mapping, [Issue #9](https://github.com/quanpl86/Board-Game-Project/issues/9).
- **Blocked:** Authenticated server rooms, reconnection, durable replay, scoring signatures — follow-on BGU-BACK/BGU-GAME PR after RLS, Game SDK and host audit.
- **Decision:** Product Owner/Game owner confirms freestyle five-or-more rule before immutable published version.
- **QA:** Browser and screenreader manual checks, mobile horizontal-scroll affordance. Planned Playwright E2E in Issue #16.
- **Style:** Verify actual licensed KingDragonHub fonts/CSS with host source before claiming final design fidelity.

## Revert/rollback
Only new browser/demo route, homepage link, package imports and a split of the existing DEV engine into pure/browser and Node hash exports. Remove the new route/link and revert the browser export; no data, DB migration, service, production release or tenant permissions are touched. Parent PR #30 must remain independently reviewable.
