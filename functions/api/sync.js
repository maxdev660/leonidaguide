const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json"}});
const who=(r,e)=>e.KV.get("t:"+(r.headers.get("authorization")||"").slice(7));
export async function onRequestGet({request,env}){const u=await who(request,env);if(!u)return J({error:"auth"},401);return J({data:await env.KV.get("d:"+u,"json")})}
export async function onRequestPut({request,env}){const u=await who(request,env);if(!u)return J({error:"auth"},401);const b=await request.text();if(b.length>200000)return J({error:"big"},413);await env.KV.put("d:"+u,b);return J({ok:1})}
