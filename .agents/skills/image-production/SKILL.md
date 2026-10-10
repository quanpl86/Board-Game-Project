---
name: image-production
description: Produce and QA brand-consistent safe illustrations, backgrounds, cards, stickers, banners, mascots and educational images with source rights, ratios, transparency and asset manifests.
version: 1.0.0
owner_role: BGU-IMAGE
---

# Skill: image-production
**Purpose:** Produce and QA brand-consistent safe illustrations, backgrounds, cards, stickers, banners, mascots and educational images with source rights, ratios, transparency and asset manifests.

## Activate for
AI image, visual, sticker, banner, cover, icon illustration, card art, character concept, mascot, educational imagery

## Read before acting
- `docs/design/DESIGN_LANGUAGE.md`
- `docs/design/REFERENCE_AUDIT.md`
- `docs/design/tokens/kingdragonhub.tokens.json`
- `docs/games/eco-city-lab/3D_ASSET_AND_RUNTIME_SPEC.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Start image brief: asset ID, target screen and intended action, age group, style, KingDragonHub palette, subject, mood, background/alpha, composition, safe cropping, ratio, delivery resolution, license/provenance and approval owner.
2. Pick appropriate medium: generated images only when a raster visual is the desired output; if editable vector/icon/3D model is required, use corresponding source workflow, not a raster imitation.
3. Composition presets (suggested, validate against UX): 16:9 hero/event feature; 3:4 game card/item portrait; 1:1 icon/sticker/pet; 9:16 vertical announcement/video cover; create needed crops from editable master with subject safe area. Don't bake critical UI text into images.
4. Brand direction: bright cream/light background, orange highlight #FF5722, dark/navy ink, deliberate whitespace, friendly polished playful board game illustration; game-world art can be low-poly/pixel/3D as approved. Do not copy KingDragonHub mascot from screenshot unless official licensed reference/source supplied.
5. Generate versions in staging via authorized tool; keep generation prompts, model/provider, reference permissions and output IDs recorded. Review anatomy/objects, age-appropriateness, clarity at target size, text/logo mistakes, hands/faces, copyright/trademark.
6. Render preview in actual UI card/hero at 390/1024/1440, check text safe zone, gradients and accessibility; produce transparent PNG/WebP or 2D appropriate; use source/master rather than destructive upscales where possible.
7. Export optimized output, thumbnails, optional alt text and license/attribution; pin immutable asset version/hash and register in Asset Catalog; human brand/rights review before production.

## Non-negotiable rules
- No generated image is a substitute for working React components/GLB/source-editable art.
- Do not use personal student photos, faces, biometrics, private class identities without approved privacy/legal basis.
- No fabricated official logos, trademarked mascot/license claims or unapproved reference style mimicry.
- Never claim transparent background, exact size or licensed provenance without checking file.
- For image edit requests use authorized image generation/edit tool, no deceptive manual claim.

## Required output artifacts
- Asset brief/prompt & provenance
- 2–3 draft variations or evaluated single deliverable as scoped
- Reviewed master/output + thumbnail/alt
- Asset manifest fields: id, version, dimensions, format, hash, license

## Validation / Definition of Done
- [ ] Dimensions/ratio and alpha verified
- [ ] UI preview safe and readable
- [ ] Brand/rights and visual QA approved

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, test evidence, preview URLs and independent reviewer; no unapproved production write.
