import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Contract() {
  return (
    <section id="contract" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="The Contract"
        title={
          <>
            They build the house.
            <br />
            <span className="gold-text">You find where it leaks.</span>
          </>
        }
        plain="In plain words: what a reverse hackathon is, and why the Whitehat Club is running one."
      />

      <div className="grid gap-10 lg:grid-cols-3">
        <Reveal className="rounded-sm border border-charcoalHi bg-charcoal/60 p-8">
          <h3 className="font-head text-2xl font-bold text-gold">Not a creation. A reckoning.</h3>
          <p className="mt-4 leading-relaxed text-parchment/75">
            Most hackathons ask you to invent something new. At Reverse Hackathon 2026 we do the opposite: your
            team is handed a working — but deliberately broken — application, riddled with real,
            findable vulnerabilities. Your job is not to write a product. It is to inspect the
            machine, discover its flaws, and repair them under a deadline.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="rounded-sm border border-charcoalHi bg-charcoal/60 p-8">
          <h3 className="font-head text-2xl font-bold text-gold">Read code like a suspect.</h3>
          <p className="mt-4 leading-relaxed text-parchment/75">
            You will hunt for broken authentication, injection holes, exposed secrets, weak access
            controls and quiet logic errors. Every fix is scored — not just for proving a flaw
            exists, but for the quality of the patch, and your ability to defend it before the
            judges in a short review. This is the work of an application-security engineer, compressed
            into one long day.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="rounded-sm border border-charcoalHi bg-charcoal/60 p-8">
          <h3 className="font-head text-2xl font-bold text-gold">Why the Family runs it.</h3>
          <p className="mt-4 leading-relaxed text-parchment/75">
            The Whitehat Club, under the Department of Cyber Security, exists to teach security by
            doing. A keyboard warrior who has never defended a live system is a story untold. We run
            RH to give students of every department a safe, structured arena to make — and learn
            from — the mistakes that real teams make. No prior hacking experience is required, only
            curiosity and a steady nerve.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mx-auto mt-14 max-w-3xl text-center">
        <p className="font-typewriter text-sm uppercase tracking-[0.3em] text-parchment/50">
          Loyalty is measured in findings. Your name is only as good as your patch.
        </p>
      </Reveal>
    </section>
  );
}