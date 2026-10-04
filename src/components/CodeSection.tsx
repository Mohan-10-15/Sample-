import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { OrnateCorners, WaxSeal } from "./motifs";
import { siteConfig } from "@/lib/site";

const clauses = [
  {
    numeral: "I.",
    flavor: "Of Those Who Sit at the Table",
    plain: "Eligibility, plainly:",
    items: [
      "Open to all full-time students of SRM Valliammai Engineering College, any department and year.",
      `Teams of ${siteConfig.teamSize.min}–${siteConfig.teamSize.max}. One Capo (team lead) registers the team and answers for it.`,
      "Only registered teams receive the vulnerable build and the credentials to the sandbox.",
      "No prior security experience is required — fresh blood is welcome at this table.",
    ],
  },
  {
    numeral: "II.",
    flavor: "Of the Hunt",
    plain: "Rules of engagement, plainly:",
    items: [
      "Attacks are confined to the provided application inside the sandbox. Attacking other teams, the scoring platform or any external host forfeits the day.",
      "Each team works alone. No sharing of findings, patches, or progress with any other team.",
      "The internet stays on for documentation and research. Crafted exploits are aimed at the target alone.",
      "One team, one registration. A team that registers twice is turned away from the door.",
    ],
  },
  {
    numeral: "III.",
    flavor: "Of the Verdict",
    plain: "Judging criteria, plainly:",
    items: [
      "Findings — the number and severity of vulnerabilities discovered and correctly patched.",
      "Craft — the quality, safety and minimalism of each fix. A working-but-ugly patch is a story half told.",
      "Defence — the ten-minute review before the judges, where teams explain what they found and why.",
      "Records — the written summary of your hunt and your healing, submitted at the handover.",
    ],
  },
  {
    numeral: "IV.",
    flavor: "Of Conduct",
    plain: "Code of conduct, plainly:",
    items: [
      "Respect every member of the Family — competitors, organizers, mentors and staff.",
      "No disruptive behaviour, no harassment, and no borrowing of favours between tables.",
      "Report anything unfair to a steward immediately; silence helps no one.",
      "The House Committee's word is final.",
    ],
  },
];

export default function CodeSection() {
  return (
    <section id="code" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="The Family Code"
        title={
          <>
            Every house has its laws.
            <br />
            <span className="gold-text">These are ours.</span>
          </>
        }
        plain="Rules and eligibility, in plain words — registered teams agree to uphold every clause."
      />

      <Reveal>
        <div className="ledger relative rounded-sm p-8 sm:p-12 lg:p-16">
          {/* Ornate inner border */}
          <div className="pointer-events-none absolute inset-2 rounded-sm border border-goldDim/60 sm:inset-3" />
          <OrnateCorners className="pointer-events-none absolute inset-2 text-goldDim sm:inset-3" />

          <div className="relative">
            <p className="font-typewriter text-[11px] uppercase tracking-[0.3em] text-ink/70 sm:text-xs">
              Registered this day of our Lord, Anno 2026
            </p>
            <h3 className="mt-2 font-head text-3xl font-bold text-ink sm:text-4xl">
              The Laws of the House
            </h3>
            <div className="mt-4 h-px w-full bg-ink/20" />

            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              {clauses.map((clause) => (
                <div key={clause.numeral}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl text-oxblood">{clause.numeral}</span>
                    <h4 className="font-head text-2xl font-bold text-ink">{clause.flavor}</h4>
                  </div>
                  <p className="mt-1 font-typewriter text-xs uppercase tracking-[0.2em] text-ink/60">
                    {clause.plain}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {clause.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed text-ink/90">
                        <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-goldDim" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 rounded-sm border border-ink/20 bg-ink/5 p-6">
              <p className="font-typewriter text-xs uppercase tracking-[0.22em] text-ink/75">
                Sealed under oath —
                <span className="mt-1 block text-ink/55 normal-case tracking-normal">
                  {siteConfig.organizer} · {siteConfig.college}
                </span>
              </p>
              <WaxSeal className="ml-auto h-24 w-24 drop-shadow-[0_10px_18px_rgba(61,8,16,0.45)]" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}