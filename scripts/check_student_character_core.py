#!/usr/bin/env python3
"""Check P1-D Student/Character physical candidate and references. Does not grant SSO privileges."""
import json
import pathlib
import re

ROOT=pathlib.Path(__file__).resolve().parents[1]
SQL=(ROOT/"db/migrations/0003_student_character_core_candidate.sql").read_text(encoding="utf-8")
P1=json.loads((ROOT/"db/schema/p1_candidate_tables.json").read_text(encoding="utf-8"))
STUDENT=json.loads((ROOT/"db/schema/student_universe_extension_candidate.json").read_text(encoding="utf-8"))
EXPECTED=["student.student_profiles","student.privacy_settings",
"characters.character_definitions","characters.character_versions",
"characters.character_instances","commerce.avatar_rigs"]
contracts={x["id"]:x for x in STUDENT["tables"]}
contracts.update({x["id"]:x for x in P1["tables"]})
errors=[]
for table in EXPECTED:
  check=re.search(r"CREATE TABLE\s+"+re.escape(table)+r"\s*\((.*?)\n\);",SQL,re.S)
  if not check:
    errors.append("missing SQL table "+table)
    continue
  data=check.group(1)
  for col in contracts[table]["columns"]:
    if not re.search(r"\b"+re.escape(col["name"])+r"\s+"+re.escape(col["type"])+r"\b",data):
      errors.append("field mismatch "+table+"."+col["name"])
  for mode in ("ENABLE","FORCE"):
    if f"ALTER TABLE {table} {mode} ROW LEVEL SECURITY;" not in SQL:
      errors.append("unsafe RLS "+table+" "+mode)
if len(re.findall(r"CREATE TABLE\s+",SQL))!=6:
  errors.append("migration must only create six core tables")
if re.search(r"\bCREATE\s+POLICY\b|\bGRANT\s+(?:ALL|SELECT|INSERT|UPDATE|DELETE)\b|\bDROP\s+(?:TABLE|SCHEMA)\b",SQL,re.I):
  errors.append("migration must not grant runtime permissions or destroy data")
for guard in ["student_profile_account","student_privacy_guard","character_version_publish",
              "character_instance_guard","avatar_rig_append_only","character_instance_no_delete"]:
  if guard not in SQL:errors.append("Missing security/integrity trigger "+guard)
if not SQL.endswith("COMMIT;\n"):errors.append("transaction incomplete")
print(f"P1-D candidate static validation: 6 tables, 5 student/character core + rig, errors={len(errors)}")
for error in errors:print("ERROR:",error)
raise SystemExit(bool(errors))
