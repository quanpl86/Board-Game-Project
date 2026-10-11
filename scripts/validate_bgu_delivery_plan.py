#!/usr/bin/env python3
"""Static contract checks for proposed BGU-PD delivery ledger (no live GitHub claims)."""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
PATH = ROOT / "docs/agents/delivery/BGU_PD_WORK_PACKAGES_2026-10-11.json"
ROLE_FILE = ROOT / "docs/agents/AGENT_REGISTRY.json"

def check(data, roles):
    errors = []
    if data.get("status") != "proposal" or data.get("authority") != "not_approved_scope_or_milestone":
        errors.append("Ledger must remain a non-approved proposal until human sign-off")
    if data.get("existing_master_roadmap_unmodified") is not True:
        errors.append("Existing master roadmap must remain unchanged")
    if data.get("timezone") != "Asia/Ho_Chi_Minh":
        errors.append("Local timezone missing")
    items = data.get("work_packages", [])
    if not isinstance(items, list) or len(items) < 10:
        errors.append("Expected a non-trivial list of delivery work packages")
        return errors
    registry_roles = {x["id"] for x in roles.get("roles", [])}
    ids = [x.get("id") for x in items]
    if len(ids) != len(set(ids)):
        errors.append("Duplicate work-package IDs")
    idset = set(ids)
    valid_status = {"PROPOSED", "DRAFT", "IN_PR", "MERGED", "STAGING_VERIFIED", "PRODUCTION_VERIFIED", "BLOCKED"}
    sprints = {x.get("id") for x in data.get("sprints", [])}
    for row in items:
        name = row.get("id", "?")
        if not re.fullmatch(r"WP-\d{2}", str(name)):
            errors.append(f"{name}: invalid identifier")
        for key in ("title", "source", "owner_role", "reviewer_role", "risk", "acceptance", "blocker"):
            if not row.get(key):
                errors.append(f"{name}: missing {key}")
        if row.get("status") not in valid_status:
            errors.append(f"{name}: invalid status")
        if row.get("proposed_sprint") not in sprints:
            errors.append(f"{name}: sprint missing")
        if row.get("risk") not in {"R0","R1","R2","R3","R4"}:
            errors.append(f"{name}: risk invalid")
        if row.get("verified_runtime") is not False and row.get("assigned_github_user") is None:
            errors.append(f"{name}: cannot claim runtime with no verified assignee")
        for field in ("owner_role", "reviewer_role"):
            for role in re.findall(r"BGU-[A-Z]+", row.get(field, "")):
                if role not in registry_roles:
                    errors.append(f"{name}: unregistered role {role}")
        for dep in row.get("depends_on", []):
            if dep not in idset or dep == name:
                errors.append(f"{name}: invalid/self dependency {dep}")
    graph = {x["id"]: x.get("depends_on", []) for x in items if x.get("id")}
    in_stack, visited = set(), set()
    def dfs(node):
        if node in in_stack:
            errors.append(f"Dependency cycle at {node}")
            return
        if node in visited:
            return
        in_stack.add(node)
        for dep in graph.get(node, []):
            if dep in graph:
                dfs(dep)
        in_stack.remove(node)
        visited.add(node)
    for name in graph:
        dfs(name)
    return errors

def main():
    try:
        data = json.loads(PATH.read_text(encoding="utf-8"))
        roles = json.loads(ROLE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        print(f"ERROR: {error}")
        return 1
    errors = check(data, roles)
    for item in errors:
        print("ERROR:", item)
    print(f"BGU-PD delivery plan static validation: packages={len(data.get('work_packages', []))} errors={len(errors)}")
    print("NOTE: static validation does not check GitHub PR/CI, deployed systems or Agent runtime")
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main())
