const enc=new TextEncoder(),hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
async function hash(pw,salt){const k=await crypto.subtle.importKey("raw",enc.encode(pw),"PBKDF2",false,["deriveBits"]);return hex(await crypto.subtle.deriveBits({name:"PBKDF2",salt:enc.encode(salt),iterations:100000,hash:"SHA-256"},k,256))}
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json"}});
export async function onRequestPost({request,env}){
 const {action,user,pw}=await request.json().catch(()=>({}));const u=String(user||"").toLowerCase().trim();
 if(!/^[a-z0-9_]{3,20}$/.test(u)||String(pw||"").length<6)return J({error:"3-20 a-z0-9_ / pw min 6"},400);
 const rec=await env.KV.get("u:"+u,"json");
 if(action==="register"){if(rec)return J({error:"exists"},409);const salt=hex(crypto.getRandomValues(new Uint8Array(16)));await env.KV.put("u:"+u,JSON.stringify({salt,h:await hash(pw,salt)}))}
 else if(!rec||rec.h!==await hash(pw,rec.salt))return J({error:"invalid"},401);
 const token=hex(crypto.getRandomValues(new Uint8Array(24)));await env.KV.put("t:"+token,u,{expirationTtl:2592000});return J({token});}
