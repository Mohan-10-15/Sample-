import { Mail, MapPin } from "lucide-react";
import { Crest } from "./motifs";
import { siteConfig } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gold">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gold">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A6 6 0 0 1 16 8z" transform="rotate(0 12 12)" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/20 bg-coal">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Crest className="h-14 w-12" />
              <div>
                <p className="font-display text-xl font-bold tracking-[0.18em] text-parchment">
                  RH
                </p>
                <p className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-gold">
                  2026 · Reverse Hackathon
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm leading-relaxed text-parchment/60">
              A reverse hackathon by the Whitehat Club — where teams inherit a broken system and are
              judged on how well they heal it.
            </p>
          </div>

          <div>
            <h3 className="font-typewriter text-xs uppercase tracking-[0.3em] text-gold">
              Find the Family
            </h3>
            <ul className="mt-5 space-y-3 text-parchment/70">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-3 transition-colors hover:text-gold"
                >
                  <Mail className="h-4 w-4 text-gold" aria-hidden />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-gold"
                >
                  <InstagramIcon aria-hidden />
                  {siteConfig.contact.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-gold"
                >
                  <LinkedinIcon aria-hidden />
                  {siteConfig.contact.linkedinHandle}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  {siteConfig.venue.address}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-typewriter text-xs uppercase tracking-[0.3em] text-gold">
              The Statement
            </h3>
            <p className="mt-5 max-w-sm leading-relaxed text-parchment/60">
              Reverse Hackathon 2026 is an original design by the Whitehat Club, Department of Cyber Security,{" "}
              {siteConfig.college}, drawn from the mood of classic 1970s crime dramas. It is not
              affiliated with, licensed by, or endorsed by any film studio; all artwork is original.
            </p>
            <p className="mt-5 font-typewriter text-[11px] uppercase tracking-[0.25em] text-parchment/40">
              Sealed under oath · Anno 2026
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-parchment/10 pt-8 sm:flex-row">
          <p className="font-typewriter text-[11px] uppercase tracking-[0.22em] text-parchment/45">
            {siteConfig.organizer} · {siteConfig.college}
          </p>
          <p className="font-typewriter text-[11px] tracking-[0.22em] text-parchment/45">
            © 2026 Reverse Hackathon 2026 — The Family remembers.
          </p>
        </div>
      </div>
    </footer>
  );
}