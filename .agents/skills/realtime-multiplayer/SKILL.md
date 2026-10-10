---
name: realtime-multiplayer
description: Build authoritative online rooms, matchmaking, reconnect, spectator policy, private player views and high-availability Colyseus gameplay.
version: 1.0.0
owner_role: BGU-BACK
---

# Skill: realtime-multiplayer
**Purpose:** Build authoritative online rooms, matchmaking, reconnect, spectator policy, private player views and high-availability Colyseus gameplay.

## Activate for
WebSocket, Colyseus, multiplayer, lobby, join code, matchmaking, reconnect, spectators

## Read before acting
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `docs/product/END_TO_END_APP_FLOWS_V2.md`
- `docs/operations/INFRASTRUCTURE_AND_SECURITY.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Model independent `game_rooms`, `room_memberships`, `matches`, active connection presence; define room lifecycle and timeouts.
2. Authenticate join/rejoin token, tenant/age/game entitlement and seat; reserve seat atomically; room code hashed and expires.
3. Run moves under server-validated turn, schema and idempotency; accepted move committed before response/broadcast and each player gets sanitized view.
4. Record commands/snapshots and recovery state to durable storage; client reconnect by session identity without creating a new seat or move.
5. Handle host leave, duplicate joins, stop/pause, bot-fill and room draining during server deploy. Make spectator access/delay explicit (no hidden cards).
6. Design load tests for high concurrent rooms and poor school network; Redis Presence only when multi-process deployment demands it; persist matches in PostgreSQL.
7. Produce game room metrics (latency/reconnect/error), alert thresholds and reproduction scripts for race conditions.

## Non-negotiable rules
- No trust in client clock/RNG/score/hidden state.
- Room presence cache is not sole source of durable game outcomes.
- Avoid reconnect tokens in URLs/logs without expiry and policy.
- No server shutdown that silently loses active room state.

## Required output artifacts
- Room protocol and typed events
- Connection/state diagrams
- Race/reconnect/load tests
- Operations runbook and health metrics

## Validation / Definition of Done
- [ ] Duplicate last-seat joins yield one seat
- [ ] Reconnect resumes exact match, version and turn
- [ ] No hidden state leakage to player/spectator

## Handoff
Use `docs/agents/templates/HANDOFF.md`; cross-domain changes require affected skill/owner and independent human approval at risk R3/R4.
