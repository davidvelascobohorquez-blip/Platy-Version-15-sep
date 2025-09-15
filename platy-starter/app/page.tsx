"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { t, type Lang } from "@/lib/i18n";
import { pickCurrencyByNavigator, formatMoney } from "@/lib/currency";
import { site } from "@/site.config";

export default function Page(){
  const lang: Lang = typeof navigator !== "undefined" && navigator.language.startsWith("en") ? "en" : "es";
  const m = pickCurrencyByNavigator();
  return (
    <main className="min-h-screen">
      <Navbar lang={lang} />
      <section className="bg-white">
        <div className="container py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{t(lang,"hero_title")}</h1>
            <p className="text-stone mt-3 text-lg">{t(lang,"hero_sub")}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/demo" className="px-6 py-3 rounded-xl bg-ink text-white">{t(lang,"cta_try")}</Link>
              <a href="#pricing" className="px-6 py-3 rounded-xl border border-line">
                {t(lang,"pricing_lifetime")} · {formatMoney(site.pricing.lifetimeUSD*4100, m)}
              </a>
            </div>
            <p className="text-xs text-stone mt-2">{site.copy.lifetimePitch[lang]}</p>
          </div>
          <div className="rounded-xl border border-line shadow-soft p-4 bg-cloud">
            <img src="/og.jpg" alt="Preview" className="rounded-lg"/>
          </div>
        </div>
      </section>
      <section id="how" className="bg-cloud">
        <div className="container py-16">
          <h2 className="text-3xl font-bold">{t(lang,"how_title")}</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <CardStep n="1" text={t(lang,"how_1")} />
            <CardStep n="2" text={t(lang,"how_2")} />
            <CardStep n="3" text={t(lang,"how_3")} />
          </div>
        </div>
      </section>
      <section id="benefits" className="bg-white">
        <div className="container py-16">
          <h2 className="text-3xl font-bold">{t(lang,"benefits_title")}</h2>
          <ul className="mt-6 grid md:grid-cols-2 gap-4">
            {["Ahorra dinero comprando lo justo","Recetas rápidas y variadas","Lista de compras consolidada","PDF con costos en tu moneda","Batching y sobrantes planificados","Funciona en español e inglés"].map((s,i)=>(
              <li key={i} className="bg-card rounded-xl p-4 shadow-soft border border-line">• {s}</li>
            ))}
          </ul>
        </div>
      </section>
      <section id="pricing" className="bg-cloud">
        <div className="container py-16">
          <h2 className="text-3xl font-bold">{t(lang,"pricing_title")}</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-line">
              <h3 className="font-semibold">Free</h3>
              <p className="text-stone mt-1">3 intentos / 3 tries</p>
              <Link href="/demo" className="mt-4 inline-block px-4 py-2 rounded-xl border border-line">Probar</Link>
            </div>
            <div className="bg-card rounded-xl p-6 border border-line">
              <h3 className="font-semibold">{t(lang,"pricing_lifetime")}</h3>
              <p className="text-stone mt-1">USD {site.pricing.lifetimeUSD} · {formatMoney(site.pricing.lifetimeUSD*4100, m)} ref</p>
              <form method="POST" action="/api/stripe/checkout" className="mt-4">
                <button className="px-4 py-2 rounded-xl bg-ink text-white">{t(lang,"pricing_pay")}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-line">
        <div className="container py-8 text-sm flex items-center justify-between">
          <div>© {new Date().getFullYear()} platy</div>
          <div className="flex gap-4">
            <a href="/terms">Términos</a>
            <a href="/privacy">Privacidad</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
function CardStep({n,text}:{n:string;text:string}){
  return (
    <div className="bg-card rounded-xl p-6 border border-line">
      <div className="w-8 h-8 rounded-full bg-sun text-ink font-bold grid place-items-center">{n}</div>
      <p className="mt-3 text-graphite">{text}</p>
    </div>
  );
}
