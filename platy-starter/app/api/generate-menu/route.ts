import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import OpenAI from 'openai'
import pricebook from '@/data/pricebook.co.json' assert { type: 'json' }

export const runtime = 'nodejs'

type Unit = 'g' | 'ml' | 'ud'
type ItemQty = { name: string; qty: number; unit: Unit; estCOP?: number }
type Plan = {
  menu: { dia: number; plato: string; ingredientes: ItemQty[]; pasos: string[]; tip?: string }[]
  lista: Record<string, ItemQty[]>
  batch: { baseA?: string; baseB?: string }
  sobrantes: string[]
  meta: { ciudad: string; personas: number; modo: string; moneda: 'COP' }
  costos?: { porCategoria: Record<string, number>; total: number; nota?: string }
}

const TRIALS_FREE = Number(process.env.PLATY_TRIALS_FREE || 3)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any))
  const { ciudad = 'Bogotá', personas = 2, modo = 'Económico', prefs = [] } = body || {}

  const store = cookies()
  const trialsCookie = store.get('platy_trials')?.value
  const trials = Number(trialsCookie || 0)
  const paidCookie = store.get('platy_paid')?.value === 'true'
  const licenseHeader = req.headers.get('x-platy-license') || store.get('platy_license')?.value
  const hasLicense = paidCookie || (!!licenseHeader && licenseHeader === process.env.PLATY_LIFETIME_CODE)

  if (!hasLicense && trials >= TRIALS_FREE) {
    return NextResponse.json(
      { error: `Has usado tus ${TRIALS_FREE} intentos gratis. Compra el acceso de por vida para continuar.`, code: 'TRIALS_EXCEEDED' },
      { status: 402, headers: { 'x-platy-trials': String(trials), 'x-platy-has-license': 'false' } }
    )
  }

  let plan: Plan | null = null
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const prompt = `
Eres un chef planificador. Devuelve solo JSON.
Schema:
{
  "menu": [
    { "dia": 1..7, "plato": "string", "ingredientes": [ { "name":"string", "qty": number, "unit":"g|ml|ud" } ], "pasos": ["..."], "tip":"..." }
  ],
  "lista": { "Verduras":[ItemQty], "Proteínas":[ItemQty], "Granos":[ItemQty], "Lácteos":[ItemQty], "Otros":[ItemQty] },
  "batch": { "baseA": "string", "baseB": "string" },
  "sobrantes": ["string"],
  "meta": { "ciudad":"${ciudad}", "personas": ${personas}, "modo":"${modo}", "moneda":"COP" }
}
Reglas: cantidades por persona, platos prácticos LATAM, modo=${modo}, prefs=${JSON.stringify(prefs)}.
`
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        { role: 'system', content: 'Eres un chef planificador que devuelve estrictamente JSON válido.' },
        { role: 'user', content: prompt }
      ]
    })
    const content = chat.choices?.[0]?.message?.content?.trim() || '{}'
    plan = JSON.parse(content) as Plan
  } catch (_) { plan = null }

  if (!plan || !Array.isArray(plan.menu) || plan.menu.length !== 7) {
    plan = fallbackPlan(ciudad, personas, modo)
  }

  const withCosts = computeCosts(plan, ciudad)
  const res = NextResponse.json(withCosts, { headers: { 'x-platy-has-license': String(hasLicense), 'x-platy-trials': String(trials) } })
  if (hasLicense) res.cookies.set('platy_paid', 'true', { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 })
  else res.cookies.set('platy_trials', String(trials + 1), { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 })
  return res
}

function fallbackPlan(ciudad: string, personas: number, modo: string): Plan {
  const per = personas
  const dish = (dia:number, plato:string, ing:ItemQty[], pasos:string[], tip?:string)=>({ dia, plato, ingredientes:ing, pasos, tip })
  const g = (name:string, qty:number, unit:Unit):ItemQty => ({ name, qty: Math.round(qty*per), unit })
  const menu = [
    dish(1, 'Arroz con pollo', [g('arroz',80,'g'), g('pollo',150,'g'), g('zanahoria',60,'g'), g('cebolla',40,'g')], ['Cocer arroz','Saltear pollo','Mezclar todo']),
    dish(2, 'Pasta con tomate', [g('pasta',90,'g'), g('tomate',120,'g'), g('queso',20,'g')], ['Cocer pasta','Salsa de tomate','Servir con queso']),
    dish(3, 'Arepa con huevo', [g('arepa',1,'ud'), g('huevo',1,'ud')], ['Asar arepa','Freír huevo','Servir']),
    dish(4, 'Ensalada completa', [g('lechuga',80,'g'), g('tomate',100,'g'), g('atun',100,'g')], ['Cortar','Mezclar','Aliñar']),
    dish(5, 'Sopa de verduras', [g('papa',120,'g'), g('zanahoria',80,'g'), g('cebolla',40,'g')], ['Hervir','Sazonar','Servir caliente']),
    dish(6, 'Tortilla de queso', [g('huevo',2,'ud'), g('queso',30,'g')], ['Batir huevos','Cuajar en sartén','Añadir queso']),
    dish(7, 'Arroz con lentejas', [g('arroz',70,'g'), g('lentejas',90,'g'), g('cebolla',30,'g')], ['Cocer lentejas','Cocer arroz','Unir y servir'])
  ]
  const lista: Record<string, ItemQty[]> = {
    Verduras: [g('zanahoria',140,'g'), g('cebolla',110,'g'), g('tomate',220,'g'), g('lechuga',80,'g'), g('papa',120,'g')],
    Proteínas: [g('pollo',150,'g'), g('huevo',3,'ud'), g('atun',100,'g')],
    Granos: [g('arroz',220,'g'), g('pasta',90,'g'), g('lentejas',90,'g'), g('arepa',1,'ud')],
    Lácteos: [g('queso',50,'g')],
    Otros: []
  }
  return { menu, lista, batch: { baseA: 'Sofrito 3 días', baseB: 'Caldo base' }, sobrantes: ['Arroz cocido'], meta: { ciudad, personas, modo, moneda: 'COP' } }
}

function computeCosts(plan: Plan, ciudad: string): Plan {
  const multipliers: Record<string, number> = (pricebook as any).cityMultipliers || {}
  const ingredients: Record<string, { unit: string; price: number }> = (pricebook as any).ingredients || {}
  const cityK = multipliers[ciudad] ?? 1.0

  const allItems: ItemQty[] = [
    ...plan.menu.flatMap(m => m.ingredientes),
    ...Object.values(plan.lista||{}).flatMap(arr => arr)
  ]

  let total = 0
  const priceByCategory: Record<string, number> = {}

  for (const it of allItems) {
    const key = it.name.toLowerCase()
    const pb = ingredients[key]
    let est = 0
    if (pb) {
      const unit = pb.unit
      const price = pb.price * cityK
      if (unit === 'kg' && it.unit === 'g') est = price * (it.qty/1000)
      else if (unit === 'l' && it.unit === 'ml') est = price * (it.qty/1000)
      else if (unit === 'ud' && it.unit === 'ud') est = price * it.qty
      else if (unit === 'kg' && it.unit === 'ud') est = price * it.qty * 0.15
      else if (unit === 'ud' && (it.unit === 'g' || it.unit === 'ml')) est = price * (it.qty/100)
      else est = price * 0.1
    } else {
      est = 500 * (it.unit==='ud'? it.qty : it.qty/100)
    }
    it.estCOP = Math.round(est)
    total += it.estCOP
  }

  for (const [cat, items] of Object.entries(plan.lista||{})) {
    priceByCategory[cat] = items.reduce((acc, it)=> acc + (it.estCOP||0), 0)
  }

  plan.costos = { porCategoria: priceByCategory, total: Math.round(total), nota: 'Estimado con pricebook local. Puede variar por tienda/temporada.' }
  return plan
}
