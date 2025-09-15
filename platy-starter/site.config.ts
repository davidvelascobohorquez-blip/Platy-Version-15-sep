export const site = {
  brand: "platy",
  tagline: "Menús inteligentes, ahorro real",
  domain: process.env.NEXT_PUBLIC_DOMAIN || "platty-pro.vercel.app",
  languages: ["es", "en"] as const,
  pricing: { lifetimeUSD: 9.99 },
  trials: { free: Number(process.env.PLATY_TRIALS_FREE || 3) },
  copy: {
    lifetimePitch: {
      es: "Acceso de por vida. 3 intentos gratis para probar.",
      en: "Lifetime access. 3 free tries to test it."
    }
  }
};
