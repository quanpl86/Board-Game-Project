#!/usr/bin/env python3
"""Read-only P1-A Education migration parity, forbidden grants/policies, FK safeguards."""
import json
import pathlib
import re
ROOT=pathlib.Path(__file__).resolve().parents[1]
p1=json.loads((ROOT/"db/schema/p1_candidate_tables.json").read_text("utf8"))
sql=(ROOT/"db/migrations/0002_p1a_education_candidate.sql").read_text("utf8")
tables=[x for x in p1["tables"] if x["domain"]=="education"]
errors=[]
for t in tables:
    pat=r"CREATE TABLE\s+"+re.escape(t["id"])+r"\s*\((.*?)\n\);"
    m=re.search(pat,sql,re.S)
    if not m:errors.append("missing table "+t["id"]);continue
    for c in t["columns"]:
        if not re.search(r"\b"+re.escape(c["name"])+r"\s+"+re.escape(c["type"]),m.group(1)):
            errors.append(f"missing field {t['id']}.{c['name']}")
    for mode in ("ENABLE","FORCE"):
        if f"ALTER TABLE {t['id']} {mode} ROW LEVEL SECURITY;" not in sql:
            errors.append(f"{t['id']} no {mode} RLS")
if len(tables)!=11:errors.append("Expected 11 Education contracts")
if len(re.findall(r"CREATE TABLE education\.",sql))!=11:errors.append("SQL must create exactly 11 Education tables")
if re.search(r"\bCREATE\s+POLICY\b|\bGRANT\s+(?:ALL|SELECT|INSERT|UPDATE|DELETE)\b|\bDROP\s+(?:TABLE|SCHEMA)\b",sql,re.I):
    errors.append("SQL contains unexpected policy/grant/destructive DDL")
required=[
 "class_term_same_org","assignment_rubric_lesson_consistency",
 "edu_attempt_scope","edu_grade_consistency","edu_evidence_append_only","edu_assessment_append_only",
 "edu_assignment_pins","edu_criteria_immutable"
]
for item in required:
    if item not in sql:errors.append("missing guard "+item)
if "FORCE ROW LEVEL SECURITY" not in sql or "COMMIT;" not in sql: errors.append("unsafe incomplete migration")
print(f"P1-A static parity: {len(tables)} tables, guard checks, errors={len(errors)}")
for e in errors:print("ERROR:",e)
raise SystemExit(bool(errors))
