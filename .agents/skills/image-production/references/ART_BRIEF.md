# Image Asset Brief & Generation QA Template
**Asset ID:** IMG-____ · **Status:** CONCEPT / DRAFT / REVIEW / APPROVED / PUBLISHED
**Owner:** BGU-IMAGE · **Screen/game:** [Screen ID / Game ID]
**Audience:** [age + accessibility] · **Style:** KingDragonHub platform or approved game-world art

## Brief
- Purpose & user message:
- Primary subject and viewpoint:
- Composition and safe region for responsive text overlay:
- Palette: `#FF5722` accent, neutral light, dark ink where appropriate; game-specific colors allowed.
- Reference sources and rights / logo source:
- Ratio: 16:9 hero, 3:4 item/card, 1:1 sticker/icon, 9:16 vertical (confirm with specific screen).
- Target dimensions + file formats + true transparency:
- Desired background and silhouette:
- Forbidden elements: unwanted watermark, fake logos, unlicensed character, student face/PII, embedded unreadable UI text.

## Reusable prompt skeleton
```text
Create [asset type] for [screen/game/target audience] illustrating [subject and intended action],
in [approved game/KingDragonHub art direction],
composition [main object at ...; leave ... safe empty area for UI overlay],
palette [brand orange accent + muted neutral base or game-specific palette],
lighting [soft/clear], framing [ratio], transparent background [yes/no as supported],
no logos/text/third-party characters unless official approved sources supplied,
suitable for children, crisp at [render target].
```
Treat negative prompts as implementation detail of chosen authorized image model; do not claim tool supports them without checking.

## QA checklist
- [ ] Actual output exists and ratio/pixel dimensions verified.
- [ ] Alpha/transparency checked at pixel level when requested.
- [ ] Correct object count, materials, hands, eyes and structural constraints.
- [ ] No embedded wrong text, brand mark or license issue.
- [ ] Crop tested 390/768/1440 in real card/hero layout.
- [ ] Optimized WebP/PNG variants, thumbnail/alt and approved provenance manifest.
- [ ] Human Brand and rights owner approved public image.

## Handoff
Asset hash/version, prompt/reference permissions, image versions, preview snapshots, fallback plan. Draft visual is NOT final production 3D model or downloadable product file.
