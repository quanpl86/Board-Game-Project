#!/usr/bin/env node
/** Design-only: 30 editable Draw.io tabs from student_universe_extension_candidate.json. */
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const makeDrawio=function makeDrawio(model){
 const entities=model.tables,links=model.relationships,groups=[...new Set(entities.map(t=>t.domain))];
 const map=new Map(entities.map(t=>[t.id,t]));
 const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
 const slug=s=>s.replace(/[^A-Za-z0-9_]/g,"_");
 const palette=["#2D699A","#AA6039","#7A5AA5","#238B7E","#9A6570","#3977AB","#8C752F"];
 const color=d=>palette[groups.indexOf(d)]||"#66798B";
 const card=(name,x,y,full=false)=>{let t=map.get(name);return{name,x,y,full,w:full?370:320,h:full?43+23*t.columns.length:65,domain:t?.domain||"external"};};
 const pages=[];
 let overview=[],cols=[75,495,915,1335],h=150;
 const bundles=[["student","progress"],["characters","creations"],["ownership","achievements"],["economy"]];
 for(let i=0;i<bundles.length;i++){let y=155;for(const d of bundles[i]){for(const t of entities.filter(t=>t.domain===d)){overview.push(card(t.id,cols[i],y));y+=79;}y+=45;}h=Math.max(h,y);}
 pages.push({name:"00 All 22 tables",boxes:overview,edges:links.filter(e=>e.scope==="extension"),width:1790,height:h+100});
 for(const d of groups){let boxes=[],y=[150,150,150],x=[70,540,1030];const own=entities.filter(t=>t.domain===d);
  own.forEach((t,i)=>{let k=i%2,c=card(t.id,x[k],y[k],true);boxes.push(c);y[k]+=c.h+40;});
  const edges=links.filter(e=>e.from.startsWith(d+".")||e.to.startsWith(d+"."));
  const outside=[...new Set(edges.flatMap(e=>[e.from,e.to]).filter(id=>!id.startsWith(d+".")))];
  for(const id of outside){boxes.push(card(id,x[2],y[2]));y[2]+=79;}
  pages.push({name:"Domain "+d,boxes,edges,width:1470,height:Math.max(...y)+100});
 }
 for(const t of entities){const edges=links.filter(e=>e.from===t.id||e.to===t.id);
  const neighbors=[...new Set(edges.flatMap(e=>[e.from,e.to]).filter(id=>id!==t.id))];
  const left=neighbors.filter(id=>edges.some(e=>e.from===id&&e.to===t.id)),right=neighbors.filter(id=>!left.includes(id));
  let y1=155,y2=155,boxes=[card(t.id,545,190,true)];
  for(const id of left){boxes.push(card(id,50,y1));y1+=80;}
  for(const id of right){boxes.push(card(id,1030,y2));y2+=80;}
  pages.push({name:t.id,boxes,edges,width:1450,height:Math.max(y1,y2,boxes[0].y+boxes[0].h)+100});
 }
 let diagrams=[];
 for(let p=0;p<pages.length;p++){
  const page=pages[p],cells=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
  const vert=(id,val,style,x,y,w,h,parent="1")=>cells.push('<mxCell id="'+id+'" value="'+esc(val)+'" style="'+style+'" vertex="1" parent="'+parent+'"><mxGeometry x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" as="geometry"/></mxCell>');
  vert("caption","STUDENT UNIVERSE | "+page.name+" — DESIGN CANDIDATE / NO SQL","text;html=0;fontStyle=1;fontSize=20;fontColor=#15304A;align=left;",40,40,page.width-70,50);
  for(const c of page.boxes){
    const id="t_"+slug(c.name),clr=color(c.domain);
    if(!c.full){vert(id,c.name,"rounded=1;whiteSpace=wrap;html=0;fillColor=#FFFFFF;strokeColor="+clr+";strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#18334F;",c.x,c.y,c.w,c.h);continue;}
    vert(id,c.name,"swimlane;horizontal=1;startSize=43;rounded=1;whiteSpace=wrap;html=0;fillColor="+clr+";swimlaneFillColor=#FFFFFF;strokeColor="+clr+";strokeWidth=2;fontSize=15;fontStyle=1;fontColor=#FFFFFF;container=1;collapsible=0;",c.x,c.y,c.w,c.h);
    map.get(c.name).columns.forEach((f,i)=>vert(id+"_f_"+slug(f.name),(f.pk?"PK":f.reference?"FK":"")+"  "+f.name+" : "+f.type,"text;html=0;whiteSpace=wrap;align=left;spacingLeft=8;fontSize=12;fontFamily=Consolas;fillColor="+(i%2?"#F2F6FA":"#FFFFFF")+";fontColor=#274056;",0,43+i*23,c.w,23,id));
  }
  page.edges.forEach((e,i)=>{const a=page.boxes.find(b=>b.name===e.from),b=page.boxes.find(b=>b.name===e.to);if(!a||!b)return;
    const from="t_"+slug(e.from),to="t_"+slug(e.to);
    cells.push('<mxCell id="edge_'+i+'" value="'+esc(e.from_column)+'" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor='+color(a.domain)+';strokeWidth=1.3;endArrow=ERone;endFill=0;startArrow=ERmany;startFill=0;fontSize=9;labelBackgroundColor=#FFFFFF;" edge="1" parent="1" source="'+from+'" target="'+to+'"><mxGeometry relative="1" as="geometry"/></mxCell>');
  });
  diagrams.push('<diagram id="student_pg_'+p+'" name="'+esc(page.name)+'"><mxGraphModel dx="1420" dy="830" grid="1" page="1" pageWidth="'+page.width+'" pageHeight="'+page.height+'"><root>'+cells.join("")+'</root></mxGraphModel></diagram>');
 }
 return '<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" version="24.7.17" type="device">'+diagrams.join("")+'</mxfile>\n';
};
const input=JSON.parse(readFileSync(resolve(root,"db/schema/student_universe_extension_candidate.json"),"utf8"));
const output=makeDrawio(input);
const file=resolve(root,"docs/database/student-universe/Student_Universe_Editable.drawio");
if(process.argv.includes("--check")){const current=readFileSync(file,"utf8");if(current!==output){console.error("Student Draw.io must be regenerated");process.exitCode=1;}else console.log("Student Draw.io reproducible (30 pages)");}
else{writeFileSync(file,output);console.log("Regenerated 30-page student Draw.io");}
