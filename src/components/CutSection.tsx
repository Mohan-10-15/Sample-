import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { Rose } from "./motifs";
import { siteConfig } from "@/lib/site";

const medalStyles: Record<string, { border: string; numeral: string; amount: string; ring: string }> = {
  gold: {
    border: "border-gold/70",
    numeral: "text-gold",
    amount: "gold-text",
    ring: "bg-gradient-to-b from-goldHi via-gold to-goldDim",
  },
  silver: {
    border: "border-parchment/40",
    numeral: "text-parchment",
    amount: "text-parchment",
    ring: "bg-gradient-to-b from-white via-[#B9B9B9] to-[#6F6F6F]",
  },
  bronze: {
    border: "border-[#A9713B]/70",
    numeral: "text-[#C98A5A]",
    amount: "text-[#D9A87C]",
    ring: "bg-gradient-to-b from-[#C98A5A] via-[#A9713B] to-[#7A4E24]",
  },
};

export default function CutSection() {
  return (
    <section id="cut" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <Rose className="absolute right-6 top-10 hidden h-28 w-14 opacity-30 lg:block" />

      <SectionHeading
        eyebrow="The Cut"
        title={
          <>
            Honour is paid in {""}
            <span className="gold-text">gold, silver and bronze</span>
          </>
        }
        plain="Plain words: what the winning families take home. Monetary values are final at the briefing — prizes are never half-promises."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {siteConfig.prizes.map((prize, i) => {
          const style = medalStyles[prize.color] ?? medalStyles.gold;
          return (
            <Reveal key={prize.place} delay={i * 0.1} className={i === 1 ? "md:-mt-6" : ""}>
              <article
                className={`group relative h-full rounded-sm border ${style.border} bg-charcoal/70 p-8 text-center shadow-plaque transition-transform duration-300 hover:-translate-y-1.5`}
              >
                <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-parchment/60">
                  {prize.place}
                </p>
                <div
                  aria-hidden
                  className={`mx-auto mt-5 grid h-20 w-20 place-items-center rounded-full ${style.ring} text-3xl font-bold text-noir shadow-lg`}
                >
                  {prize.numeral}
                </div>
                <h3 className="mt-6 font-head text-2xl font-bold text-parchment">{prize.title}</h3>
                <p className={`mt-3 font-head text-4xl font-bold ${style.amount}`}>{prize.amount}</p>
                <p className="mx-auto mt-4 max-w-[26ch] leading-relaxed text-parchment/70">
                  {prize.detail}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-sm border border-dashed border-gold/40 bg-charcoal/40 px-8 py-7 sm:flex-row">
          <div>
            <p className="font-typewriter text-[11px] uppercase tracking-[0.3em] text-gold">
              Special track
            </p>
            <h3 className="mt-1 font-head text-2xl font-bold text-parchment">
              {siteConfig.specialPrize.title}
            </h3>
            <p className="mt-2 max-w-xl leading-relaxed text-parchment/70">
              {siteConfig.specialPrize.detail}
            </p>
          </div>
          <p className="shrink-0 font-typewriter text-sm uppercase tracking-[0.18em] text-parchment/80">
            {siteConfig.specialPrize.award}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="mt-10 text-center font-typewriter text-xs uppercase tracking-[0.28em] text-parchment/45">
          Every registered family member also receives a certificate of participation.
        </p>
      </Reveal>
    </section>
  );
}