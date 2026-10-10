# Master Screen Inventory V2 — Full Platform
**Status:** Proposed screen-level UX architecture, **not** high-fidelity visuals or implemented Next.js pages.
**Owner:** Product UX · **Date:** 2026-10-10

## Scope and counting
**117 logical screens / workspaces** (not 117 separate Next.js bundles/routes). Some are drawers/steps and share a route, layout or component; final route count will be smaller. Eight primary visual samples in PR #2 are insufficient for this expanded product scope.

Priority: **P0 (32)** minimum infrastructure/vertical-slice UX, **P1 (64)** cross-product release, **P2 (21)** deferred strategic scope. Source flags: BASE (main existing design concept), PR2/PR3 (from pending UI/economy specs), NEW (new/expanded flow, needs PRD+screen design), PR2/PR3 (overlap). Counts are planning estimates, **not completeness guarantees**.

## Navigation map
KingDragonHub host → Public Game Hub → Play / Learn / Compete / Connect / Collect, with restricted **Operate** workspace for teachers, organizers, moderators, content/AI and platform staff. Share a global notification inbox, search, account/profile and tenant switcher. Fullscreen game can hide outer nav but must preserve exit, help and identity/room context.

## AUTH / Global shell (12)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `SH-01` | Public header/footer and host entry | public | F01 | P0 | BASE |
| `SH-02` | Universal search overlay | all scoped | F02/F17 | P0 | BASE |
| `SH-03` | Account sign-in / SSO callback | public/user | F01 | P0 | NEW |
| `SH-04` | Guest demo and upgrade | guest | F01/F02 | P0 | NEW |
| `SH-05` | Student invitation / join-code verification | student/teacher | F01/F06 | P0 | NEW |
| `SH-06` | Guardian approval and age/policy notice | minor/guardian | F01 | P0 | NEW |
| `SH-07` | First-run profile and avatar setup | new user | F01/F14 | P0 | NEW |
| `SH-08` | Select/switch tenant or personal space | multi-tenant | F01 | P0 | NEW |
| `SH-09` | Account security and recovery | account owner | F01 | P1 | NEW |
| `SH-10` | Privacy, accessibility & notification preferences | account owner | F01 | P0 | NEW |
| `SH-11` | Linked identity/SSO conflict resolution | owner/support | F01 | P1 | NEW |
| `SH-12` | Session expired / access restricted | all | F01 | P0 | NEW |

## PLAY / Game Hub (8)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `PUB-01` | KingDragonHub Game Hub landing | public | F02 | P0 | PR2 |
| `PUB-02` | Game Catalog & filters | public/player | F02 | P0 | PR2 |
| `PUB-03` | Game Detail / rules / tutorials | public/player | F02 | P0 | PR2 |
| `PUB-04` | Game mode and eligibility selector | player | F02 | P0 | NEW |
| `PUB-05` | Personal player profile / highlights | player | F11/F14 | P1 | PR2 |
| `PUB-06` | My Games / continue sessions | player | F04 | P0 | NEW |
| `PUB-07` | Tutorial/training sandbox | player/student | F02 | P1 | NEW |
| `PUB-08` | Recent games & replay library | player | F04 | P1 | NEW |

## GAME / Runtime (15)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `GAME-01` | Create / join private room | player/host | F03 | P0 | PR2 |
| `GAME-02` | Room lobby, ready, team roster | player/host | F03 | P0 | PR2 |
| `GAME-03` | Matchmaking queue & found-match confirmation | player | F03 | P1 | NEW |
| `GAME-04` | 2D classic board viewport | player | F04 | P0 | PR2 |
| `GAME-05` | Card / dice board and private hand | player | F04 | P1 | PR2 |
| `GAME-06` | Eco City Lab 3D viewport | player/student | F05 | P0 | PR2 |
| `GAME-07` | Building card deck & 3D inspector | player/student | F05 | P0 | NEW |
| `GAME-08` | Team proposal, vote and co-op HUD | team/player | F05 | P0 | NEW |
| `GAME-09` | Turn history / rules help / quick chat drawer | player | F04/F08 | P0 | NEW |
| `GAME-10` | Match result / next play / rewards | player | F04/F12 | P0 | PR2 |
| `GAME-11` | Replay viewer / timeline | player/referee | F04/F10 | P1 | NEW |
| `GAME-12` | Disconnect, pause, reconnect and restore | player | F03/F04 | P0 | NEW |
| `GAME-13` | Game report / appeal and evidence | player/referee | F10/F18 | P1 | NEW |
| `GAME-14` | World save slots / continue city | player/student | F05 | P1 | NEW |
| `GAME-15` | No-WebGL / low quality game fallback | player | F05 | P0 | NEW |

## LEARN / Education (14)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `EDU-01` | Student learning dashboard | student | F06 | P1 | PR2 |
| `EDU-02` | Assignment detail & submission | student | F06 | P1 | PR2 |
| `EDU-03` | Student private feedback and progression | student | F06 | P1 | NEW |
| `EDU-04` | Teacher overview dashboard | teacher | F07 | P1 | PR2 |
| `EDU-05` | Org/class list and roster | teacher/admin | F07 | P1 | NEW |
| `EDU-06` | Create/edit classroom & invite codes | teacher | F07 | P1 | NEW |
| `EDU-07` | Student group builder and role assignment | teacher | F07 | P1 | NEW |
| `EDU-08` | Curriculum / game-learning alignment | teacher | F07 | P1 | NEW |
| `EDU-09` | Assignment authoring / rubric configuration | teacher | F07 | P1 | PR2 |
| `EDU-10` | Teacher live classroom monitor | teacher | F07 | P1 | PR2 |
| `EDU-11` | Evidence review and rubric grading | teacher | F07 | P1 | NEW |
| `EDU-12` | Learning reports and exports | teacher/org admin | F07 | P1 | NEW |
| `EDU-13` | Class archive and academic-year rollover | teacher/admin | F07 | P2 | NEW |
| `EDU-14` | Guardian progress view (policy gated) | guardian | F06/F18 | P2 | NEW |

## CONNECT / Social (9)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `SOC-01` | Team directory / invitations | player/student | F08 | P1 | PR2 |
| `SOC-02` | Team hub / roster / roles / group votes | team member | F08 | P1 | NEW |
| `SOC-03` | Class/team safe chat inbox | member | F08 | P1 | PR2 |
| `SOC-04` | Game-room quick chat / report | player | F04/F08 | P0 | NEW |
| `SOC-05` | Community topic/channel directory | permitted user | F08 | P2 | PR2 |
| `SOC-06` | Community post / approved showcase | permitted user | F08 | P2 | NEW |
| `SOC-07` | Friends/contacts (restricted for minors) | player | F08 | P2 | NEW |
| `SOC-08` | Report/block/mute dialog | player/student | F08 | P1 | NEW |
| `SOC-09` | User notification inbox | user | F17 | P0 | NEW |

## COMPETE / Event / Ranking (14)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `CMP-01` | Event directory and calendar | public/eligible user | F09 | P1 | PR2 |
| `CMP-02` | Event detail / eligibility / schedule | eligible user | F09 | P1 | PR2 |
| `CMP-03` | Event registration and team selection | player/team | F09 | P1 | NEW |
| `CMP-04` | Event check-in / waiting list / timetable | participant | F09 | P1 | NEW |
| `CMP-05` | Tournament list & division filter | player | F10 | P1 | NEW |
| `CMP-06` | Tournament detail, format and rules | player | F10 | P1 | NEW |
| `CMP-07` | Tournament bracket / fixture view | participant/spectator | F10 | P1 | PR2 |
| `CMP-08` | Match referee review / dispute status | referee/participant | F10 | P1 | NEW |
| `CMP-09` | Multi-dimensional leaderboard | eligible users | F10 | P1 | PR2/PR3 |
| `CMP-10` | Leaderboard history / score policy info | eligible users | F10 | P1 | NEW |
| `CMP-11` | Hall of Fame / honors gallery | public policy-filtered | F11 | P1 | PR3 |
| `CMP-12` | Honor detail / evidence / share settings | honored user | F11 | P1 | NEW |
| `CMP-13` | Achievements & trophy collection | user | F11/F12 | P1 | PR3 |
| `CMP-14` | Season hub / quest tracker | player/student | F12/F17 | P1 | NEW |

## COLLECT / Shop / Avatar (14)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `COL-01` | Official cosmetic shop | eligible user | F13 | P1 | PR3 |
| `COL-02` | Item detail, permissions, preview | eligible user | F13 | P1 | PR3 |
| `COL-03` | Purchase confirmation / receipt | buyer | F13 | P1 | NEW |
| `COL-04` | Wallet / credits history | account owner | F13 | P1 | NEW |
| `COL-05` | Inventory / wardrobe and filters | owner | F14 | P1 | PR3 |
| `COL-06` | Avatar designer / rig and item slots | owner | F14 | P1 | PR3 |
| `COL-07` | Pet manager and emotes | owner | F14 | P2 | PR3 |
| `COL-08` | Outfit presets / saved looks | owner | F14 | P1 | NEW |
| `COL-09` | Profile frame/background customization | owner | F14 | P1 | NEW |
| `COL-10` | Seasonal collection / bundles | eligible user | F13/F17 | P2 | NEW |
| `COL-11` | Player Marketplace listings | eligible adult | F15 | P2 | PR3 |
| `COL-12` | Create listing and item escrow | eligible adult | F15 | P2 | NEW |
| `COL-13` | My listings / trade history | eligible adult | F15 | P2 | PR3 |
| `COL-14` | Trade disputes and hold notices | buyer/seller | F15/F18 | P2 | NEW |

## CODE / Coding Arena (8)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `CODE-01` | Coding challenge directory | user/student | F16 | P2 | PR2 |
| `CODE-02` | Coding problem detail & constraints | user/student | F16 | P2 | NEW |
| `CODE-03` | Blockly editor and simulation | learner | F16 | P2 | PR2 |
| `CODE-04` | Text editor, language and console | coder | F16 | P2 | PR2 |
| `CODE-05` | Submission verdict / tests / feedback | coder | F16 | P2 | NEW |
| `CODE-06` | Submission history and compare | coder | F16 | P2 | NEW |
| `CODE-07` | Coding contest rankings / schedule | participant | F16/F10 | P2 | NEW |
| `CODE-08` | Problem editor & hidden test QA | author/admin | F16 | P2 | NEW |

## OPERATE / Admin + MCP (23)

| ID | Screen / workspace | Role | Flow | Priority | Provenance |
|---|---|---|---|---|---|
| `OPS-01` | Platform operations overview | admin | F18/F19 | P1 | PR2 |
| `OPS-02` | User, org and role admin | admin/org admin | F01/F18 | P0 | NEW |
| `OPS-03` | Game catalog + release manager | game publisher | F02/F20 | P1 | PR2 |
| `OPS-04` | Asset library / Blockbench GLB preview | asset editor | F05/F14 | P1 | PR2 |
| `OPS-05` | CMS page editor and preview | content manager | F17 | P1 | PR2 |
| `OPS-06` | Theme/Campaign calendar + publishing | content manager | F17 | P1 | PR2 |
| `OPS-07` | Event organizer workspace | organizer | F09 | P1 | NEW |
| `OPS-08` | Tournament director + referee console | director/referee | F10 | P1 | NEW |
| `OPS-09` | Ranking scoring policies / recompute console | ranking admin | F10 | P1 | NEW |
| `OPS-10` | Honor nomination / publication review | editor/referee | F11 | P1 | PR3 |
| `OPS-11` | Shop offers / item catalog / approvals | economy admin | F13 | P1 | PR3 |
| `OPS-12` | Economy reconciliation & suspicious trades | economy/safety | F13/F15 | P2 | NEW |
| `OPS-13` | Chat/community moderation queue | moderator | F08 | P1 | PR2 |
| `OPS-14` | AI Operations / MCP tools and agents | AI operator | F19 | P0 | PR2 |
| `OPS-15` | Automation workflows / schedules | AI operator | F19 | P0 | NEW |
| `OPS-16` | Approval inbox / diff and artifact preview | approver | F19 | P0 | NEW |
| `OPS-17` | AI execution / audits / rollback | AI operator/auditor | F19 | P0 | NEW |
| `OPS-18` | System monitoring / deploy logs / backups | ops engineer | F18/F19 | P1 | NEW |
| `OPS-19` | Support ticket case view | support | F18 | P1 | NEW |
| `OPS-20` | Privacy/guardian rights requests | privacy officer | F18 | P1 | NEW |
| `OPS-21` | Notification/template/sending approval | messaging admin | F17 | P1 | NEW |
| `OPS-22` | Feature flags and rollout rules | product ops | F17 | P1 | NEW |
| `OPS-23` | Creator Studio publication moderation | publisher/moderator | F20 | P2 | NEW |

## Core cross-screen states
Every primary screen requires: default, loading, empty, error, offline/reconnect when relevant, forbidden/age-limited, expired/suspended, and a success/confirmation state for writes. Shared accessible components should resolve these centrally, not duplicate arbitrary UI.

## Visual deliverables and gating
- **Wave A / P0 visuals**: SH-03, SH-05, SH-07, SH-08, PUB-01, PUB-02, PUB-03, GAME-01, GAME-02, GAME-04, GAME-06, GAME-10, OPS-14, OPS-16 plus error/reconnect. Full responsive views at 1440/1024/390 and tablet landscape for game.
- **Wave B**: teacher dashboard/live class, events/brackets/rank, Hall of Fame, Shop, Inventory/Avatar, CMS and AI workflows. Do not build these without role/permission and states spec.
- **Wave C**: coding editor, player marketplace, creator tools and advanced guardian features after domain approval.
- Treat **PR #2 KingDragonHub Design Language** as upstream style proposal and **PR #3 Economy PRD** as upstream product proposal. After merge, reconcile screen IDs and routes to avoid dupe specs.

## Additional functional shell requirements
1. Site-wide account + active tenant context indicator and accessible logout.
2. Deep-link and invitation URL routing; accessible mode fallback for WebGL.
3. Unified search across game/event/content, permission-filtered.
4. Responsive notification center with seen/read and preference controls.
5. Dedicated no-access, parental/guardian and school policy explainer UX.
6. Escalation path from game error/shop error/competition dispute to support.
7. Safe profile visibility and user data export/deletion requests.
8. Design token governance: KingDragonHub #FF5722 accent with accessible CTA shades; validate official font/CSS source before pixel-perfect claims.

## P0 design QA
Every new route has named actor and authorization; focus order, keyboard/touch parity, localization of dates/currencies/labels, contrast testing, reduced motion, responsive loading/error states, security and minor privacy. No Agent may treat a table row as a finished high-fidelity visual.
