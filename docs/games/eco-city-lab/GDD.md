# Game Design Document — Eco City Lab 3D
**ID:** edu-05-eco-city-lab · **GDD:** 2.0 proposed · **Audience:** 9–12 (+ advanced 13–15)

## Learning outcomes
Systems thinking, resource planning, limited budgets, trade-offs, design-test-improve and sustainability. Separate win/score from teacher-verified STEM competencies.

## Board & session
2–4 students per team; 15–25 minute short mode; six rounds default. 6x6 tutorial, 10x10 standard, 16x16 advanced, bigger configurable via chunking; 1x1–3x3 building footprint.
Flow: lobby → planning → propose build → vote/approve → validate → construct → simulation tick → reflection → next round / finish.
Victory and failure thresholds vary by scenario. Solo and compare-seed competitive modes can follow.

## Card and building
Each card maps to versioned building definition, cost, maintenance, construction requirements, resource consumption/production, educational annotation, 3D GLB and VFX. Card UI stays HTML/React; Three.js renders scene.
Examples: homes, school, hospital, parks, solar panel farm, wind turbine, conventional power station, water treatment, trash treatment, bus stop, roads, research lab.
Illustrative solar: footprint 2×2, price 120 game coins, +6 energy, +3 eco, maintenance 5 per turn (illustrative only).

## Team roles
Budget Manager, Urban Planner, Environment Specialist, Team Facilitator; rotate each round. Building may require majority vote, captain confirmation or teacher override according to scenario policy.

## Action validation
Select card → ghost placement preview → rotate → server checks budget, active turn, footprint, zone, prerequisites and double-spend → commit match event → update authoritative state → broadcast redacted projections → play construction animation. Never trust client claims about resources, rating or final result.

## Simulation
Core: coins, energy_supply/demand, water_supply/demand, eco_score, waste, pollution, population. VFX as feedback: lit/unlit buildings, power flow, running water, foliage, traffic and pollution clouds.
Deterministic simulation model, seeded RNG and pinned rule/model version per match; snapshot/replay and recoverable saved world.

## Scoring
Example weighted score: 40% scenario objectives, 25% resource efficiency, 20% environment stability, 15% iterative improvement. Tune by playtest; learning rubric remains distinct.

## Acceptance
Deterministic replay, no negative budget, no overlapping footprint, reconnect restores turn, play on target tablets, accessible effects controls, save/load works, learning evidence produced and teacher can review it.
