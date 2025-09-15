'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { makePlanPdf } from '@/components/PlanPDF'

type Unit = 'g' | 'ml' | 'ud'
type ItemQty = { name: string; qty: number; unit: Unit; estCOP?: number }
type Plan = {
  menu: { dia: number; plato: string; ingredientes: ItemQty[]; pasos: string[]; tip?: string }[];
  lista: Record<string, ItemQty[]>;
  batch: { baseA?: string; baseB?: string };
  sobrantes: string[];
  meta: { ciudad: string; personas: number; modo: string; moneda: 'COP' };
  costos?: { porCategoria: Record<string, number>; total: number; nota?: string }
}

export default function DemoPage(){
  const [ciudad, setCiudad] = useState('Bogotá')
  const [personas, setPersonas] = useState(2)
  const [modo, setModo] = useState('Económico')
  const [prefs, setPrefs] = useState<string[]>(['Rápido (≤30 min)'])
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  async function generar(){
    setLoading(true); setPdfUrl(null); setPlan(null)
    const res = await fetch('/api/generate-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciudad, personas, modo, prefs })
    })
    const data = await res.json()
    setPlan(data); setLoading(false)
  }

  async function descargarPDF(){
    if(!plan) return
    const { url, filename } = await makePlanPdf(plan, 'es')
    setPdfUrl(url)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  }

  useEffect(()=> () => { if(pdfUrl) URL.revokeObjectURL(pdfUrl) }, [pdfUrl])

  return (
    <main>
      <Navbar />
      <section className="container py-10">
        <h1 className="text-2xl font-bold">Generar menú</h1>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-line">
            <label className="text-sm">Ciudad</label>
            <input value={ciudad} onChange={e=>setCiudad(e.target.value)} className="mt-1 w-full border border-line rounded-lg px-3 py-2" placeholder="Ej. Bogotá"/>
            <label className="text-sm mt-3 block">Personas</label>
            <input type="number" value={personas} min={1} onChange={e=>setPersonas(Number(e.target.value))} className="mt-1 w-full border border-line rounded-lg px-3 py-2"/>
            <label className="text-sm mt-3 block">Modo</label>
            <select value={modo} onChange={e=>setModo(e.target.value)} className="mt-1 w-full border border-line rounded-lg px-3 py-2">
              <option>Económico</option>
              <option>Rápido (≤30 min)</option>
              <option>Vegetariano</option>
              <option>Alto en proteína</option>
              <option>Sin gluten</option>
              <option>Sin lactosa</option>
              <option>Bajo en carbohidratos</option>
              <option>Apto para niños</option>
              <option>Sin azúcar añadida</option>
            </select>
            <button onClick={generar} className="mt-4 px-4 py-2 rounded-xl bg-ink text-white" disabled={loading}>
              {loading ? 'Generando…' : 'Generar'}
            </button>
          </div>

          <div className="md:col-span-2 bg-card rounded-xl p-4 border border-line">
            {!plan && <p className="text-stone">Completa los datos y pulsa “Generar”.</p>}
            {plan && (
              <div>
                <h2 className="font-semibold">Vista previa</h2>
                <p className="text-sm text-stone">Ciudad: {plan.meta.ciudad} · Personas: {plan.meta.personas} · Modo: {plan.meta.modo}</p>
                <ul className="mt-3 grid md:grid-cols-2 gap-3">
                  {plan.menu.map(d => (
                    <li key={d.dia} className="border border-line rounded-lg p-3">
                      <div className="font-semibold">Día {d.dia}: {d.plato}</div>
                      <div className="text-xs text-stone">Ingredientes: {d.ingredientes.map(i=>`${i.name} ${i.qty}${i.unit}`).join(', ')}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3">
                  <button onClick={descargarPDF} className="px-4 py-2 rounded-xl bg-ink text-white">Descargar PDF</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
