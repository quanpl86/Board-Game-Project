#!/usr/bin/env python3
"""Check P1 candidate schema, 44 editable Draw.io pages, 44 SVGs, 39 per-table datasheets.
Design parity only: does not validate actual PostgreSQL migration or RLS implementation.
"""
import csv
import json
import pathlib
from xml.etree import ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "db/schema/p1_candidate_tables.json").read_text("utf-8"))
BASE = ROOT / "docs/database/p1"
TABLES = DATA["tables"]
EDGES = DATA["relationships"]
P0 = set(DATA["p0TableNames"])
NAME = {t["id"]:t for t in TABLES}
DOMAINS = set(t["domain"] for t in TABLES)
errors = []
def check(ok,msg):
    if not ok: errors.append(msg)
def slug(s):
    import re
    return re.sub(r"[^A-Za-z0-9_]", "_", s)

check(DATA["status"] == "DRAFT_LOGICAL_PHYSICAL_CONTRACT_NOT_MIGRATION", "P1 must remain unapproved design")
check(len(TABLES) == 39 and len(NAME) == 39, "Expected unique 39 P1 table contracts")
check(len(EDGES) == 80, "Expected 80 P1 candidate FK links")
check(len(DOMAINS) == 3, "Expected 3 P1 domains")
check(sum(len(t["columns"]) for t in TABLES) == 265, "Expected 265 candidate columns")
check(sum(e["scope"] == "P0" for e in EDGES) == 36, "Expected 36 P0 cross-links")
check(not (ROOT/"db/migrations/0002_p1.sql").exists(), "Do not silently add unreviewed P1 migrations")

for t in TABLES:
    check(t["domain"] in DOMAINS, f"{t['id']}: unknown domain")
    columns={c["name"]:c for c in t["columns"]}
    check(len(columns)==len(t["columns"]),f"{t['id']}: duplicate columns")
    check(sum(bool(c["pk"]) for c in t["columns"]) == 1, f"{t['id']}: must have exactly one PK")
    check(all(c["type"] and c["name"] for c in t["columns"]),f"{t['id']}: empty type/name")
    for c in t["columns"]:
        if c.get("fk"):
            items=c["fk"].split(".")
            check(len(items)==3, f"{t['id']}.{c['name']}: FK not schema.table.column")
            if len(items)==3:
                target=".".join(items[:2])
                check(target in NAME or target in P0, f"{t['id']}.{c['name']}: no target {target}")
                if target in NAME:
                    target_columns={x["name"] for x in NAME[target]["columns"]}
                    check(items[2] in target_columns,f"{t['id']}.{c['name']}: no target column {c['fk']}")
    datasheet=BASE/"tables"/f"{t['id']}.md"
    check(datasheet.is_file(),f"{t['id']}: missing datasheet")
    if datasheet.is_file():
        text=datasheet.read_text("utf-8")
        check("Columns (" in text and "Outbound foreign keys" in text, f"{t['id']}: incomplete datasheet")
        for c in t["columns"]:
            check(f"`{c['name']}`" in text,f"{t['id']}: missing {c['name']}")
for e in EDGES:
    check(e["from"] in NAME,f"Edge missing source {e}")
    check(e["to"] in NAME or e["to"] in P0,f"Edge missing target {e}")
    if e["from"] in NAME:
        columns={c["name"]:c for c in NAME[e["from"]]["columns"]}
        check(e["via"] in columns,f"Edge source field missing {e}")
        if e["via"] in columns:
            check(columns[e["via"]].get("fk")==e["to"]+"."+e["target"],f"Edge source FK mismatch {e}")
    check((e["scope"]=="P0")== (e["to"] in P0),f"Edge scope mismatch {e}")
if len(EDGES)!=len(set((e["from"],e["via"],e["to"],e["target"]) for e in EDGES)):
    errors.append("Duplicate FK edges")

try:
    graph=ET.parse(BASE/"diagrams/Board_Game_Universe_P1_Editable.drawio").getroot()
    pages=graph.findall("diagram")
    pageIds=[x.get("id") for x in pages]
    check(len(pages)==44 and len(pageIds)==len(set(pageIds)), "Expected 44 unique Draw.io tabs")
    check("p1_overview" in pageIds and "p1_domains" in pageIds,"Missing overview pages")
    overview=next((x for x in pages if x.get("id")=="p1_overview"),None)
    if overview is not None:
        edges_in_overview=sum(cell.get("edge")=="1" for cell in overview.findall(".//mxCell"))
        check(edges_in_overview==44,f"P1 overview has {edges_in_overview} internal edges, expected 44")
    for t in TABLES:
        pid="p1_table_"+slug(t["id"])
        page=next((x for x in pages if x.get("id")==pid),None)
        check(page is not None,f"Missing table diagram {pid}")
        if page is not None:
            cellids={x.get("id") for x in page.findall(".//mxCell")}
            check("table_"+slug(t["id"]) in cellids,f"Missing table cell {t['id']}")
            for c in t["columns"]:
                check("table_"+slug(t["id"])+"_col_"+slug(c["name"]) in cellids,f"Draw.io column missing {t['id']}.{c['name']}")
except (ET.ParseError,OSError) as ex:
    errors.append(f"Invalid Draw.io XML: {ex}")
svgs=list((BASE/"diagrams/previews").glob("*.svg"))
check(len(svgs)==44,f"Expected 44 SVGs found {len(svgs)}")
for f in svgs:
    try:
        check(ET.parse(f).getroot().tag.endswith("svg"),f"Not SVG: {f.name}")
    except ET.ParseError as ex:
        errors.append(f"Invalid SVG {f.name}: {ex}")

with (BASE/"p1_columns.csv").open(newline="",encoding="utf-8") as h:
    fields=list(csv.DictReader(h))
check(len(fields)==265,f"CSV columns count={len(fields)} expected 265")
with (BASE/"p1_relationships.csv").open(newline="",encoding="utf-8") as h:
    links=list(csv.DictReader(h))
check(len(links)==80,f"CSV relations count={len(links)} expected 80")
if len(links)==len(EDGES):
    rel={(x["from_table"],x["from_column"],x["target_table"],x["target_column"]) for x in links}
    check(rel=={(e["from"],e["via"],e["to"],e["target"]) for e in EDGES},"CSV relationships not identical to manifest")

print(f"P1 design validation: {len(TABLES)} tables, {sum(len(t['columns']) for t in TABLES)} columns, {len(EDGES)} candidate FK, 44 Draw.io pages; errors={len(errors)}")
for e in errors: print("ERROR:",e)
raise SystemExit(bool(errors))
