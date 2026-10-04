"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Path } from "react-hook-form";
import { AlertTriangle, CheckCircle2, Loader2, Trash2, UserPlus } from "lucide-react";
import {
  RegistrationSchema,
  type APIErrorBody,
  type APISuccessBody,
  type RegistrationInput,
} from "@/lib/schema";
import { REG_DEADLINE_DATE, REG_OPEN_DATE, siteConfig, formatEventDate } from "@/lib/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { WaxSeal } from "./motifs";

const YEARS = ["I", "II", "III", "IV"] as const;

type MemberField = "fullName" | "email" | "department" | "year";
const memberPath = (index: number, field: MemberField): Path<RegistrationInput> =>
  `members.${index}.${field}` as Path<RegistrationInput>;

const defaultValues = (): RegistrationInput => ({
  teamName: "",
  leader: {
    fullName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    department: "",
    year: "I",
    registerNumber: "",
  },
  members: [{ fullName: "", email: "", department: "", year: "I" }],
  track: siteConfig.tracks[0]?.id ?? "appsense",
  heardAbout: "",
  tshirtSize: undefined,
  agreeToCode: false as unknown as true,
});

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 font-typewriter text-xs text-[#E08B7A]">
      {message}
    </p>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-sm border border-oxbloodHi bg-oxbloodDeep/60 p-5 sm:flex-row sm:items-center"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-[#E08B7A]" aria-hidden />
      <div className="min-w-0">
        <p className="font-typewriter text-xs uppercase tracking-[0.25em] text-[#E08B7A]">
          The messenger returned with bad news
        </p>
        <p className="mt-1 leading-relaxed text-parchment/85">{message}</p>
      </div>
      <button type="button" onClick={onRetry} className="btn-ghost ml-auto shrink-0 py-2.5">
        Try again
      </button>
    </div>
  );
}

function ClosedNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-sm border border-gold/35 bg-charcoal/60 p-10 text-center">
      <WaxSeal className="mx-auto h-28 w-28" />
      <h3 className="mt-6 font-head text-3xl font-bold text-parchment">{title}</h3>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-parchment/70">{body}</p>
    </div>
  );
}

export default function RegistrationSection() {
  const [clock, setClock] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState<null | APISuccessBody>(null);

  useEffect(() => {
    const id = setInterval(() => setClock(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: defaultValues(),
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "members" });
  const { register, handleSubmit, formState, reset, setError } = form;
  const { errors } = formState;

  const memberCount = fields.length + 1; // Capo counts
  const maxedOut = fields.length >= 3;
  const isOpen = clock >= REG_OPEN_DATE.getTime();
  const isClosed = clock > REG_DEADLINE_DATE.getTime();

  async function onSubmit(data: RegistrationInput) {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body: APIErrorBody | APISuccessBody = await res.json().catch(() => ({}));

      if (!res.ok) {
        const err = body as APIErrorBody;
        if (err.fieldErrors) {
          for (const [path, messages] of Object.entries(err.fieldErrors)) {
            setError(path as never, { type: "server", message: messages[0] });
          }
          setErrorMessage(
            "The Family reviewed your details and found something to fix — check the highlighted fields below.",
          );
        } else {
          setErrorMessage(err.error || "Something went wrong on our side. Please try again shortly.");
        }
        setStatus("error");
        return;
      }

      setDone(body as APISuccessBody);
      setStatus("idle");
    } catch {
      setErrorMessage(
        "We could not reach the Family's registry. Check your connection and try again — not one detail has been lost.",
      );
      setStatus("error");
    }
  }

  if (done) {
    return (
      <section id="register" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
        <div className="rounded-sm border border-gold/40 bg-charcoal/70 p-8 text-center sm:p-14">
          <WaxSeal className="mx-auto h-32 w-32 animate-drift" />
          <p className="eyebrow mt-8">The oath has been sworn</p>
          <h3 className="mt-4 font-head text-4xl font-bold text-parchment sm:text-5xl">
            Welcome to the Family.
          </h3>
          <p className="mx-auto mt-5 max-w-lg leading-relaxed text-parchment/75">
            Your word is recorded in the Book of the House. Show this registration ID at the door on{" "}
            {formatEventDate()} — it is your seat at the table.
          </p>

          <div aria-live="polite" className="mx-auto mt-8 max-w-md rounded-sm border border-gold/30 bg-noir p-6">
            <p className="font-typewriter text-[11px] uppercase tracking-[0.3em] text-parchment/55">
              Registration ID
            </p>
            <p className="mt-2 select-all font-head text-3xl font-bold tracking-[0.15em] text-gold">
              {done.registrationId}
            </p>
          </div>

          <p className="mx-auto mt-8 max-w-md leading-relaxed text-parchment/65">
            A confirmation letter is on its way to the Capo&apos;s inbox. If it has not arrived within the
            hour, write to{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-goldHi"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>

          {!done.emailDelivered && (
            <p
              role="status"
              className="mx-auto mt-4 max-w-md rounded-sm border border-oxbloodHi/60 bg-oxbloodDeep/40 p-4 text-sm leading-relaxed text-parchment/75"
            >
              Your registration is saved, but the confirmation email could not be sent just now.
              Save the ID above by hand — it remains valid.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              reset(defaultValues());
              setDone(null);
              setStatus("idle");
              setErrorMessage("");
            }}
            className="btn-ghost mt-10"
          >
            Register another team
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="The Registry"
        title={
          <>
            Sign the {""}
            <span className="gold-text">Family&apos;s book</span>
          </>
        }
        plain="Every team registers once. The Capo (team lead) signs for the whole family — duplicate teams and emails are refused at the door."
      />

      {isClosed ? (
        <Reveal>
          <ClosedNotice
            title="The book is sealed."
            body={`Registration closed on ${siteConfig.registrationDeadlineLabel}. The Family meets on ${formatEventDate()} — if you missed the register, reach out and we will hear you.`}
          />
        </Reveal>
      ) : !isOpen ? (
        <Reveal>
          <ClosedNotice
            title="The book opens in good time."
            body="Registration will open as announced on the club channels. Check back here — or follow the Family on Instagram and LinkedIn for the exact hour."
          />
        </Reveal>
      ) : (
        <Reveal>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="rounded-sm border border-gold/25 bg-charcoal/60 p-6 sm:p-10 lg:p-12 shadow-plaque"
          >
            {/* The Engagement — team name + track */}
            <fieldset className="border-b border-parchment/10 pb-8">
              <legend className="flex items-baseline gap-3 font-head text-2xl font-bold text-gold">
                <span aria-hidden className="font-display text-base text-gold/60">I.</span>
                The Engagement
              </legend>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="teamName" className="field-label">
                    Team name <span aria-hidden className="text-gold">*</span>
                  </label>
                  <input
                    id="teamName"
                    className="field"
                    placeholder="e.g. The Silent Fixers"
                    autoComplete="organization"
                    aria-invalid={!!errors.teamName}
                    aria-describedby={errors.teamName ? "teamName-error" : undefined}
                    {...register("teamName")}
                  />
                  <FieldError id="teamName-error" message={errors.teamName?.message} />
                </div>
                <div>
                  <label htmlFor="track" className="field-label">
                    Track / domain <span aria-hidden className="text-gold">*</span>
                  </label>
                  <select
                    id="track"
                    className="field"
                    aria-invalid={!!errors.track}
                    aria-describedby={errors.track ? "track-error" : undefined}
                    {...register("track")}
                  >
                    {siteConfig.tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <FieldError id="track-error" message={errors.track?.message} />
                </div>
              </div>
            </fieldset>

            {/* The Capo */}
            <fieldset className="border-b border-parchment/10 pb-8 pt-8">
              <legend className="flex items-baseline gap-3 font-head text-2xl font-bold text-gold">
                <span aria-hidden className="font-display text-base text-gold/60">II.</span>
                The Capo — team lead
              </legend>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="leader.fullName" className="field-label">
                    Full name <span aria-hidden className="text-gold">*</span>
                  </label>
                  <input
                    id="leader.fullName"
                    className="field"
                    autoComplete="name"
                    aria-invalid={!!errors.leader?.fullName}
                    aria-describedby={errors.leader?.fullName ? "leader.fullName-error" : undefined}
                    {...register("leader.fullName")}
                  />
                  <FieldError id="leader.fullName-error" message={errors.leader?.fullName?.message} />
                </div>
                <div>
                  <label htmlFor="leader.email" className="field-label">
                    College email <span aria-hidden className="text-gold">*</span>
                  </label>
                  <input
                    id="leader.email"
                    type="email"
                    className="field"
                    placeholder="name@college.edu.in"
                    autoComplete="email"
                    aria-invalid={!!errors.leader?.email}
                    aria-describedby={errors.leader?.email ? "leader.email-error" : undefined}
                    {...register("leader.email")}
                  />
                  <FieldError id="leader.email-error" message={errors.leader?.email?.message} />
                </div>
                <div>
                  <label htmlFor="leader.confirmEmail" className="field-label">
                    Confirm college email <span aria-hidden className="text-gold">*</span>
                  </label>
                  <input
                    id="leader.confirmEmail"
                    type="email"
                    className="field"
                    autoComplete="off"
                    aria-invalid={!!errors.leader?.confirmEmail}
                    aria-describedby={errors.leader?.confirmEmail ? "leader.confirmEmail-error" : undefined}
                    {...register("leader.confirmEmail")}
                  />
                  <FieldError id="leader.confirmEmail-error" message={errors.leader?.confirmEmail?.message} />
                </div>
                <div>
                  <label htmlFor="leader.phone" className="field-label">
                    Mobile number <span aria-hidden className="text-gold">*</span>
                  </label>
                  <input
                    id="leader.phone"
                    type="tel"
                    className="field"
                    placeholder="98765 43210"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    aria-invalid={!!errors.leader?.phone}
                    aria-describedby={errors.leader?.phone ? "leader.phone-error" : undefined}
                    {...register("leader.phone")}
                  />
                  <FieldError id="leader.phone-error" message={errors.leader?.phone?.message} />
                </div>
                <div>
                  <label htmlFor="leader.department" className="field-label">
                    Department / branch <span aria-hidden className="text-gold">*</span>
                  </label>
                  <input
                    id="leader.department"
                    className="field"
                    placeholder="e.g. Cyber Security"
                    autoComplete="organization-title"
                    aria-invalid={!!errors.leader?.department}
                    aria-describedby={errors.leader?.department ? "leader.department-error" : undefined}
                    {...register("leader.department")}
                  />
                  <FieldError id="leader.department-error" message={errors.leader?.department?.message} />
                </div>
                <div>
                  <label htmlFor="leader.year" className="field-label">
                    Year of study <span aria-hidden className="text-gold">*</span>
                  </label>
                  <select
                    id="leader.year"
                    className="field"
                    aria-invalid={!!errors.leader?.year}
                    aria-describedby={errors.leader?.year ? "leader.year-error" : undefined}
                    {...register("leader.year")}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y} Year
                      </option>
                    ))}
                  </select>
                  <FieldError id="leader.year-error" message={errors.leader?.year?.message} />
                </div>
                <div>
                  <label htmlFor="leader.registerNumber" className="field-label">
                    Register number <span aria-hidden className="text-gold">*</span>
                  </label>
                  <input
                    id="leader.registerNumber"
                    className="field"
                    placeholder="e.g. 9920205100"
                    autoComplete="off"
                    aria-invalid={!!errors.leader?.registerNumber}
                    aria-describedby={errors.leader?.registerNumber ? "leader.registerNumber-error" : undefined}
                    {...register("leader.registerNumber")}
                  />
                  <FieldError id="leader.registerNumber-error" message={errors.leader?.registerNumber?.message} />
                </div>
              </div>
            </fieldset>

            {/* The Crew */}
            <fieldset className="border-b border-parchment/10 pb-8 pt-8">
              <legend className="flex items-baseline justify-between gap-3 font-head text-2xl font-bold text-gold">
                <span className="flex items-baseline gap-3">
                  <span aria-hidden className="font-display text-base text-gold/60">III.</span>
                  The Crew — team members
                </span>
              </legend>
              <p className="mt-2 font-typewriter text-xs uppercase tracking-[0.22em] text-parchment/55">
                {memberCount} of {siteConfig.teamSize.max} seats filled — the Capo counts as one.
              </p>

              <div className="mt-6 space-y-8">
                {fields.map((field, index) => {
                  const base = `members.${index}` as const;
                  return (
                    <div
                      key={field.id}
                      className="relative rounded-sm border border-parchment/10 bg-noir/40 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-head text-lg font-bold text-parchment">
                          Member {index + 2}
                        </p>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label={`Remove member ${index + 2}`}
                            className="inline-flex items-center gap-2 rounded-sm font-typewriter text-[11px] uppercase tracking-[0.2em] text-[#E08B7A] transition-colors hover:text-[#f2a496]"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor={`${base}.fullName`} className="field-label">
                            Full name <span aria-hidden className="text-gold">*</span>
                          </label>
                          <input
                            id={`${base}.fullName`}
                            className="field"
                            autoComplete="off"
                            aria-invalid={!!errors.members?.[index]?.fullName}
                            aria-describedby={
                              errors.members?.[index]?.fullName ? `${base}.fullName-error` : undefined
                            }
                            {...register(memberPath(index, "fullName"))}
                          />
                          <FieldError
                            id={`${base}.fullName-error`}
                            message={errors.members?.[index]?.fullName?.message}
                          />
                        </div>
                        <div>
                          <label htmlFor={`${base}.email`} className="field-label">
                            College email <span aria-hidden className="text-gold">*</span>
                          </label>
                          <input
                            id={`${base}.email`}
                            type="email"
                            className="field"
                            autoComplete="off"
                            aria-invalid={!!errors.members?.[index]?.email}
                            aria-describedby={
                              errors.members?.[index]?.email ? `${base}.email-error` : undefined
                            }
                            {...register(memberPath(index, "email"))}
                          />
                          <FieldError
                            id={`${base}.email-error`}
                            message={errors.members?.[index]?.email?.message}
                          />
                        </div>
                        <div>
                          <label htmlFor={`${base}.department`} className="field-label">
                            Department / branch <span aria-hidden className="text-gold">*</span>
                          </label>
                          <input
                            id={`${base}.department`}
                            className="field"
                            autoComplete="off"
                            aria-invalid={!!errors.members?.[index]?.department}
                            aria-describedby={
                              errors.members?.[index]?.department ? `${base}.department-error` : undefined
                            }
                            {...register(memberPath(index, "department"))}
                          />
                          <FieldError
                            id={`${base}.department-error`}
                            message={errors.members?.[index]?.department?.message}
                          />
                        </div>
                        <div>
                          <label htmlFor={`${base}.year`} className="field-label">
                            Year of study <span aria-hidden className="text-gold">*</span>
                          </label>
                          <select
                            id={`${base}.year`}
                            className="field"
                            aria-invalid={!!errors.members?.[index]?.year}
                            aria-describedby={
                              errors.members?.[index]?.year ? `${base}.year-error` : undefined
                            }
                            {...register(memberPath(index, "year"))}
                          >
                            {YEARS.map((y) => (
                              <option key={y} value={y}>
                                {y} Year
                              </option>
                            ))}
                          </select>
                          <FieldError
                            id={`${base}.year-error`}
                            message={errors.members?.[index]?.year?.message}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.members?.root?.message && (
                <FieldError id="members-root-error" message={errors.members.root.message} />
              )}

              {!maxedOut ? (
                <button
                  type="button"
                  onClick={() =>
                    append({ fullName: "", email: "", department: "", year: "I" })
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-sm border border-gold/40 px-4 py-2.5 font-typewriter text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:border-gold hover:text-goldHi"
                >
                  <UserPlus className="h-4 w-4" aria-hidden />
                  Add a member
                </button>
              ) : (
                <p className="mt-6 font-typewriter text-xs uppercase tracking-[0.2em] text-parchment/50">
                  The table is full — a family runs {siteConfig.teamSize.min}–{siteConfig.teamSize.max}.
                </p>
              )}
            </fieldset>

            {/* The Question + The Oath */}
            <fieldset className="pt-8">
              <legend className="flex items-baseline gap-3 font-head text-2xl font-bold text-gold">
                <span aria-hidden className="font-display text-base text-gold/60">IV.</span>
                Last questions, and the Oath
              </legend>

              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="heardAbout" className="field-label">
                    How did you hear about us? <span aria-hidden className="text-gold">*</span>
                  </label>
                  <select
                    id="heardAbout"
                    className="field"
                    aria-invalid={!!errors.heardAbout}
                    aria-describedby={errors.heardAbout ? "heardAbout-error" : undefined}
                    {...register("heardAbout")}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose one
                    </option>
                    {siteConfig.heardAboutOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <FieldError id="heardAbout-error" message={errors.heardAbout?.message} />
                </div>
                <div>
                  <label htmlFor="tshirtSize" className="field-label">
                    T-shirt size <span className="text-parchment/45">(optional)</span>
                  </label>
                  <select
                    id="tshirtSize"
                    className="field"
                    {...register("tshirtSize")}
                    defaultValue=""
                  >
                    <option value="">No preference</option>
                    {siteConfig.tshirtSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <FieldError id="tshirtSize-error" message={errors.tshirtSize?.message} />
                </div>
              </div>

              <label className="mt-8 flex cursor-pointer items-start gap-4">
                <span className="relative mt-0.5">
                  <input
                    type="checkbox"
                    aria-describedby="agree-error"
                    aria-invalid={!!errors.agreeToCode}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-gold/50 bg-noir transition-colors checked:border-gold checked:bg-gold"
                    {...register("agreeToCode")}
                  />
                  <CheckCircle2
                    aria-hidden
                    className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-noir opacity-0 transition-opacity peer-checked:opacity-100"
                  />
                </span>
                <span className="-mt-1 leading-relaxed text-parchment/80">
                  The Capo, on behalf of the whole team, agrees to stand by{" "}
                  <a
                    href="#code"
                    className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-goldHi"
                  >
                    The Family Code
                  </a>{" "}
                  — its rules, its judging criteria, and its conduct.{" "}
                  <span aria-hidden className="text-gold">*</span>
                </span>
              </label>
              <FieldError id="agree-error" message={errors.agreeToCode?.message} />

              {status === "error" && (
                <div className="mt-8">
                  <ErrorBanner
                    message={errorMessage}
                    onRetry={() => {
                      setStatus("idle");
                      void handleSubmit(onSubmit)();
                    }}
                  />
                </div>
              )}

              {Object.keys(errors).length > 0 && status !== "error" && (
                <p role="alert" className="mt-6 text-center font-typewriter text-xs uppercase tracking-[0.2em] text-[#E08B7A]">
                  A few details need attention above before you sign.
                </p>
              )}

              <div className="mt-8 flex flex-col items-center gap-4">
                <button type="submit" disabled={status === "submitting"} className="btn-gold w-full sm:w-auto">
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Sealing the oath…
                    </>
                  ) : (
                    "Swear the oath — register my team"
                  )}
                </button>
                <p className="font-typewriter text-[11px] uppercase tracking-[0.22em] text-parchment/45">
                  Deadline: {siteConfig.registrationDeadlineLabel}
                </p>
              </div>
            </fieldset>
          </form>
        </Reveal>
      )}
    </section>
  );
}