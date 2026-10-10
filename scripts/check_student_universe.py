#!/usr/bin/env python3
"""Read-only checks: Student Universe design must agree with P0/P1 and 30-page editable Draw.io.
This validates documentation consistency, NOT authenticated access or Coin transaction safety.
"""
import json
import pathlib
import re
import xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[1]
MODEL=json.loads((ROOT/"db/schema/student_universe_extension_candidate.json").read_text("utf-8"))
P0=json.loads((ROOT/"db/schema/p0_tables.json").read_text("utf-8"))
P1=json.loads((ROOT/"db/schema/p1_candidate_tables.json").read_text("utf-8"))
T=MODEL["tables"]; R=MODEL["relationships"]
LOC={t["id"]:t for t in T}
P0T={t["id"]:t for t in P0["tableSpecs"]}
P1T={t["id"]:t for t in P1["tables"]}
ROOT_DOC=ROOT/"docs/database/student-universe"
errors=[]
def check(ok,msg):
    if not ok:errors.append(msg)
def slug(s):return re.sub(r"[^A-Za-z0-9_]","_",s)
check(MODEL["status"]=="DESIGN_CANDIDATE_NO_PHYSICAL_SQL","status must deny migration claims")
check(len(T)==22 and len(LOC)==22,"Expected 22 unique student extension tables")
check(sum(len(t["columns"]) for t in T)==158,"Expected 158 columns")
check(len(R)==54,"Expected 54 foreign key references")
check(len(set(t["domain"] for t in T))==7,"Expected 7 separate new domains")
check(not any("coin_balance" in c["name"] for t in T for c in t["columns"]),"No authoritative user.coin_balance")
for t in T:
    cols={c["name"]:c for c in t["columns"]}
    check(len(cols)==len(t["columns"]),f"Duplicate column {t['id']}")
    check(sum(c["pk"] for c in t["columns"])==1,f"Must have one PK {t['id']}")
    if t["domain"] in {"student","economy","ownership","characters","achievements","progress","creations"}:
        check(t["status"]=="DESIGN_CANDIDATE",f"Unexpected status {t['id']}")
    card=ROOT_DOC/"tables"/(t["id"]+".md")
    check(card.is_file(),f"Missing datasheet {t['id']}")
    if card.is_file():
        body=card.read_text("utf8")
        check("flowchart LR" in body,f"Missing direct ERD {t['id']}")
        for c in t["columns"]:
            check("runaway" not in c["name"],"Unwanted column")
            check(f"`{c['name']}`" in body,f"Missing column docs {t['id']}.{c['name']}")
            if c["reference"]:
                check(len(c["reference"].split("."))==3,f"Invalid FK {t['id']}.{c['name']}")
for edge in R:
    a=edge["from"];b=edge["to"];source=edge["from_column"];target=edge["to_column"]
    check(a in LOC,f"Unknown extension source {a}")
    if a not in LOC:continue
    fields={c["name"]:c for c in LOC[a]["columns"]}
    check(source in fields,f"Unknown FK field {a}.{source}")
    if source in fields:check(fields[source]["reference"]==b+"."+target,f"FK reference mismatch {a}.{source}")
    target_table=LOC.get(b) or P0T.get(b) or P1T.get(b)
    check(target_table is not None,f"Unknown linked table {b}")
    if b in LOC:check(any(c["name"]==target for c in LOC[b]["columns"]),f"Missing extension target {b}.{target}")
    elif b in P1T:check(any(c["name"]==target for c in P1T[b]["columns"]),f"Missing P1 target {b}.{target}")
    elif b in P0T:check(any(re.match(r"^"+re.escape(target)+r"\s",f) for f in P0T[b]["fields"]),f"Missing P0 target {b}.{target}")
    expect="extension" if b in LOC else "P0" if b in P0T else "P1_design"
    check(edge["scope"]==expect,f"Bad source status for {a}.{source}")
check(len(set((e["from"],e["from_column"],e["to"],e["to_column"]) for e in R))==54,"Duplicate FK edges")
DRAW=ROOT_DOC/"Student_Universe_Editable.drawio"
try:
    pages=ET.parse(DRAW).getroot().findall("diagram")
    check(len(pages)==30,"Expected 30 editable Draw.io pages, got "+str(len(pages)))
    pageByName={p.get("name"):p for p in pages}
    check(len(pageByName)==30,"Duplicate Draw.io page names")
    for t in T:
        page=pageByName.get(t["id"])
        check(page is not None,f"Missing editable page {t['id']}")
        if page is not None:
            ids={x.get("id") for x in page.findall(".//mxCell")}
            for c in t["columns"]:
                check("t_"+slug(t["id"])+"_f_"+slug(c["name"]) in ids,f"Missing editable field {t['id']}.{c['name']}")
except (OSError,ET.ParseError) as ex:
    errors.append(f"Broken Draw.io XML: {ex}")
for f in ["README.md","START_HERE.md","IMPLEMENTATION_AND_SECURITY_CONTRACT.md","DECISION_REGISTER.md"]:
    check((ROOT_DOC/f).is_file(),f"Missing guide: {f}")
print(f"Student Universe reference validation: {len(T)} tables, {sum(len(t['columns']) for t in T)} columns, {len(R)} FK proposals, {len(errors)} errors")
for e in errors:print("ERROR:",e)
raise SystemExit(bool(errors))
