import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { RegistrationSchema, type APIErrorBody, type RegistrationInput } from "@/lib/schema";
import { appendRegistration, findDuplicate } from "@/lib/gsheets";
import { sendConfirmationEmail } from "@/lib/mail";
import { siteConfig, REG_DEADLINE_DATE, REG_OPEN_DATE } from "@/lib/site";

export const runtime = "nodejs";

function registrationId(): string {
  const ts = new Date();
  const stamp = `${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, "0")}${String(
    ts.getDate(),
  ).padStart(2, "0")}`;
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `OMT-${stamp}-${rand}`;
}

function parseFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const acc: Record<string, string[]> = {};
  for (const issue of issues) {
    const raw = issue.path.join(".");
    const key = raw === "members" ? "members.root" : raw;
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue.message);
  }
  return acc;
}

export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => null);
  if (input === null) {
    return NextResponse.json<APIErrorBody>(
      { error: "We could not read the registration. Please try again." },
      { status: 400 },
    );
  }

  const now = Date.now();
  if (now < REG_OPEN_DATE.getTime() || now > REG_DEADLINE_DATE.getTime()) {
    return NextResponse.json<APIErrorBody>(
      {
        error: `The book is ${
          now < REG_OPEN_DATE.getTime() ? "not yet open" : "closed"
        }. Registration closes ${siteConfig.registrationDeadlineLabel}.`,
      },
      { status: 403 },
    );
  }

  const parsed = RegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json<APIErrorBody>(
      {
        error: "Some details did not pass the Family's review.",
        fieldErrors: parseFieldErrors(parsed.error.issues),
      },
      { status: 400 },
    );
  }

  const data = parsed.data as RegistrationInput;

  // Block duplicate submissions: same team name or any member email already booked.
  try {
    const duplicate = await findDuplicate(data);
    if (duplicate) {
      const message =
        duplicate.field === "teamName"
          ? `A team named "${duplicate.value}" has already signed the book. Choose a different name, or write to ${siteConfig.contact.email}.`
          : "That email is already registered for this event — each family member sits once.";
      return NextResponse.json<APIErrorBody>({ error: message }, { status: 409 });
    }
  } catch (error) {
    console.error("Duplicate check failed:", error);
    return NextResponse.json<APIErrorBody>(
      { error: "We could not verify the registry just now. Please try again in a moment." },
      { status: 503 },
    );
  }

  const id = registrationId();
  let stored = false;

  try {
    await appendRegistration(data, id);
    stored = true;
  } catch (error) {
    console.error("Sheet append failed:", error);
    return NextResponse.json<APIErrorBody>(
      { error: "Your details did not reach the Book of the House. Please try again shortly — nothing has been recorded." },
      { status: 500 },
    );
  }

  if (!stored) {
    return NextResponse.json<APIErrorBody>(
      { error: "Something went wrong while recording your registration. Please try again." },
      { status: 500 },
    );
  }

  // Email is best-effort: a saved registration must never be lost because mail failed.
  let emailDelivered = false;
  try {
    emailDelivered = await sendConfirmationEmail(data, id);
  } catch (error) {
    console.error("Confirmation email error:", error);
  }

  return NextResponse.json({ registrationId: id, emailDelivered }, { status: 201 });
}