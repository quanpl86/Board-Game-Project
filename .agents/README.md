# Board Game Universe AI Agents
**Status:** Proposed reusable role prompts and skills stored in repository. Skills are not automatically loaded by ChatGPT or other runtimes without an approved adapter.

- `roles/`: 18 role-specific standing instructions including delivery manager, DBA, UX/UI, Copy, Image, Video, Blockbench/3D, Security, Game, Coding, MCP and DevOps.
- `skills/<id>/SKILL.md`: 25 concrete specialist workflows with frontmatter, input requirements, procedures, forbidden operations, output proofs and acceptance checks.
- Registry: `docs/agents/AGENT_REGISTRY.json`, `docs/agents/SKILL_REGISTRY.json`.
- Governance: `docs/agents/README.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.
- Static validation: `python scripts/validate_agent_pack.py`.

## Safe activation contract
Load root `AGENTS.md` + charter + task brief; select executor role and smallest relevant skill set from router. Attach author identity, tenant, permission and approved tool subset. Output branch/PR/artifacts and test proof, not production mutation. Never treat this directory as proof that a server-side task scheduler or Project Director is already running.
