# Avatar, Mascot, Fashion, Pet & Collectible Asset Specification
**Status:** Design baseline / not implemented | **Version:** 0.1
**Goal:** A reusable 2D + 3D modular appearance system across game genres.

## 1. Item category and equipment slot registry
| Category | Primary slot key | Examples |
|---|---|---|
| Avatar base | `body.base` | stylized body variants, base skin, sizes |
| Hair | `head.hair` | hairstyle, bangs, color variations |
| Face | `face.eyes`, `face.mouth`, `face.accessory` | pixel-textured expression, glasses, mask |
| Head | `head.hat`, `head.ears`, `head.accessory` | hats, crown, animal ears |
| Neck | `neck` | scarf, collar |
| Torso/Person | `torso.inner`, `torso.outer`, `torso.full` | shirt, hoodie, dress, armor, jacket |
| Arms/Hands | `arms.sleeves`, `hands.gloves`, `hands.held` | gloves, bracelets, lantern/flag |
| Legs/Feet | `legs.bottom`, `feet.shoes` | shorts, pants, tights, footwear |
| Back | `back` | backpack, cape, wings |
| Costume/Mascot | `costume.full`, `costume.head`, `costume.torso` | full-body animal/robot costume, partial suits |
| Pet | `companion.pet` | robotic cat, owl, fox, floaty mini mascot |
| Profile | `profile.background`, `profile.frame`, `profile.badge` | background, dynamic avatar frame |
| Game cosmetics | `board.skin`, `dice.skin`, `card.back`, `effect.victory`, `emote` | table scene, dice, card back, VFX |

Slots are registry entries, not hardcoded UI enums. Item may occupy **multiple slots**, e.g. a mascot full costume occupies head/torso/arms/legs while optionally allowing face expression visible through a cutout. A dress or armor may occlude layered garments.

## 2. Rig and animation compatibility
- Use one documented **canonical skeleton / attachment bone naming** across compatible base avatars; body variants must pass rig compatibility tests. Avoid rebuilding animations per costume if skeleton can be shared.
- Reference meshes share neutral pose and joint anchors (Head, Neck, Spine, Left/RightHand, Left/RightFoot, Back, PetAnchor). Exact bone identifiers defined in canonical rig contract during prototype.
- Shoes and gloves skin to canonical skeleton; hand-held item attaches to relevant hand anchor and follows walk/run/win animations.
- Hairstyles may use multiple sculpted voxel submeshes; face features (eyes/mouth/nose) primarily pixel texture, not standalone block geometry. Hats can hide or swap incompatible hair sections.
- Full costume: define rig-compatible skin mesh/outer shells, silhouette and culling rules; preserve face/head holes for photobooth-style accessories only where item specifically supports cutout, not by default.
- Pet: own animation state (idle, walk, celebrate, emote), following anchor relative to avatar, does not block game interaction; pet can be disabled in low-quality or competitive mode.
- All cosmetics purely visual. Avatar size/hitbox/camera visibility never changes based on ownership, especially in competitive games.

## 3. Blockbench → GLB pipeline
Source .bbmodel + editable texture layers; low-poly/voxel mesh, PBR-lite textures; runtime GLB/glTF 2.0 with consistent +Y up, +Z front, pivot/rig origin standardized. Retain versioned source in private design repository/storage, signed published runtime assets in R2 CDN.
`asset_definition` describes reusable geometry; `asset_version` pins immutable GLB/texture/hash/thumbnail/LOD/animation metadata. `item_version` references one or more asset versions for 3D/2D preview and slot rules.

## 4. Avatar assembly & layer resolution
Resolve compatible items by a deterministic layer/priority tree:
1. Load base body + shared skeleton and basic clothing.
2. Apply skin/face texture layers and selected face expressions.
3. Apply hair/head/neck layers subject to hat/ears/mascot conflicts.
4. Apply torso/arms/legs/feet/back meshes + hide occluded geometry.
5. Apply full-body costume substitution/overlay when equipped.
6. Attach hand props, pet companion, emotes and ambient cosmetic FX.
7. Render background/frame/profile cover as separate 2D UI assets.

Never store arbitrary client-supplied mesh URLs in equip operations. Server checks ownership, compatibility and equip policy; saves loadout referencing immutable inventory instance(s) + version. Renderer uses whitelisted catalog.

## 5. Data representation
- `avatar_presets`: reusable saved appearance sets, name, base rig/body and scope.
- `avatar_loadouts`: user's active preset per game/context (profile, lobby, game-specific).
- `avatar_loadout_items`: loadout + owned inventory instance/stack + equip slot, order.
- `avatar_rig_definitions`: rig ID/version and socket + skeleton mappings.
- `avatar_compatibility_rules`: item version, rig family, allowed slots, occupied conflicts and clipping behavior.
- `pet_instances`: owned pet characteristics, state and allowed progression (if any).
- `profile_decorations`: active frame/background/title.
Published asset mapping immutable; existing profile screenshots and replay may pin loadout snapshot to protect historical fidelity.

## 6. Social and honor presentation
Player profile uses 2D rendered avatar thumbnail; lobby may show 3D animated avatar; Hall of Fame shows achievement, trophy and approved visible cosmetic frame. User can hide outfit, pet or specific cosmetics for privacy and performance. No inference of personal attributes from avatar body selection; do not gender-lock cosmetics.

## 7. Performance
- Avatar+items share materials/atlas as practical, use attach rather than heavyweight child canvases.
- Cache previews by (base rig revision + item version IDs + style + pose) hash; invalidate on published asset version.
- LOD/culling/animation throttling for many avatars in one room.
- If WebGL unsupported, use generated 2D thumbnail/profile sprite.
- Validate clipping and animation compatibility for walk, run, idle, jump, pickup, celebrate, victory dance, injury/death where appropriate.

## 8. Quality gates
Asset preview front/back/left/right/top/bottom as relevant; anatomy/slot overlap checks; static rig joint sampling in animations; loadout equipped/unequipped snapshots; missing GLB fallback, no pay-to-win collider changes, child-suitable visuals and source-rights audit. Official identity/brand mascot requires permission and license provenance.

## 9. Launch packs (illustrative)
20–30 items: base body variants, 4 hairstyles, 3 head accessories, 3 face accessories/expressions, 4 outfits including one mascot, 2 footwear, 2 handhelds, 2 pets, 2 backgrounds, 2 frames and 2 victory VFX. Tune after preview tests; all should support appropriate 2D fallback.
