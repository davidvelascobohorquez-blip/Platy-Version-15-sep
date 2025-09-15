export type Lang = "es" | "en";
export const dict: Record<Lang, Record<string,string>> = {
  es: {
    nav_demo: "Probar",
    nav_pricing: "Precios",
    nav_how: "Cómo funciona",
    nav_benefits: "Beneficios",
    cta_try: "Generar mi menú",
    hero_title: "Menús inteligentes, ahorro real",
    hero_sub: "Planifica tu semana en minutos. Compra lo justo y cocina fácil.",
    how_title: "Cómo funciona",
    how_1: "Cuéntanos tu ciudad, personas y preferencias",
    how_2: "Generamos tu semana con recetas y costos",
    how_3: "Descarga el PDF listo para ir al súper",
    benefits_title: "Pensado para el día a día",
    pricing_title: "Precios",
    pricing_lifetime: "Acceso de por vida",
    pricing_pay: "Comprar ahora",
    testimonials_title: "Lo que dicen",
    faq_title: "Preguntas frecuentes"
  },
  en: {
    nav_demo: "Try",
    nav_pricing: "Pricing",
    nav_how: "How it works",
    nav_benefits: "Benefits",
    cta_try: "Generate my plan",
    hero_title: "Smart menus, real savings",
    hero_sub: "Plan your week in minutes. Buy just enough and cook easily.",
    how_title: "How it works",
    how_1: "Tell us your city, people and preferences",
    how_2: "We create your weekly plan with costs",
    how_3: "Download the PDF and go shopping",
    benefits_title: "Designed for everyday life",
    pricing_title: "Pricing",
    pricing_lifetime: "Lifetime access",
    pricing_pay: "Buy now",
    testimonials_title: "What users say",
    faq_title: "FAQ"
  }
};
export function t(lang: Lang, key: string){ return dict[lang]?.[key] || key; }
