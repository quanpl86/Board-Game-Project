# EDU-05 Eco City Lab — Thành Phố Xanh 3D
**Status:** Design draft · **Genre:** STEM / co-op card strategy / isometric 3D city builder.

Students build a sustainable miniature city using React card UI linked to interactive 3D GLB assets. Game decisions change supply/demand for energy, water, budget, pollution and other system indicators. Outcomes are game-model abstractions, not real-world engineering simulation.

## Technical stack
Next.js + React Three Fiber + Three.js, authoring in Blockbench, GLB/glTF runtime, TypeScript deterministic simulation, PostgreSQL persistence, server-authoritative multiplayer, R2 asset CDN.

## Grid
Square grid configurable 6x6 tutorial; 10x10 standard; 16x16 advanced; 24x24+ sandbox in chunks. Buildings occupy rectangular footprints and support rotate, preview and inspect.

## Docs
- [GDD](GDD.md)
- [3D & asset specification](3D_ASSET_AND_RUNTIME_SPEC.md)
- [Infrastructure & storage](INFRASTRUCTURE_AND_STORAGE.md)
- [Education program](../../education/BOARD_GAME_EDUCATION_PRD.md)

## Criteria for vertical slice
One 10x10 city, >= 8 building cards, placement validation, energy/water budget state, 3D card-to-model transition, persistent multiplayer match, group voting, teacher activity and scoring evidence.
