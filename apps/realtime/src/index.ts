import http from "node:http";
// Foundation health-only service. No unvalidated game rooms or WebSocket moves.
const port=Number(process.env.REALTIME_PORT??4001),host=process.env.REALTIME_HOST??"127.0.0.1";
const server=http.createServer((req,res)=>{res.setHeader("content-type","application/json; charset=utf-8");if(req.url==="/health"&&req.method==="GET"){res.writeHead(200).end(JSON.stringify({service:"bgu-realtime",status:"ok",roomsEnabled:false}));return;}res.writeHead(503).end(JSON.stringify({code:"ROOMS_NOT_ENABLED"}));});
server.listen(port,host,()=>console.log(`Realtime foundation: http://${host}:${port}`));
for(const signal of ["SIGINT","SIGTERM"] as const)process.on(signal,()=>server.close(()=>process.exit(0)));
