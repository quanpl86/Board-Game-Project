---
name: game-sdk
description: Implement and validate game plugin contracts, authoritative deterministic turn rules, scoring evidence, game manifests, replay and cross-game catalog integration.
version: 1.0.0
owner_role: BGU-GAME
---

# Skill: game-sdk
**Purpose:** Implement and validate game plugin contracts, authoritative deterministic turn rules, scoring evidence, game manifests, replay and cross-game catalog integration.

## Activate for
new game, Game SDK, chess, Gomoku, Ludo, rule engine, scoring, replay, simulation

## Read before acting
- `docs/games/GAME_CATALOG_AND_ROADMAP.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `docs/games/eco-city-lab/GDD.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Define game ID, published manifest/apiVersion, player limits, genre, modes, turn/phase mechanics, age grade policy, renderer type, ruleset/scoring hash and hardware/accessibility capabilities.
2. Implement pure createInitialState(seed), validateAction, applyAction, getPlayerView(redacted), getOutcome, getScoringEvidence; deterministic RNG injected, no Date.now/network in rule reducer.
3. Separate rendering React/Three.js from game logic and authoritative Game Server, including card hidden info and dice fairness.
4. Create state schema version migrations/readers for old matches and pinned published rule/asset/score versions; no editing live version in place.
5. Write unit/property-based tests: legal/illegal moves, no turn duplication, tie/win, rule invariant, board bounds, negative economy, simulated bots, replay exact state hashes.
6. Add bot with non-secret player-view input and appropriate difficulty; do not allow AI prose model to overrule game validator.
7. Create Game Manifest, GDD, RULES, STATE_SCHEMA, SCORING, ASSETS, TEST_PLAN, CHANGELOG and license review; publish only via reviewed pipeline.

## Non-negotiable rules
- Client cannot assert authoritative points, win state or user identity.
- One game plugin never writes identity/leaderboard tables; platform consumes verified evidence.
- No copyrighted modern game branded reproduction without permission.
- Do not alter old published rules in place; replay compatibility mandatory.

## Required output artifacts
- Versioned Game Plugin & manifest
- Rules/State/Scoring documentation
- Replay and invariant test suite
- Performance QA & content rights

## Validation / Definition of Done
- [ ] Determinism on pinned seed/version
- [ ] Player-view redaction secure
- [ ] SDK contract and multiplayer integration green

## Handoff
Use `docs/agents/templates/HANDOFF.md`; cross-domain changes require affected skill/owner and independent human approval at risk R3/R4.
