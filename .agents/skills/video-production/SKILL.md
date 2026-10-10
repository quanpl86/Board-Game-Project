---
name: video-production
description: Produce accessible KingDragonHub-aligned tutorial, promo, seasonal, game-rules and educational video using storyboard, scripted voice, subtitles, licensed audio and reproducible render project.
version: 1.0.0
owner_role: BGU-VIDEO
---

# Skill: video-production
**Purpose:** Produce accessible KingDragonHub-aligned tutorial, promo, seasonal, game-rules and educational video using storyboard, scripted voice, subtitles, licensed audio and reproducible render project.

## Activate for
video, trailer, reel, tutorial, Remotion, motion graphics, narration, subtitle, animation

## Read before acting
- `docs/design/DESIGN_LANGUAGE.md`
- `docs/design/MOTION_ACCESSIBILITY.md`
- `docs/games/eco-city-lab/GDD.md`
- `docs/design/tokens/kingdragonhub.tokens.json`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Define video objective, audience/age, channel/placement, CTA, duration, language, aspect (16:9 1920x1080 for lesson/site, 9:16 1080x1920 for vertical, 1:1 optional), target file weight and accessible alternatives.
2. Write accurate script from approved PRD/GDD and learning outcomes; narrator uses clear Vietnamese with pronunciation/segment timings; never claim missing game feature as operational. Time each sentence to fit spoken duration.
3. Create scene-by-scene storyboard (shot ID, start/end, visual source/permission, text overlay, motion, music/SFX, subtitle and CTA). Define opening/context, core demonstration, feedback/result and close, each with enough read time.
4. Use approved tools according to output: Remotion for deterministic text/compositing/motion, recorded authorized gameplay for tutorials, licensed image/3D assets for art; ensure exact source code/project stays editable, and build tested rather than static image 'video mockup'.
5. Follow KingDragonHub UI text/spacing/palette; avoid excessive orange text or small captions; animation defaults calm, limit flashes, provide reduced-motion/static alternative where relevant.
6. Create Vietnamese captions as SRT/VTT (accurate dialogue and timing), optional audio description/summary for meaningful visuals, royalty-cleared music with volume below voice and no autoplay sound on web.
7. Render staging preview (suggested 30fps H.264 MP4, AAC audio, target 1080p depending channel), inspect first/middle/last frame, duration, aspect, lip sync, subtitle safe zone and voice clarity.
8. Attach source edit/project, script, licensed assets, captions, thumbnail, final media metadata/hash; rights and owner approval before production CDN.

## Non-negotiable rules
- No claim 'MP4 rendered' without actual output file and playback/duration check.
- Do not fabricate student's performance, photos/voices, brand logo or generated video source rights.
- No copyrighted music without documented license; no high-flash effects for children.
- Generated narration must be disclosed/approved when used with recognizable voices; never clone an identifiable person's voice without permission.

## Required output artifacts
- Storyboard and script
- Scene/asset manifest with rights
- Editable Remotion/project files where appropriate
- Validated MP4 and captions/thumbnail if rendering authorized
- QA and publishing checklist

## Validation / Definition of Done
- [ ] Scene timing adds to requested duration
- [ ] Captions agree with spoken words and no cropped text
- [ ] Rendered video verified with real file/metadata
- [ ] Brand, age and rights reviewed

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, test evidence, preview URLs and independent reviewer; no unapproved production write.
