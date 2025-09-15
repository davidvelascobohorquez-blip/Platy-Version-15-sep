import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

type AnyPlan = any;

const styles = StyleSheet.create({
  page: { padding: 28, color: "#0F172A", fontSize: 11 },
  h1: { fontSize: 22, fontWeight: 800, marginBottom: 6 },
  h2: { fontSize: 14, fontWeight: 700, marginTop: 10, marginBottom: 6 },
  small: { fontSize: 9, color: "#6B7280" },
  chip: { fontSize: 9, padding: 4, borderRadius: 6, border: "1px solid #E5E7EB", marginRight: 6 },
  card: { padding: 12, borderRadius: 12, border: "1px solid #E5E7EB", marginBottom: 10 },
  row: { flexDirection: "row", gap: 8 },
  col: { flex: 1 },
  li: { marginBottom: 2 }
});

export function PlanPDF({ plan }: { plan: AnyPlan }) {
  const meta = plan?.meta ?? {};
  const city = meta.city || meta.ciudad || "—";
  const people = meta.people || meta.personas || "—";
  const budget = meta.budget || meta.presupuesto || "—";
  const week = meta.week || meta.semana || "—";
  const currency = meta.currency || meta.moneda || "USD";

  const costs = plan?.costs || plan?.costos || {};
  const total = costs.total || costs.estimado || plan?.total || "—";

  const menu = plan?.menu || plan?.semana || [];
  const list = plan?.shopping || plan?.lista || plan?.compras || [];

  return (
    <Document>
      <Page style={styles.page}>
        {/* Portada */}
        <View style={styles.card}>
          <Text style={styles.h1}>Platy — Menú semanal</Text>
          <Text style={styles.small}>Menús inteligentes, ahorro real</Text>
          <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap" }}>
            <Text style={styles.chip}>Ciudad: {city}</Text>
            <Text style={styles.chip}>Personas: {people}</Text>
            <Text style={styles.chip}>Semana: {week}</Text>
            <Text style={styles.chip}>Presupuesto: {budget}</Text>
          </View>
        </View>

        {/* Costos */}
        <View style={[styles.card, { backgroundColor: "#FFF8E1", borderColor: "#FDE68A" }]}>
          <Text style={styles.h2}>Costo estimado</Text>
          <Text style={{ fontSize: 18, fontWeight: 800 }}>{currency} {String(total)}</Text>
          <Text style={styles.small}>Estos valores son referenciales y pueden variar por tienda/temporada.</Text>
        </View>

        {/* Menú día a día */}
        <Text style={styles.h2}>Menú (día a día)</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            {menu.slice(0,4).map((d:any, i:number)=>(
              <View key={i} style={styles.card}>
                <Text style={{ fontWeight: 700 }}>{d?.day || d?.dia || `Día ${i+1}`}</Text>
                <Text>{d?.title || d?.nombre || d?.receta || "Receta"}</Text>
                {d?.ingredients && (
                  <Text style={styles.small}>Ing: {(d.ingredients as string[]).join(", ")}</Text>
                )}
                {d?.steps && <Text style={styles.small}>Prep: {(d.steps as string[]).join(" · ")}</Text>}
              </View>
            ))}
          </View>
          <View style={styles.col}>
            {menu.slice(4).map((d:any, i:number)=>(
              <View key={i} style={styles.card}>
                <Text style={{ fontWeight: 700 }}>{d?.day || d?.dia || `Día ${i+5}`}</Text>
                <Text>{d?.title || d?.nombre || d?.receta || "Receta"}</Text>
                {d?.ingredients && (
                  <Text style={styles.small}>Ing: {(d.ingredients as string[]).join(", ")}</Text>
                )}
                {d?.steps && <Text style={styles.small}>Prep: {(d.steps as string[]).join(" · ")}</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Lista de compras */}
        <Text style={styles.h2}>Lista de compras</Text>
        <View style={styles.card}>
          {(Array.isArray(list)? list : []).map((it:any, idx:number)=>(
            <Text key={idx} style={styles.li}>• {it?.name || it?.item || it} {it?.qty ? `— ${it.qty}` : ""}</Text>
          ))}
        </View>

        {/* CTA/Firma */}
        <View style={{ marginTop: 8 }}>
          <Text style={styles.small}>¿Quieres planear otra semana? Visita platy y genera tu PDF en minutos.</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function makePlanPdf(plan: AnyPlan) {
  const { blob } = await pdf(<PlanPDF plan={plan} />).toBlob();
  const url = URL.createObjectURL(blob);
  const filename = `platy_menu_${(plan?.meta?.city || plan?.meta?.ciudad || "semana")}.pdf`;
  return { blob, url, filename };
}
