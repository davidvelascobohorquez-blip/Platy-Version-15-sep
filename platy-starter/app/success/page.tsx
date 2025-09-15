"use client";
import { useEffect, useState } from "react";
export default function SuccessPage(){
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  useEffect(()=>{
    const url = new URL(window.location.href);
    const sid = url.searchParams.get("session_id");
    if(!sid) { setErr("Missing session id"); return; }
    fetch(`/api/stripe/verify?session_id=${sid}`).then(r=>r.json()).then(d=>{
      if(d.ok){ setOk(true); } else { setErr(d.error||"Verify failed"); }
    }).catch(()=>setErr("Network error"));
  },[]);
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="bg-card rounded-xl p-6 border border-line shadow-soft max-w-md">
        {ok ? (<><h1 className="text-2xl font-bold">¡Listo! Tu acceso está activo</h1><p className="text-stone mt-2">Ya puedes generar menús sin límite.</p></>)
             : (<p className="text-stone">Verificando pago… {err && <span className="text-red-500">{err}</span>}</p>)}
      </div>
    </main>
  );
}
