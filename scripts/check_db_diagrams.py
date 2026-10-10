#!/usr/bin/env python3
"""Validate editable Draw.io P0 diagrams, 39 SVG previews and FK/column CSV parity."""
import csv
import json
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"db/schema/p0_tables.json"
PREFIX=ROOT/"docs/database/diagrams"
manifest=json.loads(SRC.read_text(encoding="utf-8"))
specs=manifest["tableSpecs"]
fks=manifest["foreignKeys"]
err=[]
def check(ok,msg):
    if not ok:err.append(msg)
def slug(s):
    import re
    return re.sub(r"[^a-z0-9_]","_",s,flags=re.I)
file=PREFIX/"Board_Game_Universe_Database_P0_Editable.drawio"
try:
    root=ET.parse(file).getroot()
    pages=root.findall("diagram")
except (ET.ParseError,OSError) as exc:
    raise SystemExit(f"Invalid .drawio XML: {exc}")
check(root.tag=="mxfile","root is not mxfile")
check(len(pages)==2+len(manifest["domains"])+len(specs)==39,f"pages={len(pages)}, expected 39")
pageid={p.attrib.get("id"):p for p in pages}
check(len(pageid)==len(pages),"duplicate page id")
check("P0_7_domains" in pageid and "P0_overall_30" in pageid,"missing overview pages")
def cells(id_):
    if id_ not in pageid:return []
    return pageid[id_].findall(".//mxCell")
overall=cells("P0_overall_30")
check(sum(x.get("edge")=="1" for x in overall)==len(fks),f"overall FK edge count not {len(fks)}")
for spec in specs:
    pid="P0_table_"+slug(spec["id"])
    tab=cells(pid)
    check(bool(tab),f"missing {pid}")
    ids={c.attrib.get("id") for c in tab}
    check("table_"+slug(spec["id"]) in ids,f"missing {spec['id']} parent table")
    for line in spec["fields"]:
        name=line.split(" ",1)[0]
        if name not in {"FOREIGN","PRIMARY","CHECK","UNIQUE"}:
            check(f"table_{slug(spec['id'])}_col_{slug(name)}" in ids,f"missing column {spec['id']}.{name}")
for domain in manifest["domains"]:
    check("P0_domain_"+domain in pageid, f"missing domain page {domain}")
    owned=[s for s in specs if s["domain"]==domain]
    ids={c.get("id") for c in cells("P0_domain_"+domain)}
    check(all("table_"+slug(t["id"]) in ids for t in owned),f"{domain} missing owned tables")
svg=list((PREFIX/"previews").glob("*.svg"))
check(len(svg)==len(pages),f"SVG previews found {len(svg)}, expected 39")
for f in svg:
    try:check(ET.parse(f).getroot().tag.endswith("svg"),f"not SVG {f.name}")
    except ET.ParseError:check(False,f"invalid SVG {f.name}")
with (PREFIX/"p0_foreign_keys.csv").open(encoding="utf-8",newline="") as fh:
    rows=list(csv.DictReader(fh))
check(len(rows)==len(fks),f"CSV FK count mismatch: {len(rows)}")
if len(rows)==len(fks):
    keys={(r["from_table"],r["from_columns"],r["to_table"],r["to_columns"]) for r in rows}
    check(keys=={(r["from"],r["via"],r["to"],r["target"]) for r in fks},"CSV edges differ from canonical manifest")
with (PREFIX/"p0_columns.csv").open(encoding="utf-8",newline="") as fh:
    columns=list(csv.DictReader(fh))
raw_fields=sum(1 for s in specs for line in s["fields"] if line.split(" ",1)[0] not in {"FOREIGN","PRIMARY","CHECK","UNIQUE"})
check(len(columns)==raw_fields,f"CSV field count {len(columns)} != manifest {raw_fields}")
print(f"Editable DB atlas: {len(pages)} Draw.io tabs, {len(svg)} SVGs, {len(specs)} tables, {len(fks)} FK edges, {len(columns)} columns; errors={len(err)}")
for item in err:print("ERROR:",item)
raise SystemExit(bool(err))
