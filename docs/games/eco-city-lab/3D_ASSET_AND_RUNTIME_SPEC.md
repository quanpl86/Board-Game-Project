# Eco City Lab — 3D Asset & Runtime Specification
**Stack:** Blockbench source → GLB/glTF 2.0 → R2/CDN → Next.js client with React Three Fiber/Three.js.

## Art standard
Stylized low-poly 3D with pixel-texture accents. Unified camera-facing proportions, color categories and visual density. Author source .bbmodel; runtime .glb; texture atlas when suitable.

## Coordinate convention
+Y up, +Z front; pivot bottom-center; y=0 at ground; x/z centered; world unit is meter, grid conversion configurable. Footprint metadata always supplied, plus orientation, safe collision bounds, render LOD and source license.

## Initial asset library
Residential, apartments, library, hospital, school, solar panels, wind generator, conventional power station, water treatment, waste center, parks, trees, lake, paths/roads, intersections, bridges, transport stops, vehicles, lamps and research labs.

## Hierarchy
Building root, visible geometry, named moving parts (wind rotor / opening doors), inspect / upgrade / repair interaction sockets and effect anchors (energy, smoke, water). Prefer Three.js-controlled animation for shared effect logic.

## Runtime UX
Orthographic isometric camera, 90-degree rotation option, pan, orbit restrictions, zoom and reset; click/tap selects building; drag card or choose tile to display translucent placement; green/red tile highlight; context inspector; animated construction and upgrades.

## Effects
Construction, selection outline, upgrade, energy/water networks, pollution, growing greenery, weather, traffic, day/night and achievement. Effects reflect game state and can be reduced for low-spec devices or accessibility.

## Performance
Preload common model pack, lazy-load rare models, use InstancedMesh for repeated props, asset dedup, LOD, frustum/chunk culling, particle pooling and adaptive quality. Target 30 FPS baseline on target classroom tablets and 60 FPS desktop under benchmark scenarios.

## Pipeline QA
Verify model origin, facing direction, scale, texture references, animation node names, geometry complexity, file hash, collision/footprint, low-detail variants and license before publication. Each immutable asset version maps to compatible game versions.
