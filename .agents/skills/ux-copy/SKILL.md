---
name: ux-copy
description: Write consistent Vietnamese-first KingDragonHub UX microcopy for public, student, teacher, competition, shop, support and AI control flows with localization and child safety.
version: 1.0.0
owner_role: BGU-COPY
---

# Skill: ux-copy
**Purpose:** Write consistent Vietnamese-first KingDragonHub UX microcopy for public, student, teacher, competition, shop, support and AI control flows with localization and child safety.

## Activate for
label, copywriting, Vietnamese, CTA, tooltip, error message, empty state, announcement, notification, localization

## Read before acting
- `docs/design/DESIGN_LANGUAGE.md`
- `docs/design/SCREEN_INVENTORY.md`
- `docs/product/END_TO_END_APP_FLOWS_V2.md`
- `docs/liveops/LIVEOPS_CONTENT_STRATEGY.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Set actor and intent; choose voice by context: playful/encouraging for players, supportive and clear for children, practical and evidence-based for teachers, formal/precise for admin/safety/finance.
2. Write in natural modern Vietnamese with correct diacritics, short imperative button labels (e.g. 'Chơi ngay', 'Tham gia phòng', 'Xem luật', 'Thử lại', 'Lưu bản nháp'); avoid vague 'OK' for destructive action.
3. Establish content hierarchy: eyebrow/topic, short headline, benefit sentence, primary CTA, optional secondary help. Maintain consistent domain terms: Trận đấu, Phòng chơi, Điểm xếp hạng, Coin, Vật phẩm, Tủ đồ, Vinh danh, Công bố.
4. For forms/status/errors, explain current state and actionable recovery: 'Không đủ Coin. Cần 120, hiện có 95.'; 'Phiên đăng nhập hết hạn. Đăng nhập lại để tiếp tục.' No raw stack trace.
5. Define empty/loading/restriction/age consent, purchase receipt, upload, reconnect, tournament dispute, grade privacy and automation approval microcopy; avoid shame/pressure and false urgency.
6. Use typed i18n resource keys and ICU/variable placeholders; don't concatenate translated text fragments; date/number/currency localized with clear timezone.
7. Fact-check achievement claims, event dates and scarcity from authoritative services; never fabricate medal, price or guaranteed win.
8. Review clarity, reading level and accessibility (screen reader labels, button brevity, no text embedded in raster); produce string catalog with approval status.

## Non-negotiable rules
- No manipulative microcopy, fear of missing out for minors, betting references or pay-to-win promises.
- Do not leak another user's name, private score, wallet, chat or student feedback.
- Don't claim 'Đã lưu/Đã phát hành' before host action confirms.
- Marketing copy and safety/admin wording must have appropriate reviewer.

## Required output artifacts
- Copy deck grouped by screen ID/state
- i18n dictionary keys and placeholder types
- Error/recovery and push notification samples
- Content approval checklist

## Validation / Definition of Done
- [ ] All user-facing actions specific and grammatically natural
- [ ] Date/currency/consent accurate
- [ ] No hardcoded strings hidden in component JS where i18n required

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, test evidence, preview URLs and independent reviewer; no unapproved production write.
