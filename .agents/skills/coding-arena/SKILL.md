---
name: coding-arena
description: Design Blockly/text coding problems, robot games and safe judge workflows with reproducible tests, versioned workspaces and sandbox execution boundaries.
version: 1.0.0
owner_role: BGU-EDU
---

# Skill: coding-arena
**Purpose:** Design Blockly/text coding problems, robot games and safe judge workflows with reproducible tests, versioned workspaces and sandbox execution boundaries.

## Activate for
Blockly, Scratch-like programming, coding challenge, algorithm, test cases, judge, Python, JavaScript

## Read before acting
- `docs/product/END_TO_END_APP_FLOWS_V2.md`
- `docs/ai-mcp/MCP_AI_AGENT_CONTROL_PLANE.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Specify problem learning objective, allowed language(s), versioned statement/sample cases, hidden tests, seed, scoring and timeout/memory limits.
2. For Blockly save original XML/JSON workspace + block schema + generator/version, not only generated JS; simulation UI shows understandable step-by-step robot state.
3. Use pure game simulator for previews with quota; server submitted code goes through isolated sandbox judge with hardened user/network/filesystem limits.
4. Maintain separate submission, judge_run and per-test verdict, environment image hash and problem/test revision; audit rejudge to avoid overwriting original evidence.
5. Handle TLE/MLE/RE/WA/AC with friendly Vietnamese feedback, hints appropriate for age and private teacher evidence where appropriate.
6. Protect hidden test cases and scoring from client and generic AI prompts; add plagiarism review and rate limiting for contests.
7. Threat-test sandbox escape and resource exhaustion; require human security approval before public remote code execution.

## Non-negotiable rules
- Never eval untrusted code inside Next.js, API, game server or unrestricted container.
- Do not leak hidden test data or solution in public frontend.
- Generated code is not authoritative until judge validates.
- Rejudge changes have versioned, contest-auditable effects.

## Required output artifacts
- Problem and test specification
- Blockly workspace schema and runner contract
- Sandbox threat tests
- Contest and rubric acceptance

## Validation / Definition of Done
- [ ] Deterministic public/hidden judge tests
- [ ] No network/secret access from sandbox
- [ ] Submission history and rejudge preserved

## Handoff
Use `docs/agents/templates/HANDOFF.md`; cross-domain changes require affected skill/owner and independent human approval at risk R3/R4.
