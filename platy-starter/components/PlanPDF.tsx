// PDF premium bilingüe + multimoneda
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from '@react-pdf/renderer'
import { pickCurrencyByNavigator, formatMoney } from '@/lib/currency'

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

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1Z7bx1vZ7r4.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQsn1fB3VQXt5f6tZVtw.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQkA7iG5WIrZgA8W8.woff2', fontWeight: 800 }
  ]
})

const styles = StyleSheet.create({
  page: { padding: 28, fontFamily: 'Inter' },
  h1: { fontSize: 20, fontWeight: 800 },
  h2: { fontSize: 14, fontWeight: 600, marginBottom: 6 },
  small: { fontSize: 9, color: '#6B7280' },
  card: { padding: 12, borderRadius: 12, border: '1px solid #E5E7EB', marginBottom: 8 },
  listItem: { fontSize: 11, marginBottom: 2 }
})

export default function PlanPDF({ plan, brand='platy', lang='es' as 'es'|'en' }: { plan: Plan; brand?: string; lang?: 'es'|'en' }){
  const now = new Date()
  const m = pickCurrencyByNavigator()
  const money = (v:number)=> formatMoney(v, m)
  const city = plan?.meta?.ciudad || ''
  const totalCOP = plan?.costos?.total || 0

  const Cover = () => (
    <View style={{ marginBottom: 16, flexDirection: 'row', justifyContent:'space-between', alignItems:'center' }}>
      <View>
        <Text style={styles.h1}>{brand}</Text>
        <Text style={styles.small}>{city} · {now.toLocaleDateString()}</Text>
      </View>
      <Image src="/brand/PLATY_logo_icon_1024.png" style={{ width: 36, height: 36, borderRadius: 8 }} />
    </View>
  )

  const Costos = () => (
    <View style={styles.card}>
      <Text style={styles.h2}>{lang==='es'?'Costos estimados':'Estimated costs'}</Text>
      <Text style={styles.listItem}>{lang==='es'?'Total semanal:':'Weekly total:'} {money(totalCOP)}</Text>
      {plan?.costos?.nota ? <Text style={styles.small}>{plan.costos.nota}</Text> : null}
    </View>
  )

  const ListaConsolidada = () => (
    <View style={styles.card}>
      <Text style={styles.h2}>{lang==='es'?'Lista de compras':'Shopping list'}</Text>
      {Object.entries(plan.lista||{}).map(([cat, items])=> (
        <View key={cat} style={{ marginBottom: 6 }}>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>{cat}</Text>
          {items.map((it,idx)=> (
            <Text key={idx} style={styles.listItem}>• {it.name} — {it.qty}{it.unit}</Text>
          ))}
        </View>
      ))}
    </View>
  )

  const Dias = () => (
    <View style={styles.card}>
      <Text style={styles.h2}>{lang==='es'?'Menú semanal':'Weekly menu'}</Text>
      {plan.menu.map((d)=> (
        <View key={d.dia} style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>Día {d.dia}: {d.plato}</Text>
          <Text style={styles.small}>{lang==='es'?'Ingredientes:':'Ingredients:'} {d.ingredientes.map(i=>`${i.name} ${i.qty}${i.unit}`).join(', ')}</Text>
          {d.pasos.map((p,i)=> <Text key={i} style={styles.listItem}>• {p}</Text>)}
          {d.tip ? <Text style={styles.small}>Tip: {d.tip}</Text> : null}
        </View>
      ))}
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Cover/>
        <Costos/>
        <Dias/>
        <ListaConsolidada/>
        <Text style={[styles.small, { marginTop: 8 }]}>Creado con {brand}. Genera tu plan en {process.env.NEXT_PUBLIC_DOMAIN || "platy.app"}.</Text>
      </Page>
    </Document>
  )
}

export async function makePlanPdf(plan: Plan, lang:'es'|'en'='es'){
  const doc = <PlanPDF plan={plan} lang={lang} />
  const blob = await pdf(doc).toBlob()
  const url = URL.createObjectURL(blob)
  const filename = `platy_menu_${(plan?.meta?.ciudad||'mi-ciudad').replace(/[^\w\-., ]/g,'')}.pdf`
  return { blob, url, filename }
}
