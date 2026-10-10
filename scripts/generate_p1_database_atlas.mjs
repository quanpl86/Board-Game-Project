#!/usr/bin/env node
/** Deterministic P1 candidate ERD, Draw.io, CSV and per-table dictionary renderer.
 * Design-only: does NOT migrate databases, create RLS policies or authorize writes.
 * Source: db/schema/p1_candidate_tables.json.
 * Commands: node scripts/generate_p1_database_atlas.mjs [--check]
 */
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {dirname,resolve} from "node:path";
const ROOT=resolve(import.meta.dirname,"..");
const buildP1=function buildP1(m){
 const groups=[...new Set(m.tables.map(t=>t.domain))];
 const lookup=new Map(m.tables.map(t=>[t.id,t]));
 const allP0=new Set(m.p0TableNames);
 const palettes={education:"#267A78",competition:"#AB6220",commerce:"#684EA1",external:"#60758B"};
 const slug=id=>id.replace(/[^A-Za-z0-9_]/g,"_");
 const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
 const cellCols=t=>t.columns;
 const size=t=>t.external?70:44+23*t.columns.length+12;
 const mk=(id,x,y,compact=false,external=false)=>{
   let t=lookup.get(id)||{id,domain:id.split(".")[0],columns:[],external:true};
   return {id,domain:t.domain,compact,external,x,y,w:compact?335:390,h:compact?67:size(t)};
 };
 const domainPage={id:"p1_domains",name:"00 P1 · 3 domains",title:"DATABASE P1 — 3 PHÂN HỆ",subtitle:"39 bảng ứng viên · Education, Competition/Rankings, Avatar/Inventory/Shop · NOT MIGRATED",boxes:groups.map((d,i)=>({id:d,domain:d,x:90+500*i,y:220,w:425,h:150,kind:"domain"})),links:[],w:1710,h:585,kind:"domains"};
 const internal=m.relationships.filter(e=>e.scope==="P1");
 const overview=(()=>{
   const boxes=[];
   const columns=[{d:"education",x:60},{d:"competition",x:605},{d:"commerce",x:1150}];
   let max=0;
   for(const {d,x} of columns){let y=180;for(const t of m.tables.filter(t=>t.domain===d)){boxes.push(mk(t.id,x,y,true));y+=89;}max=Math.max(max,y);}
   return {id:"p1_overview",name:"01 ERD P1 · 39 bảng",title:"P1 — 39 TABLE RELATIONSHIP MAP",subtitle:"80 quan hệ FK dự kiến (44 nội bộ P1 + 36 tham chiếu P0) · xem domain để đọc cột chi tiết",boxes,links:internal,w:1630,h:max+125};
 })();
 const domainPages=groups.map(d=>{
   const own=m.tables.filter(t=>t.domain===d);
   const cross=m.relationships.filter(e=>e.from.startsWith(d+".")||e.to.startsWith(d+"."));
   const external=[...new Set(cross.flatMap(e=>[e.from,e.to]).filter(id=>!id.startsWith(d+".")))];
   const boxes=[],Y=[160,160,160],X=[65,560,1090];
   own.forEach((t,i)=>{const index=i%2;const b=mk(t.id,X[index],Y[index]);boxes.push(b);Y[index]+=b.h+38});
   external.forEach(id=>{boxes.push(mk(id,X[2],Y[2],true,true));Y[2]+=92});
   return {id:"p1_domain_"+d,name:"Domain · "+d,title:d.toUpperCase()+" — PHYSICAL CANDIDATE",subtitle:`${own.length} bảng, ${cross.length} quan hệ liên quan; P0 neighbors là context, không thuộc migration P1`,boxes,links:cross,w:1530,h:Math.max(...Y)+120};
 });
 const tablePages=m.tables.map(t=>{
  const refs=m.relationships.filter(e=>e.from===t.id||e.to===t.id);
  const near=[...new Set(refs.flatMap(e=>[e.from,e.to]).filter(id=>id!==t.id))];
  const left=near.filter(id=>refs.some(e=>e.from===id&&e.to===t.id));
  const right=near.filter(id=>!left.includes(id));
  let yL=175,yR=175;
  const boxes=[mk(t.id,605,200)];
  for(const id of left){boxes.push(mk(id,70,yL,true,!lookup.has(id)));yL+=92}
  for(const id of right){boxes.push(mk(id,1140,yR,true,!lookup.has(id)));yR+=92}
  return {id:"p1_table_"+slug(t.id),name:t.id,title:t.id.toUpperCase(),subtitle:`${t.columns.length} cột, ${refs.length} quan hệ · ${t.classification} · DRAFT ONLY`,boxes,links:refs,w:1570,h:Math.max(boxes[0].y+boxes[0].h,yL,yR)+110};
 });
 const pages=[domainPage,overview,...domainPages,...tablePages];
 const bColor=b=>palettes[b.domain]||palettes.external;
 const makeDrawio=(p,index)=>{
  const q=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
  const add=(id,value,style,x,y,w,h,parent="1")=>q.push(`<mxCell id="${esc(id)}" value="${esc(value)}" style="${esc(style)}" vertex="1" parent="${esc(parent)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
  add("title",p.title,"text;html=0;whiteSpace=wrap;fontStyle=1;fontSize=25;fontColor=#16253E;align=left;",50,42,p.w-90,45);
  add("sub",p.subtitle,"text;html=0;whiteSpace=wrap;fontSize=13;fontColor=#637286;align=left;",50,92,p.w-90,37);
  for(const b of p.boxes){
   const color=bColor(b),id="table_"+slug(b.id);
   if(b.kind==="domain"){const count=m.tables.filter(t=>t.domain===b.id).length;add(id,`${b.id.toUpperCase()}\\n${count} bảng đề xuất`,`rounded=1;html=0;whiteSpace=wrap;fillColor=#FFFFFF;strokeColor=${color};strokeWidth=3;fontStyle=1;fontSize=22;fontColor=${color};align=center;verticalAlign=middle;`,b.x,b.y,b.w,b.h);continue}
   if(b.compact){add(id,`${b.id}\\n${b.external?"P0 dependency":(lookup.get(b.id)?.columns||[]).filter(x=>x.fk||x.pk).slice(0,2).map(x=>(x.pk?"PK ":"FK ")+x.name).join(" · ")}`,`rounded=1;whiteSpace=wrap;html=0;strokeColor=${color};fillColor=${b.external?"#EBF1F6":"#FFFFFF"};strokeWidth=1.8;fontSize=13;fontColor=#14243A;fontStyle=1;align=center;verticalAlign=middle;`,b.x,b.y,b.w,b.h);continue}
   add(id,b.id,`swimlane;horizontal=1;startSize=39;rounded=1;html=0;strokeColor=${color};fillColor=${color};swimlaneFillColor=#FFFFFF;strokeWidth=2;fontColor=#FFFFFF;fontSize=16;fontStyle=1;align=left;spacingLeft=12;container=1;collapsible=0;`,b.x,b.y,b.w,b.h);
   cellCols(lookup.get(b.id)).forEach((c,i)=>{
     const cLabel=`${c.pk?"PK":c.fk?"FK":"  "}  ${c.name} : ${c.type}${c.required?" *":""}`;
     add(`${id}_col_${slug(c.name)}`,cLabel,`text;html=0;whiteSpace=wrap;align=left;fontFamily=Consolas;fontSize=12;fontColor=${c.pk?"#17527A":c.fk?"#9D542B":"#243146"};fillColor=${i%2?"#F4F7FA":"#FFFFFF"};spacingLeft=8;`,0,40+i*23,b.w,23,id);
   });
  }
  const boxMap=new Map(p.boxes.map(b=>[b.id,b]));
  p.links.forEach((e,i)=>{
   const a=boxMap.get(e.from),b=boxMap.get(e.to);if(!a||!b)return;
   const fid="table_"+slug(e.from),tid="table_"+slug(e.to);
   const src=a.compact?fid:`${fid}_col_${slug(e.via)}`;
   const dst=b.compact?tid:`${tid}_col_${slug(e.target)}`;
   q.push(`<mxCell id="rel_${i}" value="${esc(e.via)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;strokeWidth=1.4;strokeColor=${bColor(a)};endArrow=ERone;endFill=0;startArrow=ERmany;startFill=0;fontSize=9;fontColor=#455467;labelBackgroundColor=#FFFFFF;" edge="1" parent="1" source="${esc(src)}" target="${esc(dst)}"><mxGeometry relative="1" as="geometry"/></mxCell>`);
  });
  return `<diagram id="${esc(p.id)}" name="${esc(p.name)}"><mxGraphModel dx="1400" dy="860" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${p.w}" pageHeight="${p.h}" math="0" shadow="0"><root>${q.join("")}</root></mxGraphModel></diagram>`;
 };
 const drawio=`<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" agent="BGU Database P1" version="24.7.17" type="device">${pages.map(makeDrawio).join("\n")}</mxfile>\n`;
 const svgrender=p=>{
  let lines=[`<svg xmlns="http://www.w3.org/2000/svg" width="${p.w}" height="${p.h}" viewBox="0 0 ${p.w} ${p.h}" role="img" aria-label="${esc(p.title)}">`,`<rect width="100%" height="100%" fill="#F8FAFC"/>`,`<text x="52" y="65" font-size="25" font-family="Arial,sans-serif" font-weight="700" fill="#15243C">${esc(p.title)}</text>`,`<text x="52" y="105" font-family="Arial" font-size="13" fill="#55677A">${esc(p.subtitle)}</text>`];
  const boxMap=new Map(p.boxes.map(b=>[b.id,b]));
  for(const r of p.links){
   const a=boxMap.get(r.from),b=boxMap.get(r.to);if(!a||!b)continue;
   let x1=a.x+a.w/2,y1=a.y+a.h/2,x2=b.x+b.w/2,y2=b.y+b.h/2,dx=x2-x1,dy=y2-y1;
   if(Math.abs(dx)>Math.abs(dy)){x1+=Math.sign(dx)*a.w/2;x2-=Math.sign(dx)*b.w/2;}else{y1+=Math.sign(dy)*a.h/2;y2-=Math.sign(dy)*b.h/2;}
   const mid=(x1+x2)/2;
   lines.push(`<path d="M${x1},${y1}L${mid},${y1}L${mid},${y2}L${x2},${y2}" fill="none" stroke="${bColor(a)}" opacity=".36" stroke-width="1.3"/>`);
  }
  for(const b of p.boxes){
   const col=bColor(b);
   lines.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="8" fill="${b.external?"#EDF3F8":"#FFFFFF"}" stroke="${col}" stroke-width="2"/>`);
   if(b.kind==="domain"){lines.push(`<text x="${b.x+b.w/2}" y="${b.y+65}" text-anchor="middle" font-family="Arial" font-size="22" fill="${col}" font-weight="700">${esc(b.id.toUpperCase())}</text>`,`<text x="${b.x+b.w/2}" y="${b.y+92}" text-anchor="middle" font-family="Arial" font-size="15" fill="#48566A">${m.tables.filter(t=>t.domain===b.id).length} bảng đề xuất</text>`);continue;}
   if(b.compact){lines.push(`<text x="${b.x+13}" y="${b.y+24}" font-family="Arial" font-size="14" fill="${col}" font-weight="700">${esc(b.id)}</text>`,`<text x="${b.x+13}" y="${b.y+46}" font-family="Arial" font-size="11" fill="#5C6B7C">${b.external?"P0 dependency":"P1 related table"}</text>`);continue;}
   lines.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="39" rx="8" fill="${col}"/>`,`<text x="${b.x+11}" y="${b.y+25}" font-family="Arial" font-size="15" font-weight="700" fill="#FFFFFF">${esc(b.id)}</text>`);
   const t=lookup.get(b.id);
   t.columns.forEach((c,i)=>{
    const y=b.y+39+i*23;
    if(i%2)lines.push(`<rect x="${b.x+2}" y="${y}" width="${b.w-4}" height="23" fill="#F2F6FA"/>`);
    lines.push(`<text x="${b.x+10}" y="${y+16}" font-family="Consolas,monospace" font-size="12" fill="${c.pk?"#205782":c.fk?"#AA5E2F":"#344154"}">${esc((c.pk?"PK":c.fk?"FK":"  ")+"  "+c.name+" : "+c.type)}</text>`);
   });
  }
  lines.push(`<text x="${p.w-40}" y="${p.h-24}" text-anchor="end" fill="#667789" font-size="12" font-family="Arial">P1 DESIGN CANDIDATE · NOT MIGRATED · ${m.tables.length} tables / ${m.relationships.length} proposed FK edges</text>`,"</svg>");
  return lines.join("\n")+"\n";
 };
 const erd=(nodes,edges)=>{
   const rows=["erDiagram"];
   for(const n of nodes){
    const t=lookup.get(n);
    if(t)rows.push(`    ${slug(n)} {`,...t.columns.map(c=>`        ${c.type.replace(/[^A-Za-z0-9_]/g,"_")} ${c.name} ${c.pk?"PK":c.fk?"FK":""}`),`    }`);
    else rows.push(`    ${slug(n)} {`,`        uuid id PK`,`    }`);
   }
   for(const e of edges)if(nodes.includes(e.from)&&nodes.includes(e.to))rows.push(`    ${slug(e.to)} ||--o{ ${slug(e.from)} : "${e.via}"`);
   return rows.join("\n")+"\n";
 };
 const root="docs/database/p1";
 const entries=[{path:root+"/diagrams/Board_Game_Universe_P1_Editable.drawio",content:drawio}];
 pages.forEach((p,i)=>entries.push({path:`${root}/diagrams/previews/${String(i).padStart(2,"0")}_${p.id}.svg`,content:svgrender(p)}));
 const csv=(a)=>a.map(cols=>cols.map(c=>'"'+String(c??"").replace(/"/g,'""')+'"').join(",")).join("\n")+"\n";
 entries.push({path:root+"/p1_columns.csv",content:csv([["table","column","postgres_candidate_type","nullable","key","fk_target","default","notes"],...m.tables.flatMap(t=>t.columns.map(c=>[t.id,c.name,c.type,c.required?"NO":"YES",c.pk?"PK":c.fk?"FK":"",c.fk||"",c.default||"",c.description||""]))])});
 entries.push({path:root+"/p1_relationships.csv",content:csv([["from_table","from_column","target_table","target_column","target_scope"],...m.relationships.map(x=>[x.from,x.via,x.to,x.target,x.scope])])});
 const ALLN=m.tables.map(t=>t.id);
 const dP0=[...new Set(m.relationships.filter(x=>x.scope==="P0").map(x=>x.to))];
 entries.push({path:root+"/ERD_P1_ALL.md",content:`# P1 — Overall ERD (DRAFT, not migrated)\n\n${m.tables.length} P1 proposed entities, ${m.relationships.length} FK candidates. Cross-refs to P0 drawn as external context nodes.\n\n\`\`\`mermaid\n${erd([...ALLN,...dP0],m.relationships)}\`\`\`\n\n**Editable full source:** [Draw.io](diagrams/Board_Game_Universe_P1_Editable.drawio). Canonical proposals: \`db/schema/p1_candidate_tables.json\`.\n`});
 for(const d of groups){
  const own=m.tables.filter(t=>t.domain===d),rels=m.relationships.filter(e=>e.from.startsWith(d+".")||e.to.startsWith(d+"."));
  const ids=[...new Set([...own.map(t=>t.id),...rels.flatMap(e=>[e.from,e.to])])];
  entries.push({path:`${root}/ERD_${d.toUpperCase()}.md`,content:`# P1 ${d.toUpperCase()} — Domain ERD · DESIGN PROPOSAL\n\n${own.length} proposed tables, ${rels.length} relations touching this domain. Other nodes included as P0/P1 dependencies.\n\n\`\`\`mermaid\n${erd(ids,rels)}\`\`\`\n\n${own.map(t=>`- [${t.id}](tables/${t.id}.md) — ${t.description}`).join("\n")}\n`});
 }
 const tablesIndex=`# P1 proposed per-table physical-design datasheets (39)\n\n${groups.map(d=>`## ${d}\n${m.tables.filter(t=>t.domain===d).map(t=>`- [${t.id}](${t.id}.md)`).join("\n")}`).join("\n\n")}\n\nEach page includes the full 265-column proposal, FK inbound/outbound, candidate unique/check/index, risks and one diagram per table. **No P1 SQL migration exists.**`;
 entries.push({path:root+"/tables/README.md",content:tablesIndex});
 for(const t of m.tables){
  const incoming=m.relationships.filter(e=>e.to===t.id),outgoing=m.relationships.filter(e=>e.from===t.id);
  const neighbors=[...new Set([...incoming.map(e=>e.from),...outgoing.map(e=>e.to)].filter(id=>id!==t.id))];
  const link=id=>lookup.has(id)?`[${id}](${id}.md)`:`[${id}](../../tables/${id}.md)`;
  const fields=t.columns.map(c=>`| \`${c.name}\` | \`${c.type}\` | ${c.pk?"PK":c.fk?`FK → ${link(c.fk.slice(0,c.fk.lastIndexOf(".")))}.\`${c.fk.split(".").at(-1)}\``:"—"} | ${c.required?"NO":"YES"} | ${c.default?`\`${c.default}\``:"—"} |`).join("\n");
  let doc=`# ${t.id} — P1 DATA DICTIONARY\n\n**Status:** DRAFT / NOT MIGRATED · **Owner:** ${t.domain} · **Data classification:** ${t.classification}\n\n${t.description}\n\n## Direct relationship preview\n\n![Editable relationship preview](../diagrams/previews/${String(pages.indexOf(tablePages.find(x=>x.id==="p1_table_"+slug(t.id)))).padStart(2,"0")}_p1_table_${slug(t.id)}.svg)\n\n## Columns (${t.columns.length})\n| Column | Candidate PostgreSQL type | Key | Nullable | Default |\n|---|---|---|---|---|\n${fields}\n\n## Outbound foreign keys (${outgoing.length})\n${outgoing.map(e=>`- \`${e.via}\` → ${link(e.to)}.\`${e.target}\` (${e.scope})`).join("\n")||"- None"}\n\n## Inbound foreign keys (${incoming.length})\n${incoming.map(e=>`- ${link(e.from)}.\`${e.via}\` → \`${e.target}\``).join("\n")||"- None"}\n\n## Proposed integrity\n**Unique constraints:** ${t.uniques.length?t.uniques.map(x=>`\`${x}\``).join(", "):"No additional scoped UNIQUE specified yet."}\n\n**Check/invariant and domain guard:**\n${t.checks.length?t.checks.map(c=>`- ${c}`).join("\n"):"- Owner to verify permissible value set and lifecycle."}\n\n**Indexes:** ${t.indexes.length?t.indexes.map(i=>`\`${i}\``).join(", "):"Review EXPLAIN workloads before physical index choice."}\n\n## Required implementation and review\n- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.\n- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.\n- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.\n- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.\n`;
  entries.push({path:`${root}/tables/${t.id}.md`,content:doc});
 }
 let intro=`# Board Game Universe — Database P1 Detailed Modeling (REVIEW CANDIDATE)\n\n**Scope:** ${m.tables.length} proposed P1 tables, ${m.tables.reduce((n,t)=>n+t.columns.length,0)} candidate columns, ${m.relationships.length} proposed FK links (${m.relationships.filter(e=>e.scope==="P0").length} to existing P0), ${groups.length} domain models. **NO P1 MIGRATION**, no production DB action or policy change. Data was developed against Education PRD, Ranking/Hall of Fame spec, Avatar rig spec, Economy logical model and freeze-readiness decisions.\n\n## Visuals (editable)\n- [Draw.io with ${pages.length} editable tabs](diagrams/Board_Game_Universe_P1_Editable.drawio) — one domains map, one full table overview, three domain ERDs, one per-table diagram.\n- [SVG previews folder](diagrams/previews/) — individual vector previews, accessible directly in browser.\n- [Overall candidate ERD](ERD_P1_ALL.md).\n${groups.map(d=>`- [${d} domain ERD](ERD_${d.toUpperCase()}.md).`).join("\n")}\n- [Detailed data dictionary / separate diagram per table](tables/README.md).\n- [Candidate 265-column CSV](p1_columns.csv), [80 relationship CSV](p1_relationships.csv).\n\n## Domain boundaries / authoritative data\n- **Education (11):** class and lesson revisions, student attempts, private evidence and human-verified rubric assessments; game score is not academic grade.\n- **Competition (11):** published match result as evidence, immutable score record corrections, leaderboard as rebuildable projection, Hall of Fame human review and minor privacy.\n- **Commerce / Avatar (17):** item definition/version/asset version separate from inventory ownership/loadout, closed-loop currency, double-entry ledger and official store orders; no peer marketplace tables.\n\n## Review blockers before physical SQL\n- KingDragonHub SSO identity, tenant and guardian allow policies unresolved.\n- Scoped uniqueness/composite foreign keys, optional ownership/account purpose, snapshot and retention model to freeze in DBA review.\n- Ledger posting balance, same-currency entries, concurrent stock/order/inventory and nonnegative funds need transactional design and property tests (not enforced by diagram).\n- Exactly once game score source verification, correction and privacy separation.\n- Rubric/assignment lesson consistency, class/term tenant consistency, active enrollment access.\n\n## Source of truth and regeneration\nManifest: \`db/schema/p1_candidate_tables.json\`. Regenerate *all* diagram/CSV/datasheet files with \`node scripts/generate_p1_database_atlas.mjs\`. CI should run \`node scripts/generate_p1_database_atlas.mjs --check\`; generated files are proposals derived from candidate manifest, not a permission grant.\n\nSee [P0 30-table production-review candidate](../README.md) and [cross-layer Agent protocol](../AGENT_IMPLEMENTATION_REFERENCE.md). Changes to physical schema require a **separate** approved SQL migration with its own smoke/integration tests.\n`;
 entries.push({path:root+"/README.md",content:intro});
 return {entries,stats:{tables:m.tables.length,columns:m.tables.reduce((n,t)=>n+t.columns.length,0),foreignKeys:m.relationships.length,p0Links:m.relationships.filter(e=>e.scope==="P0").length,pages:pages.length,svg:pages.length,files:entries.length}};
};
const schema=JSON.parse(readFileSync(resolve(ROOT,"db/schema/p1_candidate_tables.json"),"utf8"));
const output=buildP1(schema);
const check=process.argv.includes("--check");
const mismatches=[];
for(const f of output.entries){
 const p=resolve(ROOT,f.path);
 if(check){
   let current=null;try{current=readFileSync(p,"utf8")}catch{}
   if(current!==f.content)mismatches.push(f.path);
 }else{
   mkdirSync(dirname(p),{recursive:true});
   writeFileSync(p,f.content,"utf8");
 }
}
console.log(JSON.stringify({...output.stats,mode:check?"check":"write",mismatches}));
if(mismatches.length)process.exitCode=1;
