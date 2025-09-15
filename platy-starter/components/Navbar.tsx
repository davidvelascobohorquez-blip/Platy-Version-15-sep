"use client";
import Link from "next/link";
import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";

export default function Navbar({ lang="es" as Lang }:{ lang?: Lang }){
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur">
      <div className="container py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/brand/PLATY_logo_icon_1024.png" alt="platy" className="h-7 w-7 rounded-lg"/>
          <span className="font-semibold tracking-wide">platy</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-graphite">
          <a href="#how">{t(lang,"nav_how")}</a>
          <a href="#benefits">{t(lang,"nav_benefits")}</a>
          <a href="#pricing">{t(lang,"nav_pricing")}</a>
          <Link href="/demo" className="px-4 py-2 rounded-xl bg-ink text-white">{t(lang,"nav_demo")}</Link>
        </nav>
        <button className="md:hidden p-2 rounded-lg border border-line" onClick={() => setOpen(v=>!v)} aria-label="menu">
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <div className="container py-3 grid gap-3">
            <a onClick={()=>setOpen(false)} href="#how">{t(lang,"nav_how")}</a>
            <a onClick={()=>setOpen(false)} href="#benefits">{t(lang,"nav_benefits")}</a>
            <a onClick={()=>setOpen(false)} href="#pricing">{t(lang,"nav_pricing")}</a>
            <Link onClick={()=>setOpen(false)} href="/demo" className="px-4 py-2 rounded-xl bg-ink text-white">{t(lang,"nav_demo")}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
