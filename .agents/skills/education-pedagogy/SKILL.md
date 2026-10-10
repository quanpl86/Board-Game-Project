---
name: education-pedagogy
description: Author age-appropriate STEM/STEAM, thinking and robotics board-game lessons, objectives, assessment rubrics and teacher classroom flows.
version: 1.0.0
owner_role: BGU-EDU
---

# Skill: education-pedagogy
**Purpose:** Author age-appropriate STEM/STEAM, thinking and robotics board-game lessons, objectives, assessment rubrics and teacher classroom flows.

## Activate for
STEM, STEAM, lesson, class, rubric, 5E, EDP, assessment, robotics, education game

## Read before acting
- `docs/education/BOARD_GAME_EDUCATION_PRD.md`
- `docs/education/BOARD_GAME_EDUCATION_MASTER_PLAN.md`
- `docs/product/END_TO_END_APP_FLOWS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Define target age/grade, prior knowledge, measurable learning objective, STEM concept, misconception and 15–35-minute classroom timing; group vs solo mode.
2. Select suitable game mechanic and map each action to observable thinking/engineering evidence, not just score/win. Use 5E or Engineering Design Process only where pedagogically appropriate.
3. Design introduction, concept explanation, guided example, interactive challenge, reflection and teacher debrief; scaffold easier/harder variants and access accommodations.
4. For group sessions define roles and participation, talk prompts, quick chat moderation, teacher pause/resume and handoff between rounds.
5. Create analytic rubric with levels, criteria, evidence source, privacy scope, resubmission and human teacher verification, pinned rubric version.
6. Run tabletop simulation for unfair/outlier outcomes; validate mathematical/science accuracy independently; test with educator and target age before publish.
7. Create item/mission content in typed versioned data, not runtime hardcoded UI; sync lesson/title strings with Vietnamese copy skill.

## Non-negotiable rules
- A game score is not a validated personal academic grade.
- Never publish student private results or shame low performance.
- No fake textbook standard alignment; verify framework/version and cite real source.
- Avoid overloading short sessions with excessive UI or reading.

## Required output artifacts
- Learning outcome & GDD link
- Lesson/session storyboard
- Rubric and example evidence
- Teacher guide and QA scenarios

## Validation / Definition of Done
- [ ] Every goal has assessed evidence
- [ ] Accessible to intended age and device
- [ ] Teacher can review/correct outcome safely

## Handoff
Use `docs/agents/templates/HANDOFF.md`; cross-domain changes require affected skill/owner and independent human approval at risk R3/R4.

## Database P1 Candidate Modeling — mandatory pre-implementation gate
Read [P1 Database Atlas](../../../docs/database/p1/README.md) and [P1 Cross-Layer Plan](../../../docs/database/p1/CROSS_LAYER_IMPLEMENTATION.md) for Education/Competition/Commerce scopes. 39 tables, 265 fields and 80 relationships are **PROPOSED**, not executable PostgreSQL or migrated entities. Study per-table dictionaries and editable Draw.io before API/UI design; do not use P1 diagrams as permission to query DB, invent frontend data or issue production DDL. Require Product Owner/DBA/Security decision signoff and isolated migration tests; coin double-entry/concurrency and private student rubric assessments are high-risk stop-gates.

## Education P1-A physical review gate
The full candidate P1 Draw.io is **not** the current SQL state. Use `docs/database/p1/EDUCATION_PHYSICAL_ERD.md` and `docs/database/p1/EDUCATION_PHYSICAL_CANDIDATE.md` for the 11 Education migration tables, physical composite FKs and negative tests. No real student data, SSO authorization policies or production migration until explicit privacy/DBA/owner signoff.
