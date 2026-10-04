// =============================================================================
// Reverse Hackathon 2026 — SITE CONFIGURATION
// -----------------------------------------------------------------------------
// Every editable event value lives in this one file. Edit here and the whole
// site, form, countdown and confirmation emails update together.
//
// ⚠️  Values marked "EDIT-ME" are working placeholders. Provide the real
// numbers before launch (see README -> "Before You Go Live").
//
// ⏰  DATE WARNING: the working dates below (13 March 2026) are already in the
// PAST relative to today. The registration form auto-SEALS once the deadline
// passes, so while you develop you MUST point `registrationOpenISO` and
// `registrationDeadlineISO` at future dates (or the form shows "The book is
// sealed" and /api/register refuses every request).
// =============================================================================

export const siteConfig = {
  eventName: "Reverse Hackathon 2026",
  eventNameAccent: "2026",
  tagline:
    "They hand you the system. You find the weakness, mend the wound, and answer for it before the Family.",
  /** Single working date — EDIT-ME: DD MMMM YYYY */
  eventDateLabel: "13 March 2026",
  /** Used by the countdown clock. Keep in Asia/Kolkata offset. EDIT-ME */
  eventDateTimeISO: "2026-03-13T09:00:00+05:30",
  /** EDIT-ME: registration deadline shown on the form. */
  registrationDeadlineLabel: "11 March 2026, 11:59 PM IST",
  /** Used to close the form. EDIT-ME */
  registrationDeadlineISO: "2026-03-11T23:59:00+05:30",
  /** EDIT-ME: when registration opens (form unlocks). */
  registrationOpenISO: "2026-01-10T09:00:00+05:30",

  venue: {
    name: "Department of Cyber Security",
    college: "SRM Valliammai Engineering College",
    city: "Kattankulathur, Chennai, Tamil Nadu",
    address:
      "SRM Valliammai Engineering College, Kattankulathur, Chengalpattu District, Tamil Nadu 603203",
  },

  organizer: "Whitehat Club, Department of Cyber Security",
  college: "SRM Valliammai Engineering College",

  teamSize: { min: 2, max: 4 as const },

  /** EDIT-ME: The Cut (prizes). Update amounts/currencies freely. */
  prizes: [
    {
      place: "1st Place",
      numeral: "I",
      title: "The Crown",
      amount: "₹15,000",
      detail: "Cash prize, trophies and certificates for every member.",
      color: "gold",
    },
    {
      place: "2nd Place",
      numeral: "II",
      title: "The Right Hand",
      amount: "₹10,000",
      detail: "Cash prize, medallions and certificates for every member.",
      color: "silver",
    },
    {
      place: "3rd Place",
      numeral: "III",
      title: "The Underboss",
      amount: "₹5,000",
      detail: "Cash prize, medallions and certificates for every member.",
      color: "bronze",
    },
  ],
  specialPrize: {
    title: "Best Patch",
    detail:
      "A special commendation for the single cleanest, most elegant fix of the day — judged on craft, not volume.",
    award: "Special trophy and swag pack",
  },

  /** EDIT-ME — contact + social handles. */
  contact: {
    email: "whitehat.club@srmvalliammai.edu.in",
    instagram: "https://www.instagram.com/whitehat.srmv",
    instagramHandle: "@whitehat.srmv",
    linkedin: "https://www.linkedin.com/company/whitehat-club-srmv",
    linkedinHandle: "Whitehat Club SRMV",
  },

  /**
   * EDIT-ME — competition tracks. If the array has more than one entry the
   * registration form shows a "Track" selector. Keep a single entry to hide it.
   */
  tracks: [
    { id: "appsense", label: "AppSense — Web Application Security" },
    { id: "netguard", label: "NetGuard — Network & Systems Hardening" },
  ],

  heardAboutOptions: [
    "Instagram",
    "LinkedIn",
    "College notice / department",
    "Friend or senior",
    "Classroom announcement",
  ],

  tshirtSizes: ["S", "M", "L", "XL", "XXL"],

  /** Nicknames used as flavor text only — official titles always remain primary. */
  schedule: [
    { time: "09:00", label: "Registration & The Briefing", plain: "Check-in, rules read, and the vulnerable build is handed over." },
    { time: "09:45", label: "The Hunt Begins", plain: "The hacking window opens. Find flaws, document them, patch them." },
    { time: "12:30", label: "Checkpoint", plain: "A ten-minute progress check with the mentors. Nobody gets stuck alone." },
    { time: "13:00", label: "Intermission", plain: "Lunch is served. The code keeps its secrets until you return." },
    { time: "14:00", label: "The Hunt Resumes", plain: "Back to the trenches. Final patches take shape." },
    { time: "16:30", label: "The Handover", plain: "Submit patched code and the written defence." },
    { time: "17:00", label: "The Tribunal", plain: "Judges review fixes and hear each team's ten-minute defence." },
    { time: "18:30", label: "Results & The Cut", plain: "The verdict is read. Prizes are paid, honours conferred." },
  ],
} as const;

/** Creates a Date from the ISO strings above. */
export const EVENT_DATE = new Date(siteConfig.eventDateTimeISO);
export const REG_OPEN_DATE = new Date(siteConfig.registrationOpenISO);
export const REG_DEADLINE_DATE = new Date(siteConfig.registrationDeadlineISO);

/** Short human date for hero, e.g. "Friday, 13 March 2026". */
export function formatEventDate(): string {
  try {
    return EVENT_DATE.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return siteConfig.eventDateLabel;
  }
}

export function formatEventTime(): string {
  try {
    return EVENT_DATE.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "9:00 AM";
  }
}