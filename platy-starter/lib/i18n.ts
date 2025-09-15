export type Lang = "es" | "en";

export const dict: Record<Lang, any> = {
  es: {
    nav: { demo: "Probar", pricing: "Precios", how: "Cómo funciona", benefits: "Beneficios" },
    hero: {
      title: "Menús inteligentes, ahorro real",
      chip1: "Ahorra hasta 30% en la compra",
      chip2: "3 intentos gratis",
      sub: "Planifica tu semana en minutos. Compra lo justo y cocina fácil."
    },
    cta: { try: "Generar mi menú", pay: "Comprar ahora" },
    how: { title: "Cómo funciona", s1: "Cuéntanos tu ciudad, personas y preferencias", s2: "Generamos tu semana con recetas y costos", s3: "Descarga el PDF listo para ir al súper" },
    benefits: {
      title: "Pensado para el día a día",
      items: [
        "Lista de compras consolidada",
        "Costos estimados en tu moneda",
        "Recetas rápidas (≤30min)",
        "Aprovecha sobrantes",
        "Bajo presupuesto opcional",
        "ES/EN listo"
      ]
    },
    pricing: { title: "Precios", lifetime: "Acceso de por vida", freeNote: "3 intentos / 3 tries" }
  },
  en: {
    nav: { demo: "Try", pricing: "Pricing", how: "How it works", benefits: "Benefits" },
    hero: {
      title: "Smart menus, real savings",
      chip1: "Save up to 30% on groceries",
      chip2: "3 free tries",
      sub: "Plan your week in minutes. Buy just enough and cook easily."
    },
    cta: { try: "Generate my plan", pay: "Buy now" },
    how: { title: "How it works", s1: "Tell us your city, people and preferences", s2: "We create your weekly plan with costs", s3: "Download the PDF and go shopping" },
    benefits: {
      title: "Designed for everyday life",
      items: [
        "Unified shopping list",
        "Estimated costs in your currency",
        "Quick recipes (≤30min)",
        "Use leftovers smartly",
        "Budget-friendly option",
        "ES/EN ready"
      ]
    },
    pricing: { title: "Pricing", lifetime: "Lifetime access", freeNote: "3 free tries" }
  }
};

export function t(lang: Lang, path: string): any {
  const keys = path.split(".");
  // @ts-ignore
  return keys.reduce((a,k)=> (a && a[k]!==undefined ? a[k] : null), dict[lang]) ?? path;
}

