"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#contract", label: "The Contract" },
  { href: "#timeline", label: "The Schedule" },
  { href: "#code", label: "The Code" },
  { href: "#cut", label: "The Cut" },
  { href: "#family", label: "The Family" },
  { href: "#faq", label: "The Questions" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#hero"
          className="flex items-center gap-3"
          aria-label="Back to the top of the page"
        >
          <span className="grid h-9 w-9 place-items-center rounded-sm border border-gold/50 bg-charcoal/80 font-head text-lg font-bold text-gold">
            O
          </span>
          <span className="font-display text-lg font-bold tracking-[0.2em] text-parchment">
            RH
            <span className="ml-2 text-sm font-normal tracking-[0.3em] text-gold">2026</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-typewriter text-[11px] uppercase tracking-[0.22em] text-parchment/70 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#register"
            className="rounded-sm border border-gold/70 px-4 py-2 font-typewriter text-[11px] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold hover:text-noir"
          >
            Register
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="grid h-10 w-10 place-items-center rounded-sm border border-parchment/20 text-parchment md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-b border-gold/20 bg-noir/95 backdrop-blur md:hidden"
        >
          <ul className="space-y-1 px-5 py-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2.5 font-typewriter text-xs uppercase tracking-[0.22em] text-parchment/80 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#register"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-sm border border-gold/70 px-2 py-2.5 text-center font-typewriter text-xs uppercase tracking-[0.22em] text-gold"
              >
                Join the Family — Register
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}