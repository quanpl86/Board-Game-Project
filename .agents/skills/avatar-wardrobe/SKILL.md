---
name: avatar-wardrobe
description: Design avatar base, hair, face, mascot costumes, fashion, pets, profile frames and compatibility across rigs, layering, animations and inventory ownership.
version: 1.0.0
owner_role: BGU-3D
---

# Skill: avatar-wardrobe
**Purpose:** Design avatar base, hair, face, mascot costumes, fashion, pets, profile frames and compatibility across rigs, layering, animations and inventory ownership.

## Activate for
avatar, hair, mascot, clothing, pet, emote, frame, background, outfit, equipment

## Read before acting
- `docs/avatars/AVATAR_ITEM_AND_3D_ASSET_SPEC.md`
- `docs/economy/ECONOMY_INVENTORY_DATA_MODEL.md`
- `docs/economy/SHOP_AVATAR_UI_UX.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Resolve item category, slot code (`head.hair`, `face.accessory`, `torso.outer`, `hands.held`, `feet.shoes`, `costume.full`, `companion.pet`, `profile.frame`) and allowed rig family/version.
2. Decide whether item is 2D decoration, 3D skinned mesh, slot attachment, texture layer, VFX or companion; provide previews for required platforms.
3. Define occupied and conflicting slots; mascot full suit may hide head/torso/arms/legs, exceptions like face cutout declared intentionally; hair under hat may swap to compatible variant.
4. Validate equipment at every standard animation keyframe plus scale/occlusion; ensure canonical rig without changing gameplay physics/hitbox.
5. Ensure user owns exact `inventory_instance` or allowed stack and server validates equip request; asset `item_version` mapping immutable.
6. Design closet UI with inspect/equip/undo/save preset; 3D on desktop/tablet, 2D fallback on mobile or no WebGL; avoid mandatory gender-based styling restrictions.
7. Test transfer/revoke while equipped, pet animation/device performance, missing texture, incompatible edition, screenshots/profile loadout pin.

## Non-negotiable rules
- Cosmetics never boost ranked performance, education grade or collision size.
- Do not equate owned item, asset GLB, skin preset and reward achievement.
- No unreadable tiny face geometry; keep face texture style coherent.
- Pet or VFX must have toggle/reduced-motion and not obscure gameplay.

## Required output artifacts
- Item compatibility & slot matrix
- Rig/animation tests
- 2D/3D wardrobe preview and preset schema
- UI states and accessibility spec

## Validation / Definition of Done
- [ ] One item occupies legal slots only
- [ ] Transfer/revoke invalidates incompatible loadout safely
- [ ] Avatar renders and animates with all equipped items

## Handoff
Use `docs/agents/templates/HANDOFF.md`; cross-domain changes require affected skill/owner and independent human approval at risk R3/R4.

## Student Universe profile/asset/character/wallet source-of-truth
Read [learner-owned data atlas](../../../docs/database/student-universe/START_HERE.md), [editable 30-page Draw.io](../../../docs/database/student-universe/Student_Universe_Editable.drawio), [cross-layer security and API draft](../../../docs/database/student-universe/IMPLEMENTATION_AND_SECURITY_CONTRACT.md) and canonical `db/schema/student_universe_extension_candidate.json` before touching student profiles, cosmetic items, assets, character instances, ownership, Coin or badges. All 22 new tables are **proposal-only**. Never infer owned items from approved GLB, EXP from Coin, or a wallet amount from a user profile. No direct SQL from frontend/MCP; respect guardian/tenant RLS, reward idempotency and double-entry concurrent spending gates. Obtain Human DBA/Product/Security approval before any physical migration.
