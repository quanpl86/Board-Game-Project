# Screen Inventory & UX Navigation — Board Game Universe
**Status:** Screen design backlog, not high-fidelity artwork
**Canonical shell:** KingDragonHub visual language
**Target:** player, student, teacher, organizer, moderator and platform admin.

## IA and production route draft
- `/board-games`: Game Hub landing with host-site navigation.
- `/board-games/games`: discover and filter games.
- `/board-games/games/[slug]`: detail and onboarding.
- `/board-games/rooms/[roomId]`: lobby.
- `/board-games/play/[matchId]`: actual game viewport.
- `/board-games/education`: education landing.
- `/board-games/classroom`: teacher/school space gated by role.
- `/board-games/teams`, `/board-games/messages`: social space.
- `/board-games/events`, `/board-games/tournaments`, `/board-games/rankings`: competition.
- `/board-games/coding`: coding arena.
- `/board-games/admin`: restricted admin/AI Control Center.
All routes are **proposals**, need audit against KingDragonHub host route ownership before deployment.

## Screen requirements backlog
| ID | Area / screen | Core sections | Desktop / tablet / phone | Priority |
|---|---|---|---|---|
| P-01 | Landing / Game Hub | host header, branded hero, featured games, genre tiles, upcoming events | ✓ / ✓ / ✓ | P0 |
| P-02 | Game Library | fulltext search, filters, genre, sorted grid | ✓ / ✓ / ✓ | P0 |
| P-03 | Game Detail | cover, players/time, rules, tutorials, choose play mode | ✓ / ✓ / ✓ | P0 |
| P-04 | Profile | privacy-safe nickname, recent games, badges | ✓ / ✓ / ✓ | P1 |
| G-01 | Create/Join Room | mode, invite code, team roster, game options | ✓ / ✓ / ✓ | P0 |
| G-02 | Turn-based 2D Board | board, move clock, player info, action and game log | ✓ / ✓ / ✓ | P0 |
| G-03 | Eco City Lab 3D | main isometric scene, resource HUD, building card deck, inspector, chat/vote | ✓ / ✓ / adapted | P0 |
| G-04 | Card/Dice Game | board, hand, hidden information, player turns, dice tray | ✓ / ✓ / ✓ | P1 |
| G-05 | Results & Replay | outcome, learning score separate, replay, next game | ✓ / ✓ / ✓ | P0 |
| E-01 | Student Portal | current assignments, progress, safe join | ✓ / ✓ / ✓ | P1 |
| E-02 | Teacher Dashboard | classes, assignments, recent evidence, quick start | ✓ / ✓ / ✓ | P1 |
| E-03 | Live Classroom | room groups, status, pause, intervention | ✓ / ✓ / adapted | P1 |
| E-04 | Assignment & Rubric | configure tasks/standards, score, feedback | ✓ / ✓ / adapted | P1 |
| S-01 | Team Directory | team membership, invites, roles | ✓ / ✓ / ✓ | P1 |
| S-02 | Chat | group/class/room channels, quick chat, moderation | ✓ / ✓ / ✓ | P1 |
| S-03 | Community Feed | topic, showcase, moderated post | ✓ / ✓ / ✓ | P2 |
| T-01 | Event Library | active/upcoming, filtering, registration | ✓ / ✓ / ✓ | P1 |
| T-02 | Event Detail | rules, eligibility, timeline, participant enrollment | ✓ / ✓ / ✓ | P1 |
| T-03 | Tournament Bracket | stage tabs, pairing table, match results | ✓ / ✓ / adapted | P1 |
| T-04 | Leaderboards | period, category, game, school, team filters | ✓ / ✓ / ✓ | P1 |
| C-01 | Coding Challenge Directory | skill tier, topic, test type | ✓ / ✓ / ✓ | P2 |
| C-02 | Block Editor | toolbox, workspace, simulation, feedback | ✓ / ✓ / adapted | P2 |
| C-03 | Text Code Arena | source, console, tests, submit, hints | ✓ / ✓ / adapted | P2 |
| A-01 | Platform Control Center | KPIs, ops/alerts, pending approvals | ✓ / ✓ / adapted | P1 |
| A-02 | Game Registry / Assets | versions, asset preview, release workflow | ✓ / ✓ / adapted | P1 |
| A-03 | CMS + Theme Studio | design-token preview, campaign schedule, page blocks | ✓ / ✓ / adapted | P1 |
| A-04 | AI Ops / MCP Console | tools, Agent runs, approvals, audit, automation calendar | ✓ / ✓ / adapted | P1 |
| A-05 | Safety & Moderation | queues, cases, action history | ✓ / ✓ / adapted | P1 |

## P0 visual approval package
Eight reference screens must be designed and reviewed **before** independent AI agents implement product UI at scale:
1. Game Hub landing.
2. Game Library search and filter.
3. Game Detail page.
4. Private lobby / invitation.
5. 2D Gomoku board.
6. Eco City Lab 3D gameplay.
7. Teacher Dashboard.
8. Admin + MCP Operations overview.
Additional Event/Leaderboard screen becomes ninth priority if competition development starts alongside P0.

## Each screen must specify
Purpose, user roles/rights, responsive frames (1440 desktop / 1024 tablet / 390 phone), layout measurements, components and variants, page states (loading/empty/error/success/permission), keyboard/touch behavior, privacy, interaction and acceptance criteria. Do not claim all visuals completed merely because the inventory exists.

## Proposed user paths
Public: host site → Game Hub → Game Detail → Play Mode → Lobby → Match → Results → Replay.
Education: teacher login → Class → Assignment → Session code → Student join → Active game → Evidence → Rubric.
LiveOps: admin → Campaign Draft → Preview → Review → Schedule → Publish → Expire/Restore baseline.
MCP: operator instruction → agent draft → diff/preview → approval → scheduled job → audit.
