import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/lib/site";

export default function Timeline() {
  return (
    <section id="timeline" className="relative mx-auto max-w-5xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="The Schedule"
        title={
          <>
            The order of operations,
            <br />
            <span className="gold-text">hour by hour</span>
          </>
        }
        plain="The plain-language version: how the day unfolds from registration to the reading of results. Timings are provisional — the Family will confirm the final order at the briefing."
      />

      <ol className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-gold/60 before:via-gold/25 before:to-transparent sm:before:left-[23px]">
        {siteConfig.schedule.map((step, i) => (
          <li key={step.label} className="relative pl-14 sm:pl-20">
            <span
              aria-hidden
              className="absolute left-2.5 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-gold/60 bg-noir sm:left-4 sm:h-5 sm:w-5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold sm:h-2 sm:w-2" />
            </span>
            <Reveal delay={i * 0.05}>
              <div className="rounded-sm border border-charcoalHi bg-charcoal/60 p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-typewriter text-sm tracking-[0.18em] text-gold">{step.time}</p>
                  <h3 className="font-head text-xl font-bold text-parchment sm:text-2xl">
                    {step.label}
                  </h3>
                </div>
                <p className="mt-2 leading-relaxed text-parchment/70">{step.plain}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}