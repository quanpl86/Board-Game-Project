#!/usr/bin/env node
/** Generate SQL-derived editable physical ERD and SVG preview (P1-D); no migrations executed. */
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const buildPhysical=function buildPhysical(sql) {
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const expected=["student.student_profiles","student.privacy_settings","commerce.avatar_rigs","characters.character_definitions","characters.character_versions","characters.character_instances"];
  const stub=[
    {id:"identity.users",cols:[{name:"id",type:"uuid",key:"PK"},{name:"account_type",type:"text",key:""}],xref:true},
    {id:"identity.guardian_links",cols:[{name:"id",type:"uuid",key:"PK"},{name:"student_user_id",type:"uuid",key:"FK"},{name:"status",type:"text",key:""}],xref:true},
    {id:"assets.asset_versions",cols:[{name:"id",type:"uuid",key:"PK"},{name:"asset_id",type:"uuid",key:"FK"},{name:"status",type:"text",key:""}],xref:true},
    {id:"assets.assets",cols:[{name:"id",type:"uuid",key:"PK"},{name:"rights_status",type:"text",key:""},{name:"kind",type:"text",key:""}],xref:true}
  ];
  const tables=expected.map(id=>{
    const block=sql.match(new RegExp("CREATE TABLE "+id.replace(".","\\.")+" \\(([\\s\\S]*?)\\n\\);"));
    if(!block)throw Error("missing source "+id);
    const cols=block[1].split("\n").map(line=>line.trim()).filter(s=>/^[a-z_]+\s+[a-z]/.test(s)).map(line=>{
      const q=line.match(/^([a-z_]+)\s+([a-z]+(?:\([^)]+\))?)/);
      return{name:q[1],type:q[2],key:line.includes("PRIMARY KEY")?"PK":line.includes("REFERENCES ")?"FK":""};
    });
    return {id,cols,xref:false};
  });
  const positions={
    "identity.users":[50,175],
    "identity.guardian_links":[50,405],
    "student.student_profiles":[460,180],
    "student.privacy_settings":[460,520],
    "characters.character_definitions":[910,165],
    "commerce.avatar_rigs":[910,430],
    "characters.character_versions":[1320,215],
    "characters.character_instances":[1740,215],
    "assets.asset_versions":[1320,570],
    "assets.assets":[1740,650],
  };
  const palette={identity:"#4A7397",student:"#1D7A79",commerce:"#6A5EB4",characters:"#B2673D",assets:"#777F97"};
  const all=[...stub,...tables];let by=new Map(all.map(t=>[t.id,t]));
  const cards=all.map(t=>{const [x,y]=positions[t.id];return {...t,x,y,w:t.xref?300:350,h:43+t.cols.length*24+8,color:palette[t.id.split(".")[0]]};});
  const links=[];
  for(const t of tables){
    const block=sql.match(new RegExp("CREATE TABLE "+t.id.replace(".","\\.")+" \\(([\\s\\S]*?)\\n\\);"))[1];
    for(const match of block.matchAll(/^\s*([a-z_]+)\s+[^\n]*\sREFERENCES\s+([a-z_]+\.[a-z_]+)\(([a-z_]+)\)/gm)){
      links.push({from:t.id,field:match[1],to:match[2],target:match[3]});
    }
  }
  links.push({from:"identity.guardian_links",field:"student_user_id",to:"identity.users",target:"id"});
  links.push({from:"assets.asset_versions",field:"asset_id",to:"assets.assets",target:"id"});
  if(links.length!==11)throw Error("Expected 9 P1D + 2 P0 relation links; got "+links.length);
  const id=s=>"t_"+s.replace(".","_");
  const cells=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
  const vert=(i,val,style,x,y,w,h,parent="1")=>cells.push(`<mxCell id="${esc(i)}" value="${esc(val)}" style="${esc(style)}" vertex="1" parent="${esc(parent)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
  vert("header","P1-D | STUDENT PROFILE + CHARACTER CORE — PHYSICAL ERD","text;html=0;fontStyle=1;fontSize=26;fontColor=#142C47;align=left;",50,45,1800,50);
  vert("details","6 bảng SQL · 9 khóa ngoại mới · P0 external context · PostgreSQL 16 CI only · RLS FORCE / no policies","text;html=0;fontSize=16;fontColor=#52637A;align=left;",50,92,1750,35);
  for(const c of cards){
    vert(id(c.id),c.id,`swimlane;horizontal=1;startSize=42;rounded=1;html=0;fillColor=${c.color};swimlaneFillColor=${c.xref?"#F0F5FA":"#FFFFFF"};strokeColor=${c.color};fontColor=#FFFFFF;fontSize=15;fontStyle=1;container=1;collapsible=0;align=left;spacingLeft=10;`,c.x,c.y,c.w,c.h);
    c.cols.forEach((f,k)=>{
      vert(id(c.id)+"_"+f.name,`${f.key||"  "}  ${f.name} : ${f.type}`,`text;html=0;whiteSpace=wrap;align=left;fontSize=12;fontFamily=Consolas;fontColor=#273D54;fillColor=${k%2?"#F4F7FA":"#FFFFFF"};spacingLeft=8;`,0,44+24*k,c.w,24,id(c.id));
    });
  }
  links.forEach((e,i)=>{
    const a=id(e.from)+"_"+e.field,b=id(e.to)+"_"+e.target;
    cells.push(`<mxCell id="fk_${i}" value="${esc(e.field)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#627D98;strokeWidth=1.5;endArrow=ERone;endFill=0;startArrow=ERmany;startFill=0;fontSize=10;fontColor=#314B62;labelBackgroundColor=#FFFFFF;" edge="1" parent="1" source="${a}" target="${b}"><mxGeometry relative="1" as="geometry"/></mxCell>`);
  });
  const drawio=`<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" version="24.7.17" type="device"><diagram id="student_physical_core" name="P1-D Physical 6 tables"><mxGraphModel dx="1850" dy="950" grid="1" gridSize="10" page="1" pageWidth="2130" pageHeight="1000"><root>${cells.join("\n")}</root></mxGraphModel></diagram></mxfile>\n`;
  const svg=['<svg xmlns="http://www.w3.org/2000/svg" width="2130" height="1000" viewBox="0 0 2130 1000">','<rect width="100%" height="100%" fill="#F8FAFC"/>','<text x="50" y="70" font-family="Arial" font-size="27" font-weight="700" fill="#17304E">P1-D | STUDENT PROFILE + CHARACTER CORE</text>','<text x="50" y="110" font-family="Arial" font-size="15" fill="#53677D">6 physical candidate tables · 9 SQL FKs + 2 P0 context edges · RLS deny by default</text>'];
  const cmap=new Map(cards.map(c=>[c.id,c]));
  for(const e of links){const a=cmap.get(e.from),b=cmap.get(e.to);const x1=a.x+a.w/2,y1=a.y+a.h/2,x2=b.x+b.w/2,y2=b.y+b.h/2,m=(x1+x2)/2;svg.push(`<path d="M${x1},${y1}L${m},${y1}L${m},${y2}L${x2},${y2}" fill="none" stroke="#7695AC" opacity=".5" stroke-width="1.5"/>`);}
  for(const c of cards){
    svg.push(`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="9" fill="${c.xref?"#F0F5FA":"#FFFFFF"}" stroke="${c.color}" stroke-width="2"/>`,`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="42" rx="9" fill="${c.color}"/>`,`<text x="${c.x+10}" y="${c.y+28}" font-size="15" font-weight="700" font-family="Arial" fill="white">${esc(c.id)}</text>`);
    c.cols.forEach((f,k)=>svg.push(`<text x="${c.x+12}" y="${c.y+62+k*24}" font-family="monospace" font-size="12" fill="#284259">${esc((f.key||"  ")+"  "+f.name+" : "+f.type)}</text>`));
  }
  svg.push('<text x="2080" y="960" text-anchor="end" font-family="Arial" font-size="12" fill="#75889A">Development / CI schema only. No student auth policy or runtime grants.</text>','</svg>');
  return {drawio,svg:svg.join("\n")+"\n",count:links.length,rows:cards};
};
const sql=readFileSync(resolve(root,"db/migrations/0003_student_character_core_candidate.sql"),"utf8");
const output=buildPhysical(sql);
const pair=[
["docs/database/student-universe/Student_Character_Core_Physical.drawio",output.drawio],
["docs/database/student-universe/Student_Character_Core_Physical.svg",output.svg]
];
const check=process.argv.includes("--check"),errors=[];
for(const [p,s] of pair){const full=resolve(root,p);
if(check){if(readFileSync(full,"utf8")!==s)errors.push(p);}
else writeFileSync(full,s,"utf8")}
console.log(JSON.stringify({erDiagram:"P1-D",physical_tables:6,FKs:output.count,check,mismatches:errors}));
if(errors.length)process.exitCode=1;
