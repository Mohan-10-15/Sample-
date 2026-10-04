/**
 * Shared helpers for the Mission Deck serverless functions.
 *
 * The site itself is a single static index.html, so everything that needs a
 * server (registration storage, the organiser dashboard, the Excel export)
 * lives in /api as Vercel Node functions talking to MongoDB Atlas.
 */

const { MongoClient } = require("mongodb");

const EVENT_START_ISO = "2026-10-13T09:00:00+05:30";
/** The ledger closes at 07:00 on the day of the event. */
const REGISTRATION_DEADLINE_ISO = "2026-10-13T07:00:00+05:30";

const YEARS = ["I", "II", "III"];
const GENDERS = ["Female", "Male"];
const HEARD_ABOUT = [
  "Instagram",
  "WhatsApp",
  "Friend or senior",
  "Faculty",
  "Flyer / poster",
  "Other",
];

/** 15 practice domains, matching the <select> in index.html. */
const DOMAINS = [
  "Ethical Hacking",
  "Penetration Testing",
  "CTF & Capture The Flag",
  "Digital Forensics",
  "Reverse Engineering",
  "Cryptography",
  "Web App Security",
  "Network Security",
  "Malware Analysis",
  "Binary Exploitation / Pwn",
  "OSINT & Social Engineering",
  "Cloud Security",
  "Incident Response",
  "Zero-Day Hunting",
  "Quantum & Next-Gen Crypto",
];

let clientPromise = null;

function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

function dbName() {
  return process.env.MONGODB_DB || "reversehack2026";
}

/**
 * Vercel recycles containers, so the client is cached on globalThis to avoid
 * opening a new connection pool on every warm invocation.
 */
function getClient() {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");
    const holder = globalThis;
    if (holder.__missionDeckMongo) {
      clientPromise = holder.__missionDeckMongo;
    } else {
      const client = new MongoClient(uri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 8000,
      });
      clientPromise = client.connect();
      holder.__missionDeckMongo = clientPromise;
    }
  }
  return clientPromise;
}

async function getDb() {
  const client = await getClient();
  return client.db(dbName());
}

async function getRegistrations() {
  const db = await getDb();
  return db.collection("registrations");
}

/** Creates the unique indexes once; safe to call on every write. */
async function ensureIndexes() {
  const col = await getRegistrations();
  await Promise.all([
    col.createIndex({ teamNameKey: 1 }, { unique: true, name: "uniq_team" }),
    col.createIndex({ emails: 1 }, { unique: true, name: "uniq_email" }),
    col.createIndex({ submittedAt: -1 }, { name: "by_submitted" }),
  ]);
}

/* ------------------------------------------------------------------ *
 * Admin auth
 * ------------------------------------------------------------------ */

function isAdminConfigured() {
  return Boolean(process.env.ADMIN_KEY);
}

/** Constant-time compare so the key cannot be probed byte by byte. */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return require("crypto").timingSafeEqual(bufA, bufB);
}

function isAdminRequest(req) {
  const configured = process.env.ADMIN_KEY;
  if (!configured) return false;
  const header =
    req.headers["x-admin-key"] ||
    req.headers["X-Admin-Key"] ||
    (req.query && req.query.key);
  if (typeof header !== "string" || header.length === 0) return false;
  return safeEqual(header, configured);
}

/** Standard guard for every admin route. */
function guardAdmin(req, res) {
  if (!isAdminConfigured()) {
    res.status(503).json({
      error:
        "ADMIN_KEY is not set on the server. Add it in Vercel → Settings → Environment Variables.",
    });
    return false;
  }
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Locked. A valid admin key is required." });
    return false;
  }
  return true;
}

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isPhone(v) {
  if (typeof v !== "string") return false;
  const digits = v.replace(/[\s-]/g, "");
  return /^(\+91)?[6-9]\d{9}$/.test(digits) || /^\+?\d{10,15}$/.test(digits);
}

function clean(v, max) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Register numbers are alphanumeric, optionally separated by / or -. This is
 * deliberately stricter than the "at least 3 characters" check on the form, so
 * junk like "abc!!!" cannot reach the organiser's spreadsheet.
 */
function isRollNumber(v) {
  return typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9/-]{2,39}$/.test(v.trim());
}

/**
 * Validates the incoming registration. Returns either
 * `{ ok: true, value }` or `{ ok: false, fieldErrors }` where fieldErrors maps
 * a payload path to an array of messages, matching what the form renders.
 */
function validateRegistration(body) {
  const errors = {};
  const fail = (path, message) => {
    (errors[path] = errors[path] || []).push(message);
  };

  if (!body || typeof body !== "object") {
    return { ok: false, fieldErrors: { _: ["Send a registration object."] } };
  }

  const entryFormat = body.entryFormat === "duo" ? "duo" : "solo";
  if (body.entryFormat !== "solo" && body.entryFormat !== "duo") {
    fail("entryFormat", "Choose SOLO or TEAM OF TWO.");
  }

  const teamName = clean(body.teamName, 60);
  if (teamName.length < 2) fail("teamName", "Enter a team name or solo alias.");

  const leader = {
    fullName: clean(body.leader?.fullName, 80),
    email: clean(body.leader?.email, 120).toLowerCase(),
    phone: clean(body.leader?.phone, 20),
    year: clean(body.leader?.year, 8),
    department: clean(body.leader?.department, 80),
    gender: clean(body.leader?.gender, 20),
    rollNumber: clean(body.leader?.rollNumber, 40),
  };

  if (leader.fullName.length < 2) fail("leader.fullName", "Enter the full name.");
  if (!isEmail(leader.email)) fail("leader.email", "Enter a valid email address.");
  if (!isPhone(leader.phone)) fail("leader.phone", "Enter a valid mobile number.");
  if (!YEARS.includes(leader.year)) fail("leader.year", "Select year I, II or III.");
  if (leader.department.length < 2) fail("leader.department", "Select your department.");
  if (!GENDERS.includes(leader.gender)) fail("leader.gender", "Select Male or Female.");
  if (leader.rollNumber.length < 3) fail("leader.rollNumber", "Enter your register number.");
  else if (!isRollNumber(leader.rollNumber)) {
    fail("leader.rollNumber", "Register number accepts letters, numbers, / and - only.");
  }

  let partner = null;
  if (entryFormat === "duo") {
    partner = {
      fullName: clean(body.partner?.fullName, 80),
      year: clean(body.partner?.year, 8),
      rollNumber: clean(body.partner?.rollNumber, 40),
    };
    if (partner.fullName.length < 2) fail("partner.fullName", "Enter your partner's full name.");
    if (!YEARS.includes(partner.year)) fail("partner.year", "Select your partner's year.");
    if (partner.rollNumber.length < 3) fail("partner.rollNumber", "Enter your partner's register number.");
    else if (!isRollNumber(partner.rollNumber)) {
      fail("partner.rollNumber", "Register number accepts letters, numbers, / and - only.");
    }
  }

  const domain = clean(body.domain, 60);
  if (!DOMAINS.includes(domain)) fail("domain", "Choose one domain.");

  const heardAbout = clean(body.heardAbout, 40);
  if (!HEARD_ABOUT.includes(heardAbout)) fail("heardAbout", "Tell us how you heard about the event.");

  if (body.agree !== true) fail("agree", "Accept the rules to enter the ledger.");

  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  const headcount = entryFormat === "duo" ? 2 : 1;
  // Only the lead is required to give an email, but index one if supplied so
  // a partner cannot reuse an address that is already on the ledger.
  const emails = [leader.email];
  const partnerEmail = clean(body.partner?.email, 120).toLowerCase();
  if (partnerEmail) emails.push(partnerEmail);

  return {
    ok: true,
    value: {
      entryFormat,
      teamName,
      teamNameKey: teamName.toLowerCase(),
      leader,
      partner,
      emails,
      domain,
      heardAbout,
      agree: true,
      headcount,
    },
  };
}

function newRegistrationId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = require("crypto").randomBytes(3).toString("hex").toUpperCase();
  return `RH26-${stamp}-${rand}`;
}

function registrationWindowOpen(now = new Date()) {
  return now.getTime() < new Date(REGISTRATION_DEADLINE_ISO).getTime();
}

/** Reads a JSON body from a Vercel Node function, with a size guard. */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      // Registration data is small; reject unexpectedly large payloads.
      if (size > 256 * 1024) {
        reject(new Error("PAYLOAD_TOO_LARGE"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (e) {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}

/* ------------------------------------------------------------------ email */

const EVENT_NAME = "Reverse Hackathon 2026";
const ORGANISER = "The Whitehatians, Department of Cyber Security";
const COLLEGE = "SRM Valliammai Engineering College";
const EVENT_DATE_LABEL = "Tuesday, 13 October 2026";

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function mailFrom() {
  return process.env.MAIL_FROM || process.env.SMTP_USER;
}

/** Where the organiser wants a copy of every confirmation. Optional. */
function mailNotifyTo() {
  const to = process.env.MAIL_NOTIFY_TO;
  return to ? String(to).split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function participantRows(reg) {
  const rows = [
    ["Role", "Name", "Email", "Mobile", "Year", "Register no."],
    [
      reg.headcount === 2 ? "Capo (team lead)" : "Solo participant",
      reg.leader.fullName,
      reg.leader.email,
      reg.leader.phone,
      reg.leader.year,
      reg.leader.rollNumber,
    ],
  ];
  if (reg.headcount === 2 && reg.partner) {
    rows.push([
      "Soldato (partner)",
      reg.partner.fullName,
      "-",
      "-",
      reg.partner.year,
      reg.partner.rollNumber,
    ]);
  }
  return rows;
}

function buildConfirmationHtml(reg) {
  const rows = participantRows(reg)
    .map((cells, i) => {
      const tag = i === 0 ? "th" : "td";
      return `<tr>${cells.map((c) => `<${tag}>${escapeHtml(String(c ?? "-"))}</${tag}>`).join("")}</tr>`;
    })
    .join("");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#0b0d12;font-family:Georgia,'Times New Roman',serif;color:#e8e6e1">
<div style="max-width:620px;margin:0 auto;background:#141821;border:1px solid #2a2f3d;border-radius:10px;overflow:hidden">
  <div style="background:#0f1219;border-bottom:2px solid #c8a35a;padding:22px 26px">
    <div style="color:#c8a35a;font-size:11px;letter-spacing:.28em;text-transform:uppercase">Registration confirmed</div>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:normal;color:#fff">${escapeHtml(EVENT_NAME)}</h1>
  </div>
  <div style="padding:26px">
    <p style="margin:0 0 18px;font-size:15px">Hi ${escapeHtml(reg.leader.fullName)},</p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6">
      Your seat in the ledger is confirmed. Registration is free; no payment or receipt is required. Bring the details below to check in.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin:0 0 22px">
      <tr>
        <td style="padding:8px 0;color:#8f96a8;width:110px">Registration ID</td>
        <td style="padding:8px 0;font-family:monospace;color:#c8a35a">${escapeHtml(reg.registrationId)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8f96a8">Format</td>
        <td style="padding:8px 0">${reg.headcount === 2 ? "Duo" : "Solo"}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8f96a8">${reg.headcount === 2 ? "Team" : "Alias"}</td>
        <td style="padding:8px 0">${escapeHtml(reg.teamName)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8f96a8">Domain</td>
        <td style="padding:8px 0">${escapeHtml(reg.domain)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8f96a8">Event</td>
        <td style="padding:8px 0">${escapeHtml(EVENT_DATE_LABEL)}, 09:00 IST</td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin:0 0 24px">
      ${rows}
    </table>
    <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#8f96a8">
      Gates open 08:00 IST. Venue: ${escapeHtml(COLLEGE)}.
    </p>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#8f96a8">
      &mdash; ${escapeHtml(ORGANISER)}
    </p>
  </div>
</div>
</body></html>`;
}

function buildConfirmationText(reg) {
  const lines = [
    "Registration confirmed",
    "",
    `Hi ${reg.leader.fullName},`,
    "",
    `Your seat in the ledger is confirmed for ${EVENT_NAME}.`,
    "",
    `Registration ID : ${reg.registrationId}`,
    `Format          : ${reg.headcount === 2 ? "Duo" : "Solo"}`,
    `${reg.headcount === 2 ? "Team" : "Alias"}         : ${reg.teamName}`,
    `Domain          : ${reg.domain}`,
    "Entry fee       : Free (no payment required)",
    `Event           : ${EVENT_DATE_LABEL}, 09:00 IST`,
    "",
    "Participants",
    ...participantRows(reg).map((r) => "  " + r.filter(Boolean).join(" | ")),
    "",
    `Gates open 08:00 IST. Venue: ${COLLEGE}.`,
    "",
    `- ${ORGANISER}`,
  ];
  return lines.join("\n");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/**
 * Sends the participant confirmation. Deliberately never throws: a registration
 * that is already committed to MongoDB must not be rolled back because the mail
 * server was briefly down. Returns true only when the mail was accepted.
 */
async function sendConfirmationEmail(reg) {
  if (!smtpConfigured()) return false;
  let transporter;
  try {
    const nodemailer = require("nodemailer");
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } catch (e) {
    console.error("mail transport unavailable", e && e.message);
    return false;
  }

  const notifyTo = mailNotifyTo();
  const message = {
    from: mailFrom(),
    to: reg.leader.email,
    subject: `[${EVENT_NAME}] Registration confirmed - ${reg.registrationId}`,
    text: buildConfirmationText(reg),
    html: buildConfirmationHtml(reg),
    headers: { "X-Entity-Ref-ID": reg.registrationId },
  };
  if (notifyTo.length) {
    message.cc = notifyTo;
    message.bcc = notifyTo;
  }

  try {
    await transporter.sendMail(message);
    return true;
  } catch (e) {
    console.error("confirmation email failed", reg.registrationId, e && e.message);
    return false;
  }
}

module.exports = {
  EVENT_START_ISO,
  REGISTRATION_DEADLINE_ISO,
  EVENT_NAME,
  ORGANISER,
  COLLEGE,
  EVENT_DATE_LABEL,
  DOMAINS,
  HEARD_ABOUT,
  YEARS,
  isMongoConfigured,
  getDb,
  getRegistrations,
  ensureIndexes,
  isAdminConfigured,
  isAdminRequest,
  guardAdmin,
  validateRegistration,
  newRegistrationId,
  registrationWindowOpen,
  readJsonBody,
  smtpConfigured,
  sendConfirmationEmail,
};
