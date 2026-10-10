# Student + Character Core — PostgreSQL 16 physical candidate

**DEV/CI ONLY · NOT PRODUCTION APPROVED.** The 22-table Student Universe extension is *design-only*; this PR creates **5** physical Student/Character tables plus the single upstream P1 `commerce.avatar_rigs` foundation table. No live application database, inventory grant API, Coin ledger or student data are touched.

## Exact migration slice
`db/migrations/0003_student_character_core_candidate.sql` requires P0 `0001_p0_foundation.sql`. It does **not** require P1 Education migration PR #21, but production migration sequencing/registry must be reconciled before any staging run.

| Table | Purpose / P0-P1 dependency |
|---|---|
| `student.student_profiles` | Learner-only profile (PK/FK identity.users); student-account validation |
| `student.privacy_settings` | Private default; guardian link must be verified and reference same learner at settings write |
| `commerce.avatar_rigs` | Single P1 canonical rig revision + SHA; do not recreate in later Commerce P1-C migration |
| `characters.character_definitions` | Character catalog definition; published status and created_by |
| `characters.character_versions` | FK to published character definition, compatible rig and approved P0 GLB asset; pinned revision/hash |
| `characters.character_instances` | An owned learner character, immutable owner/version, revocable instead of delete |

## Security and integrity
- All six tables `ENABLE` and `FORCE ROW LEVEL SECURITY` with **zero** `CREATE POLICY` and **zero** runtime `GRANT`; app roles cannot read/write by default.
- Adult account cannot be inserted into student profile; student profile cannot create a second global user.
- Public settings without a verified guardian link are rejected. Guardian must link to the exact learner. **Guardian revocation can happen later:** every backend read must revalidate current guardian status; settings flags are **never** authorization. No public learner profile is enabled.
- Published rig and character versions are immutable. Character publication needs approved asset version, approved rights, model3d kind and published definition; production later needs rig skeleton compatibility tests, revocation handling and safe asset CDN.
- An instance must reference published version and student owner; owner/version cannot change, revoked character cannot become owned again, row DELETE blocked. Initial grant provenance/idempotent reward receipt is **not yet modeled in this slice**; no runtime INSERT allowed.
- Child PII, legal name, exact age and session credentials are not replicated in student profile. Nickname alias filters require API moderation and consent logic.

## What is NOT part of this SQL
- `commerce.inventory_instances`, `commerce.item_versions`, `commerce.avatar_loadouts` and Coin `ledger_accounts/ledger_entries`: P1 design only. No wardrobe purchase/equip or wallet supported.
- Remaining `characters.character_loadout_bindings`, progress/pet ownership, projects, awards, rewards and wallet projections from 22-table proposal.
- Verified SSO provider/host integration, class teacher privileges, guardian revocation propagation, RLS allow policies, age handling, API DTO and frontend data service.

## Test and approval sequence
Run static parity `python scripts/check_student_character_core.py`. CI installs P0 and six-table SQL on disposable PostgreSQL 16, then rollback-isolated `db/tests/0003_student_character_core_smoke.sql` checks adult impersonation, guardian mismatch/unverified, asset approval, draft character grant, duplicate rig version, immutable owner/template, RLS default-deny.
Before a staging/production migration obtain Product Owner + DBA + Privacy/Security signoff, reconcile `0002` Education and `0003` migration order, define least-privilege runtime role, SSO/guardian RLS policies, audited grant commands, storage lifecycle and backup/restore tests.

**Agent contract:** read `docs/database/student-universe/START_HERE.md`, physical migration + this gate, and the P0 asset/identity source before Backend or Frontend work. Never interpret a migrated candidate as live API or authorized Coin wallet.
