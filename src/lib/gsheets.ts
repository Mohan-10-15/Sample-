import { google, sheets_v4 } from "googleapis";
import { RegistrationInput } from "./schema";

/**
 * Google Sheets storage via a service account.
 * Required env vars (see .env.example):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PROJECT_ID
 *   GOOGLE_PRIVATE_KEY      (PEM, may contain \n escapes)
 *   GOOGLE_SHEET_ID         (the long id from the sheet URL)
 */

export function getGoogleEnv() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountEmail || !projectId || !privateKeyRaw || !sheetId) {
    throw new Error(
      "Server misconfigured: one or more GOOGLE_* environment variables are missing.",
    );
  }

  // Service-account JSON keys escape newlines as literal "\n" in the string.
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  return { serviceAccountEmail, projectId, privateKey, sheetId };
}

export function getSheetsClient(): sheets_v4.Sheets {
  const { serviceAccountEmail, privateKey } = getGoogleEnv();
  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export interface DuplicateCheck {
  field: "teamName" | "leaderEmail";
  value: string;
}

/**
 * Reads the sheet and looks for an existing team name or any email belonging to
 * the same registrant, so a team cannot be entered twice.
 */
export async function findDuplicate(
  input: RegistrationInput,
): Promise<DuplicateCheck | null> {
  const sheets = getSheetsClient();
  const { sheetId } = getGoogleEnv();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "A1:Z2000",
  });

  const rows = res.data.values ?? [];
  if (rows.length === 0) return null;

  const normalize = (v: string) => v.trim().toLowerCase();

  const teamName = normalize(input.teamName);
  if (rows.some((row) => normalize(row[1] ?? "") === teamName)) {
    return { field: "teamName", value: input.teamName };
  }

  const emails = [
    input.leader.email,
    ...input.members.map((m) => m.email),
  ].map(normalize);

  for (const row of rows) {
    // Row layout: 0=registrationId, 1=teamName, 2=leader email, 3..=member emails
    const rowEmails = row.slice(2).map((c) => normalize(String(c)));
    if (rowEmails.some((e) => e !== "" && emails.includes(e))) {
      return { field: "leaderEmail", value: row[2] ?? "" };
    }
  }

  return null;
}

/**
 * Builds a single wide row for the sheet and appends it.
 * Header row (create it in the sheet once):
 * registrationId | teamName | leaderEmail | leaderPhone | leaderFullName |
 * leaderDepartment | leaderYear | leaderRegisterNumber | member2Name |
 * member2Email | member2Department | member2Year | member3Name |
 * member3Email | member3Department | member3Year | member4Name |
 * member4Email | member4Department | member4Year | track | heardAbout |
 * tshirtSize | submittedAt
 */
export async function appendRegistration(
  input: RegistrationInput,
  registrationId: string,
): Promise<void> {
  const sheets = getSheetsClient();
  const { sheetId } = getGoogleEnv();

  const pad = (list: unknown[], size: number) => {
    const out = [...list];
    while (out.length < size) out.push("");
    return out;
  };

  const memberCells = pad(
    input.members.flatMap((m) => [m.fullName, m.email, m.department, m.year]),
    12,
  );

  const row = [
    registrationId,
    input.teamName,
    input.leader.email,
    input.leader.phone,
    input.leader.fullName,
    input.leader.department,
    input.leader.year,
    input.leader.registerNumber,
    ...memberCells,
    input.track,
    input.heardAbout,
    input.tshirtSize ?? "",
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}