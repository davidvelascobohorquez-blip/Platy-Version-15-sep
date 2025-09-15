"use client";
import Navbar from "../components/Navbar";
import { t, type Lang } from "../lib/i18n";

function useLang(): Lang {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("platy_lang") as Lang | null;
    if (saved) return saved;
    return navigator.language.startsWith("en") ? "en" : "es";
  }
  return "es";
}

export default function Page(){
  const lang: Lang = useLang();
  const benefits = t(lang,"benefits.items") as string[];

  return (
    <main className="min-h-screen">
      <Navbar lang={lang} />

      {/* HERO */}
      <div className="hero-wrap">
        <div className="container py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="badge">✨ {t(lang,"hero.chip1")}</span>
              <span className="badge">🎁 {t(lang,"hero.chip2")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{t(lang,"hero.title")}</h1>
            <p className="text-[var(--muted)] mt-3 text-lg">{t(lang,"hero.sub")}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/demo" className="btn btn-primary">{t(lang,"cta.try")}</a>
              <a href="#pricing" className="btn btn-outline">USD 9.99 · Lifetime</a>
            </div>
          </div>
          <div className="card p-4">
            <img src="/og.jpg" alt="Preview" className="rounded-xl"/>
          </div>
        </div>
        <div className="hero-wave" />
      </div>

      {/* HOW */}
      <section id="how" className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold">{t(lang,"how.title")}</h2>
          <div className="grid-3 mt-6">
            <Step n="1" text={t(lang,"how.s1")} />
            <Step n="2" text={t(lang,"how.s2")} />
            <Step n="3" text={t(lang,"how.s3")} />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold">{t(lang,"benefits.title")}</h2>
          <div className="grid-3 mt-6">
            {benefits.map((s,i)=>(
              <div key={i} className="card p-4 flex items-start gap-3">
                <span>✅</span><span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold">{t(lang,"pricing.title")}</h2>
          <div className="grid-2 mt-6">
            <div className="card p-6">
              <h3 className="font-semibold">Free</h3>
              <p className="text-[var(--muted)] mt-1">{t(lang,"pricing.freeNote")}</p>
              <a href="/demo" className="mt-4 inline-flex btn btn-outline">{lang==="es"?"Probar":"Try"}</a>
            </div>
            <div className="card p-6 relative overflow-hidden">
              <div className="absolute right-4 top-4 text-xs bg-[var(--sun)] text-black px-2 py-1 rounded-full">Popular</div>
              <h3 className="font-semibold">{t(lang,"pricing.lifetime")}</h3>
              <p className="text-[var(--muted)] mt-1">USD 9.99</p>
              <form method="POST" action="/api/stripe/checkout" className="mt-4">
                <button className="btn btn-primary">{lang==="es"?"Comprar ahora":"Buy now"}</button>
              </form>
              <p className="text-xs text-[var(--muted)] mt-2">
                {lang==="es"?"Pago único. Sin suscripciones.":"One-time payment. No subscriptions."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container py-8 text-sm grid md:grid-cols-3 gap-4">
          <div>
            <div className="font-semibold">platy</div>
            <p className="text-[var(--muted)]">{lang==='es'?'Menús inteligentes, ahorro real':'Smart menus, real savings'}</p>
          </div>
          <div className="flex gap-4">
            <a href="/terms">{lang==="es"?"Términos":"Terms"}</a>
            <a href="/privacy">{lang==="es"?"Privacidad":"Privacy"}</a>
          </div>
          <div className="text-[var(--muted)] md:text-right">© {new Date().getFullYear()} platy</div>
        </div>
      </footer>
    </main>
  );
}

function Step({n,text}:{n:string;text:string}){
  return (
    <div className="card p-6">
      <div className="w-8 h-8 rounded-full bg-[var(--sun)] text-black font-bold grid place-items-center">{n}</div>
      <p className="mt-3">{text}</p>
    </div>
  );
}

