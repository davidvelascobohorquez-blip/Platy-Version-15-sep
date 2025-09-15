"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { t, type Lang } from "@/lib/i18n";

export default function Navbar({ lang: initialLang = "es" as Lang }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    const saved = localStorage.getItem("platy_lang") as Lang | null;
    if (saved) setLang(saved);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function flip() {
    const next = lang === "es" ? "en" : "es";
    setLang(next);
    localStorage.setItem("platy_lang", next);
    location.reload();
  }

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur ${
        scrolled ? "border-b border-[var(--line)] bg-white/80" : "bg-white/50"
      }`}
    >
      <div className="container py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/brand/PLATY_logo_icon_1024.png"
            alt="platy"
            className="h-8 w-8 rounded-lg"
          />
          <span className="font-semibold tracking-wide">platy</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted)]">
          <a href="#how">{t(lang, "nav.how")}</a>
          <a href="#benefits">{t(lang, "nav.benefits")}</a>
          <a href="#pricing">{t(lang, "nav.pricing")}</a>
          <Link href="/demo" className="btn btn-primary">
            {t(lang, "nav.demo")}
          </Link>
          <button onClick={flip} className="btn btn-outline">
            {lang.toUpperCase()}
          </button>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <button onClick={flip} className="btn btn-outline">
            {lang.toUpperCase()}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[var(--line)] bg-white">
          <div className="container py-3 grid gap-3">
            <a onClick={() => setOpen(false)} href="#how">
              {t(lang, "nav.how")}
            </a>
            <a onClick={() => setOpen(false)} href="#benefits">
              {t(lang, "nav.benefits")}
            </a>
            <a onClick={() => setOpen(false)} href="#pricing">
              {t(lang, "nav.pricing")}
            </a>
            <Link onClick={() => setOpen(false)} href="/demo" className="btn btn-primary">
              {t(lang, "nav.demo")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

}
