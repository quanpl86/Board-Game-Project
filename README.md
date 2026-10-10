# Board Game Universe · AI-native Multi-Game Platform

> **Foundation Alpha in progress:** Next.js Game Hub preview, Fastify demo API, disabled Realtime/MCP stubs, local Docker and CI are proposed in PR. See [Phase 1 Bootstrap](docs/implementation/PHASE1_BOOTSTRAP.md). No real match, authenticated account, DB migration or production deployment yet.

**Status: PLANNING / DESIGN BASELINE — chưa triển khai ứng dụng production**  
**Scope:** Classic Board Games · STEM / Education · 3D Simulation · Coding Challenges · Multiplayer · Social · Tournaments · LiveOps · MCP & AI Agents  
**Primary language:** Tiếng Việt · **Repository owner:** `quanpl86`

> Repository là nguồn tham chiếu duy nhất (single source of truth) cho mã nguồn **và** đặc tả được phê duyệt của dự án. Tài liệu trong `docs/` là đề xuất kiến trúc, không chứng minh tính năng đã được phát triển hay kiểm thử.

## Vision

Một tài khoản có thể chơi các board game cổ điển, tham gia thử thách lập trình, cùng đội xây dựng thành phố 3D, học STEM trong lớp, tham gia giải đấu và chia sẻ dự án. Quản trị viên dùng CMS + Automation + MCP/AI Agent để vận hành game catalog, content, assets, event, notification, season, community và hệ thống release.

## Architecture baseline

- **Frontend:** Next.js + React + TypeScript, Tailwind, React Three Fiber / Three.js cho game 3D, SVG/Canvas/PixiJS khi game 2D cần.
- **Backend:** TypeScript modular monolith, API/permissions theo bounded context; PostgreSQL là nguồn dữ liệu bền vững.
- **Realtime:** Authoritative Game Server qua WebSocket, game rules versioned, phòng/trận riêng, replay/snapshot/reconnect.
- **Assets:** Blockbench `.bbmodel` → GLB / glTF + optimized textures → versioned object storage/CDN.
- **Coding challenges:** Block-based editor và text coding, judge worker cô lập, không chạy mã người dùng trong API/game server tin cậy.
- **AI-native operation:** MCP gateway + typed tools + Agent Identity + approval + durable automation + audit logs.
- **LiveOps:** CMS/Page Builder, campaign, theme, event, season, notification, leaderboard, rewards được quản lý qua cấu hình có version và lịch.

## Tài liệu chính

| Nhóm | Tài liệu |
|---|---|
| Project overview | [Project Charter](docs/project/PROJECT_CHARTER.md) · [Documentation Index](docs/README.md) |
| Product | [Master Platform Blueprint](docs/product/MASTER_PLATFORM_BLUEPRINT.md) · [Feature Matrix](docs/product/FEATURE_REQUIREMENTS_MATRIX.md) |
| Database | [Data Dictionary](docs/architecture/DATABASE_DATA_DICTIONARY.md) · [SQL Starter](docs/architecture/SCHEMA_STARTER.sql) |
| AI / MCP | [Control Plane](docs/ai-mcp/MCP_AI_AGENT_CONTROL_PLANE.md) · [Tools & Permissions](docs/ai-mcp/MCP_TOOL_CATALOG_AND_PERMISSIONS.md) · [Automation Recipes](docs/ai-mcp/MCP_AUTOMATION_WORKFLOW_RECIPES.md) |
| Education | [Education PRD](docs/education/BOARD_GAME_EDUCATION_PRD.md) · [Education Master Plan](docs/education/BOARD_GAME_EDUCATION_MASTER_PLAN.md) |
| Game Design | [Game Catalog](docs/games/GAME_CATALOG_AND_ROADMAP.md) · [Eco City Lab 3D](docs/games/eco-city-lab/README.md) |
| Social / LiveOps | [Community & Tournament](docs/social/SOCIAL_COMMUNITY_TOURNAMENT.md) · [Dynamic Content & Campaigns](docs/liveops/LIVEOPS_CONTENT_STRATEGY.md) |
| Rankings & Honors | [Leaderboard / Hall of Fame](docs/competition/LEADERBOARD_HALL_OF_FAME_SPEC.md) |
| Cosmetic Economy | [Shop & Marketplace PRD](docs/economy/ECONOMY_SHOP_MARKETPLACE_PRD.md) · [Economy Data Model](docs/economy/ECONOMY_INVENTORY_DATA_MODEL.md) · [MCP & Automation](docs/economy/MCP_AGENT_AND_GOVERNANCE.md) |
| Player Customization | [Avatar & Blockbench 3D Items](docs/avatars/AVATAR_ITEM_AND_3D_ASSET_SPEC.md) · [Shop/Avatar UI UX](docs/economy/SHOP_AVATAR_UI_UX.md) |
| Delivery | [Master Roadmap](docs/roadmap/MASTER_ROADMAP.md) · [Repository Governance](docs/governance/REPOSITORY_GOVERNANCE.md) |
| Automation | [AGENTS.md](AGENTS.md) · [AI Repository Rules](docs/ai-mcp/AI_AGENT_REPOSITORY_RULES.md) |
| Agent Operating System | [18 Roles / 25 Skills](docs/agents/README.md) · [Project Director](docs/agents/PROJECT_DIRECTOR_RUNBOOK.md) · [Skill Router](docs/agents/SKILL_ROUTER.md) · [Quality Gates](docs/agents/QUALITY_GATES.md) |

## Delivery workflow

`Idea → PRD/GDD → ADR & Contracts → Issue → Branch → PR → CI & Review → Staging → Approval → Release → Monitor`

**Governance:** Không push trực tiếp main cho thay đổi nghiệp vụ; không commit secrets, tài liệu có dữ liệu học sinh thật, license không rõ nguồn; game/match/ranking/campaign có version. Xem [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md).

## Repository state

Repo mới được chuẩn bị làm **documentation-first baseline**. Những thư mục `apps/`, `packages/`, `games/` là chỗ dành cho mã nguồn tương lai, chưa có sản phẩm chạy thực tế. Điều chỉnh sau khi thẩm định architecture spike và thông qua ADR.