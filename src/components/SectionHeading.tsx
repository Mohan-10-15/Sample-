import { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  plain,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  plain: string;
  id?: string;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
      <p className="eyebrow">{eyebrow}</p>
      {id ? (
        <h2
          id={id}
          className="mt-4 font-head text-4xl font-bold leading-tight text-parchment sm:text-5xl lg:text-6xl"
        >
          {title}
        </h2>
      ) : (
        <h2 className="mt-4 font-head text-4xl font-bold leading-tight text-parchment sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      )}
      <p className="mt-5 text-lg leading-relaxed text-parchment/70 sm:text-xl">{plain}</p>
      <div
        aria-hidden
        className="mx-auto mt-8 h-px w-44 bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </Reveal>
  );
}