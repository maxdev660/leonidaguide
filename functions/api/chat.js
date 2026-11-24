export async function onRequestPost({request,env}){
 const {messages=[],lang="en",spoiler=false}=await request.json().catch(()=>({}));
 const sys=`You are LeonidaGuide, an assistant for Grand Theft Auto VI (Leonida / Vice City). Answer in language code "${lang}". `+
 (spoiler?"Story spoilers are allowed.":"Do NOT reveal story spoilers.")+
 ` Only state what you are confident is true. If you are unsure or the information is unofficial or unverified, say so clearly. Never invent cheat codes, safe codes, map locations or prices. Be concise.`;
 const m=messages.slice(-10).map(x=>({role:x.role==="assistant"?"assistant":"user",content:String(x.content).slice(0,2000)}));
 try{const r=await env.AI.run("@cf/meta/llama-3.1-8b-instruct",{messages:[{role:"system",content:sys},...m]});
 return new Response(JSON.stringify({reply:r.response}),{headers:{"content-type":"application/json"}})}
 catch(e){return new Response(JSON.stringify({reply:"AI error"}),{status:500})}}
