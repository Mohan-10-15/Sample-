"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Member {
  role: string;
  dept: string;
  nickname: string;
  duty: string;
  photoFile: string;
  initials: string;
}

const members: Member[] = [
  {
    role: "Faculty Coordinator",
    dept: "Department of Cyber Security",
    nickname: "Il Consigliere",
    duty: "Oversees the house and signs every verdict.",
    photoFile: "faculty-1.jpg",
    initials: "FC",
  },
  {
    role: "Faculty Coordinator",
    dept: "Department of Cyber Security",
    nickname: "La Signora",
    duty: "Keeps the clock honest and the stewards in line.",
    photoFile: "faculty-2.jpg",
    initials: "FC",
  },
  {
    role: "President, Whitehat Club",
    dept: "Department of Cyber Security",
    nickname: "Il Capo",
    duty: "Runs the table — the entire day answers to them.",
    photoFile: "president.jpg",
    initials: "PH",
  },
  {
    role: "Vice President & Technical Head",
    dept: "Department of Cyber Security",
    nickname: "Il Meccanico",
    duty: "Builds and seeds the vulnerable machine.",
    photoFile: "tech-head.jpg",
    initials: "TH",
  },
  {
    role: "Events & Operations Head",
    dept: "Department of Cyber Security",
    nickname: "Il Cerimoniere",
    duty: "Arranges the room, the food, and the order of things.",
    photoFile: "events-head.jpg",
    initials: "EO",
  },
  {
    role: "Design & Marketing Head",
    dept: "Department of Cyber Security",
    nickname: "Il Poeta",
    duty: "Spreads the word in gold and ink.",
    photoFile: "marketing-head.jpg",
    initials: "DM",
  },
];

function Portrait({ member }: { member: Member }) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-gold/60 bg-charcoal shadow-[0_0_0_5px_rgba(201,162,39,0.12)]">
      {missing ? (
        <span
          aria-hidden
          className="grid h-full w-full place-items-center font-display text-3xl font-bold text-gold"
        >
          {member.initials}
        </span>
      ) : (
        <Image
          src={`/team/${member.photoFile}`}
          alt={`Portrait — ${member.role}`}
          fill
          sizes="96px"
          className="object-cover"
          unoptimized
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}

export default function FamilySection() {
  return (
    <section id="family" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="Meet the Family"
        title={
          <>
            The house is run by {""}
            <span className="gold-text">steady hands</span>
          </>
        }
        plain="The people behind Reverse Hackathon 2026. Official duties come first; the house-titles are flavour only."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, i) => (
          <Reveal key={m.photoFile} delay={i * 0.07}>
            <article className="group flex h-full flex-col items-center rounded-sm border border-charcoalHi bg-charcoal/60 p-8 text-center transition-colors duration-300 hover:border-gold/40">
              <Portrait member={m} />
              <p className="mt-5 font-typewriter text-[10px] uppercase tracking-[0.3em] text-gold">
                {m.nickname}
              </p>
              <h3 className="mt-2 font-head text-2xl font-bold leading-snug text-parchment">
                {m.role}
              </h3>
              <p className="mt-1 font-typewriter text-[11px] uppercase tracking-[0.18em] text-parchment/55">
                {m.dept}
              </p>
              <p className="mt-4 leading-relaxed text-parchment/70">{m.duty}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-10 text-center font-typewriter text-xs uppercase tracking-[0.26em] text-parchment/45">
          The full student committee — stewards, volunteers and a few good gremlins — joins on the day.
        </p>
      </Reveal>
    </section>
  );
}