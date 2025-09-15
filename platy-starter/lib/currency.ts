export type Money = { code: string; symbol: string; perCOP: number; locale: string };
export const FX: Record<string, Money> = {
  COP: { code: "COP", symbol: "$",  perCOP: 1,        locale: "es-CO" },
  MXN: { code: "MXN", symbol: "$",  perCOP: 1/240,    locale: "es-MX" },
  CLP: { code: "CLP", symbol: "$",  perCOP: 1/5,      locale: "es-CL" },
  PEN: { code: "PEN", symbol: "S/", perCOP: 1/1100,   locale: "es-PE" },
  ARS: { code: "ARS", symbol: "$",  perCOP: 1/10,     locale: "es-AR" },
  BRL: { code: "R$", symbol: "R$",  perCOP: 1/800,    locale: "pt-BR" },
  USD: { code: "USD", symbol: "$",  perCOP: 1/4100,   locale: "en-US" },
  EUR: { code: "EUR", symbol: "€",  perCOP: 1/4600,   locale: "es-ES" }
};
export function pickCurrencyByNavigator(): Money {
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || "es-ES";
    if (lang.includes("US")) return FX.USD;
    if (lang.includes("MX")) return FX.MXN;
    if (lang.includes("CL")) return FX.CLP;
    if (lang.includes("PE")) return FX.PEN;
    if (lang.includes("AR")) return FX.ARS;
    if (lang.includes("BR")) return FX.BRL;
    if (lang.includes("CO")) return FX.COP;
    if (lang.includes("ES")) return FX.EUR;
  }
  return FX.USD;
}
export function formatMoney(valueCOP: number, m: Money) {
  const v = valueCOP * m.perCOP;
  return new Intl.NumberFormat(m.locale, { style: "currency", currency: m.code }).format(v);
}
