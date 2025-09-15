import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from '@react-pdf/renderer';

type Plan = { /* plan structure here */ };

const styles = StyleSheet.create({
  page: { padding: 28, fontFamily: 'Inter', color: '#0F172A' },
  h1: { fontSize: 22, fontWeight: 800 },
  h2: { fontSize: 14, fontWeight: 700, marginBottom: 6 },
  small: { fontSize: 9, color: '#6B7280' },
  chip: { fontSize: 9, padding: 4, borderRadius: 6, border: '1px solid #E5E7EB', marginRight: 4 },
  card: { padding: 12, borderRadius: 12, border: '1px solid #E5E7EB', marginBottom: 10 },
  listItem: { fontSize: 11, marginBottom: 2 }
});

export default function PlanPDF({ plan }: { plan: Plan }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.h1}>Platy</Text>
        {/* Content like Costs, Menu, Shopping list */}
      </Page>
    </Document>
  );
}

export async function makePlanPdf(plan: Plan) {
  const doc = <PlanPDF plan={plan} />;
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const filename = `platy_menu_${plan.meta.ciudad}.pdf`;
  return { blob, url, filename };
}
