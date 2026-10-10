#!/usr/bin/env node
/** Regenerate the reviewed, editable P0 Draw.io diagrams and SVG previews.
 * Source of truth: db/schema/p0_tables.json (SQL parity checked separately).
 * Usage: node scripts/generate_db_diagrams.mjs [--check]
 * NEVER edit generated diagrams alone. Modify approved schema then rerun.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
const ROOT=resolve(import.meta.dirname,"..");
const generateArtifacts=function generateArtifacts(data){
 const tables=data.tableSpecs,fks=data.foreignKeys,domains=data.domains;
 const palette={identity:"#3869A6",tenancy:"#147F77",assets:"#7952AF",catalog:"#A36C25",gameplay:"#C65029",publishing:"#A3567B",integration:"#567184"};
 const all=new Map(tables.map(t=>[t.id,t]));const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
 const ids=s=>s.replace(/[^a-z0-9_]/gi,"_");
 const cols=t=>t.fields.map(line=>{let m=/^([a-z_]+)\s+(.+)$/.exec(line);if(!m||["PRIMARY","FOREIGN","UNIQUE","CHECK"].includes(m[1].toUpperCase()))return null;let tail=m[2];let kind=(/\bPRIMARY KEY\b/.test(tail)?"PK":/\bREFERENCES\b/.test(tail)?"FK":"");
 const type=(tail.match(/^([a-z]+(?:\([^)]+\))?)/)||[])[1]||"text";return {name:m[1],type,kind,required:tail.includes("NOT NULL")} }).filter(Boolean).map(c=>{const pk=t.fields.filter(f=>f.startsWith("PRIMARY KEY")).some(f=>f.includes(c.name));const fk=fks.some(f=>f.from===t.id&&f.via.split(",").map(a=>a.trim()).includes(c.name));return {...c,kind:pk||c.kind==="PK"?"PK":fk?"FK":c.kind};});
 const hFor=(t,compact=false)=>compact?64:38+24*cols(t).length+10;
 const box=(t,x,y,compact=false,primary=false)=>({id:t.id,x,y,w:compact?300:340,h:hFor(t,compact),compact,primary,domain:t.domain});
 const extNeighbor=(id,domain)=>({...all.get(id),external:all.get(id).domain!==domain});
 const makeOverview=()=>{
   let placed=[],xCols=[100,600,1100],laneWidth=430,domainGroups=[];
   let domainBuckets=[["identity","tenancy"],["assets","catalog","publishing"],["gameplay","integration"]];
   domainBuckets.forEach((list,col)=>{
    let cursor=138;for(const d of list){let ts=tables.filter(t=>t.domain===d), start=cursor;
      for(const t of ts){placed.push(box(t,xCols[col]+20,cursor+44,true));cursor+=80;}
      domainGroups.push({domain:d,x:xCols[col],y:start,w:laneWidth,h:cursor-start+24,count:ts.length});
      cursor+=58;
    }
   });
   return {id:"P0_overall_30",name:"01 ERD P0 · 30 bảng",title:"ERD TỔNG THỂ — 30 BẢNG / 49 FK",subtitle:"7 domain · Quan hệ FK SQL thực tế · Xem từng domain để thấy toàn bộ cột",boxes:placed,relations:fks,groups:domainGroups,w:1620,h:Math.max(...placed.map(p=>p.y+p.h))+125,compact:true};
 };
 const makeDomainMap=()=>{
   const pos={identity:[130,205],tenancy:[570,205],assets:[1010,205],catalog:[130,500],gameplay:[570,500],publishing:[1010,500],integration:[570,790]};
   let bs=domains.map(d=>{let v=pos[d],t={id:d,name:d,domain:d};return {id:d,domain:d,x:v[0],y:v[1],w:325,h:112,kind:"domain",count:tables.filter(x=>x.domain===d).length}});
   const agg={};for(const r of fks){const a=all.get(r.from).domain,b=all.get(r.to).domain;if(a!==b){let k=a+">"+b;agg[k]=(agg[k]||0)+1}}
   return {id:"P0_7_domains",name:"00 Kiến trúc 7 domain",title:"BOARD GAME UNIVERSE — 7 DATA DOMAINS",subtitle:"Tổng quan 30 bảng P0 · Quan hệ chéo domain · Màu phân biệt nhóm dữ liệu",boxes:bs,relations:Object.entries(agg).map(([s,count])=>({from:s.split(">")[0],to:s.split(">")[1],via:`${count} FK`,target:""})),groups:[],w:1480,h:1060,kind:"domains"};
 };
 const makeDomain=d=>{
   const own=tables.filter(t=>t.domain===d);
   const rel=fks.filter(f=>all.get(f.from).domain===d||all.get(f.to).domain===d);
   const external=[...new Set(rel.flatMap(f=>[f.from,f.to]))].filter(id=>all.get(id).domain!==d);
   let boxes=[],y=[145,145,145],cols=[100,560,1020];
   const ownSize=Math.ceil(own.length/2);
   for(let i=0;i<own.length;i++){const t=own[i],k=i%2;let bx=box(t,cols[k],y[k]);boxes.push(bx);y[k]+=bx.h+45;}
   for(let i=0;i<external.length;i++){let t=all.get(external[i]),bx=box(t,cols[2],y[2],true);boxes.push(bx);y[2]+=bx.h+24;}
   return {id:"P0_domain_"+d,name:`Domain · ${d}`,title:`DOMAIN ${d.toUpperCase()} — ${own.length} BẢNG`,subtitle:`Đầy đủ cột PK/FK và ${rel.length} quan hệ chạm domain · Bảng ngoài domain hiện dạng liên kết`,boxes,relations:rel,groups:[],w:1450,h:Math.max(...y)+130};
 };
 const makeTable=t=>{
   const incoming=fks.filter(r=>r.to===t.id),outgoing=fks.filter(r=>r.from===t.id);
   const outIds=[...new Set(outgoing.map(r=>r.to).filter(id=>id!==t.id))];
   const inIds=[...new Set(incoming.map(r=>r.from).filter(id=>id!==t.id&& !outIds.includes(id)))];
   const self=fks.filter(r=>r.to===t.id && r.from===t.id);
   const main=box(t,700,200);
   let yL=190,yR=190;let boxes=[main];
   for(const id of inIds){const b=box(all.get(id),80,yL,true);boxes.push(b);yL+=b.h+36;}
   for(const id of outIds){const b=box(all.get(id),1320,yR,true);boxes.push(b);yR+=b.h+36;}
   return {id:"P0_table_"+ids(t.id),name:t.id,title:`BẢNG ${t.id.toUpperCase()}`,subtitle:`${cols(t).length} cột · ${incoming.length} FK tham chiếu tới · ${outgoing.length} FK tham chiếu đi · ${self.length} self-edge`,boxes,relations:[...incoming,...outgoing.filter(r=>r.to!==t.id)],groups:[],w:1730,h:Math.max(main.y+main.h,yL,yR)+185,focus:t.id};
 };
 const pages=[makeDomainMap(),makeOverview(),...domains.map(makeDomain),...tables.map(makeTable)];
 const xmlCells=p=>{
   let out=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
   const add=(id,value,style,x,y,w,h,parent="1")=>out.push(`<mxCell id="${esc(id)}" value="${esc(value)}" style="${esc(style)}" vertex="1" parent="${esc(parent)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
   add("title",p.title,"text;html=0;whiteSpace=wrap;fontSize=26;fontStyle=1;fontColor=#132238;align=left;verticalAlign=middle;",72,46,p.w-100,36);
   add("subtitle",p.subtitle,"text;html=0;whiteSpace=wrap;fontSize=14;fontColor=#566579;align=left;",72,91,p.w-120,28);
   for(const g of p.groups){add("grp_"+g.domain,`${g.domain.toUpperCase()} · ${g.count} bảng`,`rounded=1;whiteSpace=wrap;html=0;fillColor=#F5F8FC;strokeColor=${palette[g.domain]};strokeWidth=2;verticalAlign=top;align=left;spacingTop=12;spacingLeft=14;fontSize=16;fontStyle=1;fontColor=${palette[g.domain]};`,g.x,g.y,g.w,g.h)}
   for(const b of p.boxes){
    const color=palette[b.domain],key="table_"+ids(b.id);
    if(p.kind==="domains"){add(key,`${b.domain.toUpperCase()}\\n${b.count} bảng`, `rounded=1;whiteSpace=wrap;html=0;fillColor=#F1F5FA;strokeColor=${color};strokeWidth=3;fontColor=${color};fontSize=21;fontStyle=1;align=center;verticalAlign=middle;`,b.x,b.y,b.w,b.h);continue;}
    const t=all.get(b.id),fields=cols(t),status=b.compact?" · liên kết / tổng quan":"";
    if(b.compact){
     const sample=fields.filter(c=>c.kind).slice(0,3).map(c=>`${c.kind} ${c.name}`).join(" · ");
     add(key,`${b.id}\\n${sample||fields.slice(0,2).map(c=>c.name).join(" · ")}${status}`,`rounded=1;whiteSpace=wrap;html=0;fillColor=#FFFFFF;strokeColor=${color};strokeWidth=${b.primary?2.8:1.8};fontSize=12;fontStyle=1;fontColor=#16253C;align=center;verticalAlign=middle;spacing=7;`,b.x,b.y,b.w,b.h);
    }else{
     const st=`swimlane;horizontal=1;startSize=38;rounded=1;whiteSpace=wrap;html=0;fillColor=${color};swimlaneFillColor=#FFFFFF;strokeColor=${color};strokeWidth=2;fontSize=16;fontStyle=1;fontColor=#FFFFFF;align=left;spacingLeft=12;container=1;collapsible=0;`;
     add(key,b.id,st,b.x,b.y,b.w,b.h);
     fields.forEach((col,i)=>{
      const label=`${col.kind?col.kind+"   ":"    "}${col.name} : ${col.type}${col.required?" *":""}`;
      const rowStyle=`text;html=0;whiteSpace=wrap;overflow=hidden;align=left;verticalAlign=middle;fontFamily=Consolas;fontSize=12;fontColor=${col.kind==="PK"?"#184C71":col.kind==="FK"?"#9A4C28":"#293647"};fillColor=${i%2?"#F4F7FA":"#FFFFFF"};spacingLeft=8;`;
      add(key+"_col_"+ids(col.name),label,rowStyle,0,39+24*i,b.w,24,key);
     });
    }
   }
   let seen=new Set();
   p.relations.forEach((r,index)=>{
    if(!p.boxes.some(b=>b.id===r.from)||!p.boxes.some(b=>b.id===r.to))return;
    const uniq=`${r.from}:${r.via}->${r.to}:${r.target}`;if(seen.has(uniq))return;seen.add(uniq);
    const srcB=p.boxes.find(b=>b.id===r.from),dstB=p.boxes.find(b=>b.id===r.to);
    const key=(id)=>"table_"+ids(id);
    const source=srcB.compact||p.kind==="domains"?key(r.from): key(r.from)+"_col_"+ids((r.via||"").split(",")[0].trim());
    const target=dstB.compact||p.kind==="domains"?key(r.to):key(r.to)+"_col_"+ids((r.target||"").split(",")[0].trim());
    const svgLabel=(r.via||"FK").slice(0,52);
    const style=`edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;strokeWidth=1.6;strokeColor=${palette[srcB.domain]};endArrow=ERone;endFill=0;startArrow=ERmany;startFill=0;fontSize=10;fontColor=#44556A;labelBackgroundColor=#FFFFFF;`;
    out.push(`<mxCell id="edge_${ids(p.id)}_${index}" value="${esc(svgLabel)}" style="${esc(style)}" edge="1" parent="1" source="${esc(source)}" target="${esc(target)}"><mxGeometry relative="1" as="geometry"/></mxCell>`);
   });
   return out.join("\n");
 };
 const diagram=(p,i)=>`<diagram id="${esc(p.id)}" name="${esc(p.name)}"><mxGraphModel dx="1380" dy="860" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${p.w}" pageHeight="${p.h}" math="0" shadow="0"><root>${xmlCells(p)}</root></mxGraphModel></diagram>`;
 const drawio=`<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" agent="Board Game Universe AI Agents" version="24.7.17" type="device">\n${pages.map(diagram).join("\n")}\n</mxfile>\n`;
 const svgPage=p=>{
  const e=esc;
  let g=[`<svg xmlns="http://www.w3.org/2000/svg" width="${p.w}" height="${p.h}" viewBox="0 0 ${p.w} ${p.h}" role="img" aria-label="${e(p.title)}">`,`<rect width="100%" height="100%" fill="#F8FAFC"/>`];
  g.push(`<text x="68" y="58" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#132238">${e(p.title)}</text>`);
  g.push(`<text x="68" y="89" font-family="Arial,sans-serif" font-size="13" fill="#566579">${e(p.subtitle)}</text>`);
  for(const q of p.groups){g.push(`<rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="15" fill="#EFF4FA" stroke="${palette[q.domain]}" stroke-width="2"/>`,`<text x="${q.x+16}" y="${q.y+24}" font-family="Arial" font-size="16" font-weight="700" fill="${palette[q.domain]}">${e(q.domain.toUpperCase()+" · "+q.count+" bảng")}</text>`)}
  const bmap=new Map(p.boxes.map(b=>[b.id,b]));
  for(const r of p.relations){
   const a=bmap.get(r.from),b=bmap.get(r.to);if(!a||!b)continue;
   let x1=a.x+a.w/2,y1=a.y+a.h/2,x2=b.x+b.w/2,y2=b.y+b.h/2;
   const dx=x2-x1,dy=y2-y1;
   if(Math.abs(dx)>Math.abs(dy)){x1+=Math.sign(dx)*a.w/2;x2-=Math.sign(dx)*b.w/2;}
   else{y1+=Math.sign(dy)*a.h/2;y2-=Math.sign(dy)*b.h/2;}
   const midx=(x1+x2)/2;
   g.push(`<path d="M${x1},${y1} L${midx},${y1} L${midx},${y2} L${x2},${y2}" fill="none" stroke="${palette[a.domain]}" stroke-width="1.2" opacity=".52"/>`);
  }
  for(const b of p.boxes){
   const color=palette[b.domain];g.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="9" fill="#FFFFFF" stroke="${color}" stroke-width="2"/>`);
   if(p.kind==="domains"){
    g.push(`<text x="${b.x+b.w/2}" y="${b.y+44}" font-family="Arial" font-size="20" text-anchor="middle" font-weight="700" fill="${color}">${e(b.domain.toUpperCase())}</text>`,`<text x="${b.x+b.w/2}" y="${b.y+72}" font-family="Arial" font-size="15" text-anchor="middle" fill="#44556A">${b.count} bảng</text>`);continue;
   }
   if(b.compact){
    g.push(`<text x="${b.x+12}" y="${b.y+24}" font-family="Arial" font-size="14" font-weight="700" fill="${color}">${e(b.id)}</text>`);
    const fields=cols(all.get(b.id)).filter(c=>c.kind).slice(0,2);g.push(`<text x="${b.x+12}" y="${b.y+45}" font-family="monospace" font-size="11" fill="#566579">${e(fields.map(c=>c.kind+" "+c.name).join(" · "))}</text>`);continue;
   }
   g.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="37" rx="8" fill="${color}"/>`);
   g.push(`<text x="${b.x+12}" y="${b.y+25}" font-family="Arial" font-size="15" font-weight="700" fill="#FFFFFF">${e(b.id)}</text>`);
   cols(all.get(b.id)).forEach((c,i)=>{
    const y=b.y+38+i*24;
    if(i%2===1)g.push(`<rect x="${b.x+2}" y="${y}" width="${b.w-4}" height="24" fill="#F4F7FA"/>`);
    g.push(`<text x="${b.x+11}" y="${y+17}" font-family="Consolas,monospace" font-size="12" fill="${c.kind==="PK"?"#215A84":c.kind==="FK"?"#AD512D":"#293647"}">${e((c.kind||"  ").padEnd(3," ")+" "+c.name+" : "+c.type)}</text>`);
   });
  }
  g.push(`<text x="${p.w-65}" y="${p.h-31}" text-anchor="end" font-family="Arial" font-size="12" fill="#718096">BGU P0 · 30 bảng / 49 FK · source db/schema/p0_tables.json · REVIEW CANDIDATE</text>`,"</svg>");
  return g.join("\n")+"\n";
 };
 const prefix="docs/database/diagrams";let entries=[
  {path:`${prefix}/Board_Game_Universe_Database_P0_Editable.drawio`,content:drawio},
  ...pages.map((p,i)=>({path:`${prefix}/previews/${String(i).padStart(2,"0")}_${p.id}.svg`,content:svgPage(p)}))
 ];
 const csv=s=>`"${String(s??"").replace(/"/g,'""')}"`;
 const fieldsCsv=[["domain","table","column","type","key","required","description"],...tables.flatMap(t=>cols(t).map(c=>[t.domain,t.id,c.name,c.type,c.kind,c.required?"yes":"no",t.description]))].map(row=>row.map(csv).join(",")).join("\n")+"\n";
 const fkCsv=[["from_table","from_columns","to_table","to_columns","source_domain","target_domain"],...fks.map(f=>[f.from,f.via,f.to,f.target,all.get(f.from).domain,all.get(f.to).domain])].map(row=>row.map(csv).join(",")).join("\n")+"\n";
 entries.push({path:`${prefix}/p0_columns.csv`,content:fieldsCsv},{path:`${prefix}/p0_foreign_keys.csv`,content:fkCsv});
 return {entries,pages,stats:{tables:tables.length,domains:domains.length,fks:fks.length,pages:pages.length,files:entries.length,drawioBytes:drawio.length,svgBytes:entries.filter(e=>e.path.endsWith(".svg")).reduce((a,b)=>a+b.content.length,0)}};
};
const source=JSON.parse(readFileSync(resolve(ROOT,"db/schema/p0_tables.json"),"utf8"));
const {entries,stats}=generateArtifacts(source);
const isCheck=process.argv.includes("--check");
const failures=[];
for(const {path,content} of entries){
 const full=resolve(ROOT,path);
 if(isCheck){
  let current;try{current=readFileSync(full,"utf8")}catch{current=null}
  if(current!==content)failures.push(path);
 }else{
  mkdirSync(dirname(full),{recursive:true});
  writeFileSync(full,content,"utf8");
 }
}
console.log(JSON.stringify({...stats,mode:isCheck?"check":"write",mismatches:failures}));
if(failures.length)process.exitCode=1;
