#!/usr/bin/env python3
"""Static parity checks for P0 PostgreSQL DDL + 30 ERD datasheets. No DB connection."""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "db/schema/p0_tables.json").read_text(encoding="utf-8"))
sql = (ROOT / "db/migrations/0001_p0_foundation.sql").read_text(encoding="utf-8")
tables = manifest["tableSpecs"]
fk = manifest["foreignKeys"]
errors = []
def check(condition, why):
    if not condition:
        errors.append(why)

names = [t["id"] for t in tables]
check(len(tables) == manifest["totalTables"] == 30, "30 table count mismatch")
check(len(names) == len(set(names)), "Duplicate table name")
check(len(fk) == manifest["totalForeignKeys"], "FK edge count mismatch")
check(all(f["from"] in names and f["to"] in names for f in fk), "Unknown FK neighbor")
check(not re.search(r"\bDROP\s+(?:TABLE|SCHEMA)\b", sql, re.I), "Destructive DROP in bootstrap migration")
check("CREATE EXTENSION IF NOT EXISTS pgcrypto;" in sql, "UUID extension missing")

for t in tables:
    id_ = t["id"]
    create = re.search(r"CREATE TABLE\s+" + re.escape(id_) + r"\s*\((.*?)\n\);", sql, re.S)
    check(create is not None, f"{id_}: missing DDL")
    if create:
        ddl = create.group(1)
        for field in t["fields"]:
            check(field in ddl, f"{id_}: column/constraint mismatch: {field}")
    check(f"ALTER TABLE {id_} ENABLE ROW LEVEL SECURITY;" in sql, f"{id_}: missing ENABLE RLS")
    check(f"ALTER TABLE {id_} FORCE ROW LEVEL SECURITY;" in sql, f"{id_}: missing FORCE RLS")
    doc = ROOT / "docs/database/tables" / f"{id_}.md"
    check(doc.is_file(), f"{id_}: missing per-table diagram/docs")
    if doc.is_file():
        body = doc.read_text(encoding="utf-8")
        check("flowchart LR" in body and "## Physical field declarations" in body, f"{id_}: incomplete table datasheet")
        for rel in fk:
            if rel["from"] == id_ or rel["to"] == id_:
                other = rel["to"] if rel["from"] == id_ else rel["from"]
                check(other in body, f"{id_}: missing related table link {other}")

for domain in manifest["domains"]:
    f = ROOT / "docs/database" / f"ERD_{domain.upper()}.md"
    check(f.is_file() and "erDiagram" in f.read_text(encoding="utf-8"), f"{domain}: missing ERD")

check("erDiagram" in (ROOT / "docs/database/ERD_ALL_P0.md").read_text(encoding="utf-8"), "Missing overall ERD")
check("CREATE POLICY" not in sql.upper(), "SSO-unreviewed DB policies must not be enabled")
check("GRANT ALL" not in sql.upper(), "Unrestricted SQL grants not allowed")
print(f"P0 schema static validation: {len(tables)} tables, {len(fk)} FK edges, {len(errors)} issue(s)")
for error in errors:
    print("ERROR:", error)
sys.exit(bool(errors))
