"use client";

import { motion, useReducedMotion } from "framer-motion";
import useCountdown from "@/hooks/useCountdown";
import { EVENT_DATE, siteConfig, formatEventDate } from "@/lib/site";
import { Marionette, Smoke } from "./motifs";

export function CountdownBoxes({ target }: { target: Date }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(target);

  if (isOver) {
    return (
      <p className="font-typewriter text-sm uppercase tracking-[0.3em] text-gold">
        The hour has come — the Family assembles today.
      </p>
    );
  }

  const cells: Array<{ v: string; label: string }> = [
    { v: String(days).padStart(2, "0"), label: "Days" },
    { v: String(hours).padStart(2, "0"), label: "Hours" },
    { v: String(minutes).padStart(2, "0"), label: "Minutes" },
    { v: String(seconds).padStart(2, "0"), label: "Seconds" },
  ];

  return (
    <div
      className="flex items-stretch gap-2 sm:gap-3"
      role="timer"
      aria-label={`Counting down to Reverse Hackathon 2026 on ${formatEventDate()}`}
    >
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-stretch gap-2 sm:gap-3">
          <div className="grid h-20 w-16 place-items-center rounded-sm border border-gold/25 bg-charcoal/80 backdrop-blur sm:h-24 sm:w-20">
            <div className="text-center">
              <span className="block font-head text-3xl font-bold tabular-nums text-gold sm:text-4xl">
                {c.v}
              </span>
              <span className="mt-1 block font-typewriter text-[10px] uppercase tracking-[0.25em] text-parchment/60">
                {c.label}
              </span>
            </div>
          </div>
          {i < cells.length - 1 && (
            <span
              aria-hidden
              className="hidden self-center font-head text-2xl text-gold/50 sm:block"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: "easeOut" as const },
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-8"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 50% 18%, rgba(107,15,26,0.5), transparent 62%), radial-gradient(1100px 700px at 50% 110%, rgba(0,0,0,0.9), transparent 70%)",
        }}
      />
      <Smoke className="absolute left-1/2 top-10 hidden w-[70vw] max-w-4xl -translate-x-1/2 opacity-70 md:block" />
      <Marionette className="animate-drift absolute right-3 top-6 hidden h-[46vh] opacity-25 lg:block" />

      {/* Content */}
      <motion.p {...fade(0.1)} className="eyebrow relative">
        {siteConfig.organizer} presents
      </motion.p>

      <motion.h1 {...fade(0.25)} className="relative mt-6">
        <span className="sr-only">Reverse Hackathon 2026</span>
        <span aria-hidden className="block font-display text-5xl font-black leading-none tracking-[0.08em] text-parchment sm:text-7xl lg:text-8xl">
          {"RH".split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.06, duration: 0.7, ease: "easeOut" }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
        <span className="gold-text mt-3 block font-head text-3xl font-bold tracking-[0.5em] sm:text-5xl">
          2026
        </span>
      </motion.h1>

      <motion.p {...fade(0.7)} className="relative mt-8 max-w-2xl font-head text-xl leading-relaxed text-parchment/85 italic sm:text-2xl">
        {siteConfig.tagline}
      </motion.p>

      <motion.p {...fade(0.8)} className="relative mt-6 font-typewriter text-[11px] uppercase tracking-[0.3em] text-parchment/55 sm:text-xs">
        A reverse hackathon · {formatEventDate()} · {siteConfig.venue.name}
        <br className="sm:hidden" />
        <span className="hidden sm:inline"> — </span>
        {siteConfig.venue.college}, {siteConfig.venue.city}
      </motion.p>

      <motion.div {...fade(0.9)} className="relative mt-10">
        <CountdownBoxes target={EVENT_DATE} />
      </motion.div>

      <motion.div {...fade(1.0)} className="relative mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <a href="#register" className="btn-gold">
          Join the Family — Register
        </a>
        <a href="#contract" className="btn-ghost">
          Read the Contract
        </a>
      </motion.div>

      <a
        href="#contract"
        aria-label="Scroll down to The Contract"
        className="relative mt-16 hidden h-12 w-6 justify-center rounded-full border border-parchment/25 sm:flex"
      >
        <span className="mt-2 h-2.5 w-1 animate-bounce rounded bg-gold" />
      </a>
    </section>
  );
}