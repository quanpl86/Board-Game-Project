# Board Game Universe — Document Index
**Baseline:** 2026-10-09 · **Status:** architecture & product drafts; not implemented.

## Project & Product
- [Project charter](project/PROJECT_CHARTER.md)
- [Platform blueprint](product/MASTER_PLATFORM_BLUEPRINT.md)
- [Feature requirements matrix](product/FEATURE_REQUIREMENTS_MATRIX.md)
- [Game catalog](games/GAME_CATALOG_AND_ROADMAP.md)
- [Education PRD](education/BOARD_GAME_EDUCATION_PRD.md)
- [Education master plan](education/BOARD_GAME_EDUCATION_MASTER_PLAN.md)

## Architecture & governance
- [Database data dictionary](architecture/DATABASE_DATA_DICTIONARY.md)
- [PostgreSQL schema starter](architecture/SCHEMA_STARTER.sql) (illustrative, not production-ready)
- [Architecture decision ADR-0001](architecture/adr/0001-platform-architecture.md)
- [Repository governance](governance/REPOSITORY_GOVERNANCE.md)
- [Document policy](governance/DOCUMENT_GOVERNANCE.md)
- [Infrastructure & security](operations/INFRASTRUCTURE_AND_SECURITY.md)

## AI / MCP / Automation
- [MCP & AI Agent Control Plane](ai-mcp/MCP_AI_AGENT_CONTROL_PLANE.md)
- [MCP Tool Catalog / Permissions](ai-mcp/MCP_TOOL_CATALOG_AND_PERMISSIONS.md)
- [Automation logical data model](ai-mcp/AI_AUTOMATION_DATA_MODEL.md)
- [Automation workflow recipes](ai-mcp/MCP_AUTOMATION_WORKFLOW_RECIPES.md)
- [AI Agent repository rules](ai-mcp/AI_AGENT_REPOSITORY_RULES.md)
- [AI SQL reference](ai-mcp/AI_CONTROL_PLANE_SCHEMA_STARTER.sql)
- [MCP bootstrap](ai-mcp/MCP_BOOTSTRAP_CHECKLIST.md)

## Games, Social & LiveOps
- [Eco City Lab GDD](games/eco-city-lab/GDD.md)
- [Eco City Lab 3D assets](games/eco-city-lab/3D_ASSET_AND_RUNTIME_SPEC.md)
- [Eco City Lab deployment](games/eco-city-lab/INFRASTRUCTURE_AND_STORAGE.md)
- [Social & tournaments](social/SOCIAL_COMMUNITY_TOURNAMENT.md)
- [LiveOps & dynamic content](liveops/LIVEOPS_CONTENT_STRATEGY.md)
- [Master roadmap](roadmap/MASTER_ROADMAP.md)

## Editing policy
Change documentation by reviewed PR; publish a new ADR for major decisions; keep archived v1.0 read-only; remove secrets and personal student data. AI Agents use scoped MCP tools and explicit approval for production writes.
