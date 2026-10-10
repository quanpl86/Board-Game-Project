#!/usr/bin/env python3
"""Static checks for BGU AI Agent/Skill Operating System (stdlib only).

This checks structure, not AI behavior, tool permissions or security in production.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
issues = []
def fail(reason):
    issues.append(reason)

def read_json(p):
    try:
        return json.loads((ROOT / p).read_text(encoding="utf-8"))
    except Exception as e:
        fail(f"{p}: cannot read JSON: {e}")
        return {}

skills = read_json("docs/agents/SKILL_REGISTRY.json").get("skills", [])
roles = read_json("docs/agents/AGENT_REGISTRY.json").get("roles", [])
skill_ids = [x.get("id") for x in skills]
role_ids = [x.get("id") for x in roles]
if len(skills) < 25:
    fail(f"Expected at least 25 core skills, found {len(skills)}")
if len(roles) < 18:
    fail(f"Expected at least 18 role prompts, found {len(roles)}")
if len(skill_ids) != len(set(skill_ids)):
    fail("Duplicate skill IDs")
if len(role_ids) != len(set(role_ids)):
    fail("Duplicate role IDs")

required_sections = (
    "## Activate for",
    "## Read before acting",
    "## Execution procedure",
    "## Non-negotiable rules",
    "## Required output artifacts",
    "## Validation / Definition of Done",
    "## Handoff"
)
for item in skills:
    name = item.get("id", "")
    role = item.get("owner_role", "")
    path = item.get("path", "")
    if not re.fullmatch(r"[a-z][a-z0-9-]*", name):
        fail(f"Invalid skill id: {name}")
    if path != f".agents/skills/{name}/SKILL.md":
        fail(f"{name}: unexpected skill path: {path}")
    f = (ROOT / path).resolve()
    if not f.is_relative_to(ROOT) or not f.is_file():
        fail(f"{name}: missing skill file {path}")
        continue
    txt = f.read_text(encoding="utf-8")
    if not txt.startswith("---\n"):
        fail(f"{name}: missing YAML-style frontmatter")
        continue
    seg = txt.split("---\n", 2)
    if len(seg) < 3:
        fail(f"{name}: incomplete frontmatter")
        continue
    meta = {}
    for line in seg[1].splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for key in ("name", "description", "version", "owner_role"):
        if not meta.get(key):
            fail(f"{name}: empty {key} frontmatter")
    if meta.get("name") != name or meta.get("owner_role") != role:
        fail(f"{name}: registry/frontmatter mismatch")
    if role not in role_ids:
        fail(f"{name}: unknown role {role}")
    for head in required_sections:
        if head not in txt:
            fail(f"{name}: missing section '{head}'")
    if len(txt) < 1100:
        fail(f"{name}: too short to be actionable")

for item in roles:
    rid = item.get("id", "")
    path = item.get("role_prompt", "")
    if not re.fullmatch(r"BGU-[A-Z0-9-]+", rid):
        fail(f"Invalid role id {rid}")
    if path != f".agents/roles/{rid.lower()}.md":
        fail(f"{rid}: unexpected role path {path}")
    f = (ROOT / path).resolve()
    if not f.is_relative_to(ROOT) or not f.is_file():
        fail(f"{rid}: missing role prompt {path}")
        continue
    txt = f.read_text(encoding="utf-8")
    if not txt.startswith("---\n") or "## Hard permission boundary" not in txt or "## Handoff / independent reviewer" not in txt:
        fail(f"{rid}: missing required role structure")
    for sk in item.get("skill_ids", []):
        if sk not in skill_ids:
            fail(f"{rid}: unknown skill {sk}")
    if item.get("production_authority") is not False:
        fail(f"{rid}: production authority must be explicitly false")

actual_skill_paths = {str(f.relative_to(ROOT)) for f in (ROOT / ".agents/skills").glob("*/SKILL.md")}
registered_paths = {x.get("path") for x in skills}
if actual_skill_paths != registered_paths:
    fail(f"Skill filesystem/registry diff: unregistered={sorted(actual_skill_paths-registered_paths)}, missing={sorted(registered_paths-actual_skill_paths)}")
actual_role_paths = {str(f.relative_to(ROOT)) for f in (ROOT / ".agents/roles").glob("bgu-*.md")}
registered_role_paths = {x.get("role_prompt") for x in roles}
if actual_role_paths != registered_role_paths:
    fail(f"Role filesystem/registry diff: unregistered={sorted(actual_role_paths-registered_role_paths)}, missing={sorted(registered_role_paths-actual_role_paths)}")

for required in [
    "AGENTS.md", "docs/agents/OPERATING_CHARTER.md",
    "docs/agents/PROJECT_DIRECTOR_RUNBOOK.md", "docs/agents/QUALITY_GATES.md",
    "docs/agents/AGENT_EVALUATION_SUITE.md",
    "docs/agents/templates/TASK_BRIEF.md",
    "docs/agents/templates/WEEKLY_REPORT.md",
]:
    if not (ROOT / required).is_file():
        fail(f"Required file missing: {required}")

print(f"Validated {len(skills)} skill specs and {len(roles)} role prompts; issues={len(issues)}")
for issue in issues:
    print(f"ERROR: {issue}")
sys.exit(1 if issues else 0)
