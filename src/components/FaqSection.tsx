"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/lib/site";

const faqs = [
  {
    q: "What is a reverse hackathon?",
    a: "Instead of building an application from scratch, your team is given a working but deliberately broken one — stuffed with real vulnerabilities. You find them, fix them properly, and defend your fixes before the judges. The finalists present a short review of what they found and how they healed it.",
  },
  {
    q: "I have no hacking experience. Can I still take part?",
    a: "Yes — fresh blood is welcome at this table. Practical curiosity, a working laptop and a willingness to read code are more than enough to start. Mentors run checkpoints throughout the day, and the briefing walks everyone through the sandbox before the hunt begins.",
  },
  {
    q: "Who can register, and how large can a team be?",
    a: `Any full-time student of ${siteConfig.college} can register, from any department and year. Teams run ${siteConfig.teamSize.min}–${siteConfig.teamSize.max} members. One designated Capo (team lead) signs the book on behalf of everyone.`,
  },
  {
    q: "What should we bring on the day?",
    a: "A laptop, its charger, and any tools you like — documentation stays online. Everything else is provided: the vulnerable build, the sandbox, power, Wi-Fi, tea and lunch. Arrive fifteen minutes early for check-in and the briefing.",
  },
  {
    q: "How is the winner decided?",
    a: "Four things carry weight: the number and severity of vulnerabilities you found and patched, the craft of each fix, your written summary, and the ten-minute defence before the judges. A clean, minimal, well-explained patch beats a catalogue of hasty ones.",
  },
  {
    q: "How many vulnerabilities are hidden in the build?",
    a: "We keep the exact count — and the exact kinds — to ourselves. That is the point. What we will say: the build is a real-world application with flaws of several severities, and the sandbox is fully isolated, so you are free to probe without harm.",
  },
  {
    q: "Do we work on the provided machines or our own?",
    a: "Your own laptop, pointed at our sandboxed target. The vulnerable application runs in an isolated environment we control — attacks stay inside it and never touch anything beyond the classroom walls.",
  },
  {
    q: "What happens after I register?",
    a: `You receive an email with your registration ID (keep it — it is your seat at the door). Closer to the day we will mail your team the venue details, the check-in time and any final instructions. If the email has not arrived, write to ${siteConfig.contact.email}.`,
  },
  {
    q: "Is this event connected to the film?",
    a: "No. Reverse Hackathon 2026 is an original design by the Whitehat Club, styled after the cinematic mood of classic 1970s crime dramas. It is not affiliated with, licensed by, or endorsed by any film studio, and no copyrighted imagery is used.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="The Questions"
        title={
          <>
            Asked and {""}
            <span className="gold-text">answered plainly</span>
          </>
        }
        plain="If your question is missing, ask the Family — the contact details sit at the bottom of the page."
      />

      <div className="space-y-4">
        {faqs.map((item, i) => {
          const open = openIndex === i;
          const panelId = `faq-panel-${i}`;
          const triggerId = `faq-trigger-${i}`;
          return (
            <Reveal key={item.q} delay={i * 0.04}>
              <div className="overflow-hidden rounded-sm border border-charcoalHi bg-charcoal/60">
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-head text-lg font-bold leading-snug text-parchment sm:text-xl">
                      {item.q}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-parchment/10 px-6 pb-6 pt-4 leading-relaxed text-parchment/75">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}