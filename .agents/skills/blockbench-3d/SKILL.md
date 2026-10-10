---
name: blockbench-3d
description: Author and validate modular stylized Blockbench source, GLB assets, animations, rig sockets, texture and LOD for 3D games and avatar cosmetics.
version: 1.0.0
owner_role: BGU-3D
---

# Skill: blockbench-3d
**Purpose:** Author and validate modular stylized Blockbench source, GLB assets, animations, rig sockets, texture and LOD for 3D games and avatar cosmetics.

## Activate for
Blockbench, GLB, 3D, low-poly, voxel, rigging, modeling, animation, Three.js

## Read before acting
- `docs/games/eco-city-lab/3D_ASSET_AND_RUNTIME_SPEC.md`
- `docs/avatars/AVATAR_ITEM_AND_3D_ASSET_SPEC.md`
- `docs/design/DESIGN_LANGUAGE.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Create asset brief and manifest with ID, scene use, physical footprint, GLB preview, editable .bbmodel source, rig family, LOD, materials and license.
2. Use +Y up, +Z front, bottom-center pivot at y=0, X/Z centered, configured game-meter units; validate origin/scale/rotation, not just visual.
3. For building: footprint x/z dimensions, collision boxes, placement sockets, effect anchors, moving parts, inspect/upgrade states; enforce no overhang into neighbor tiles without declared bounds.
4. For character: start canonical 3D body and sockets, pixel texture for eyes/nose/mouth (not tiny face cube blocks), hair built using several meaningful 3D volumes, consistent joint/rig scale, name sockets Head/Neck/HandL/HandR/Back/FootL/FootR.
5. Retarget or sample standard animations idle, walk, run, jump, pickup, hit, victory, dance using same skeleton. Verify garments and held items across poses; pet separate animation set.
6. Export glTF 2.0/GLB; validate scene graph, transparency, color/texture atlas, normals, PBR-lite, physics bounds, missing external texture, embedded source rights, animation name and material budget.
7. Generate runtime preview with Three.js/R3F at target camera and game board; check on low-end classroom tablet under performance envelope; instancing/LOD for repeated buildings.
8. Publish immutable GLB+texture+thumbnail variant to asset registry/CDN only after human Art/Game review; retain original editable source securely.

## Non-negotiable rules
- Raster image render is not source-editable GLB; cannot substitute.
- Never put full 3D runtime binary in Git without LFS/asset policy.
- Do not fake direct Blockbench edit/tool success; verify current scene and export results.
- No player advantage from larger costume hitbox/collision.
- Third-party 3D asset and texture licenses must be recorded.

## Required output artifacts
- Blockbench source/GLB+thumbnail or honest design spec
- Rig/sockets/animation manifest
- Footprint/performance QA report
- Asset version/hash/license

## Validation / Definition of Done
- [ ] Y-axis/pivot/scale correct
- [ ] Animations show no clipping or detached items
- [ ] Renderer can load GLB and fallback if absent
- [ ] License and asset hash verified

## Handoff
Use `docs/agents/templates/HANDOFF.md`; cross-domain changes require affected skill/owner and independent human approval at risk R3/R4.
