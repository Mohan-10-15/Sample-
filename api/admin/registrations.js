/**
 * GET /api/admin/registrations
 *
 * Returns registrations and the format/headcount totals shown in the dashboard.
 * Requires the x-admin-key header.
 */

const { guardAdmin, isSupabaseConfigured, listRegistrations } = require("../_lib");

/** Do not read legacy payment data; current registrations are free. */
const LIST_PROJECTION = { payment: 0, amountDue: 0, passwordHash: 0, emails: 0 };

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Use GET." });
  }

  if (!guardAdmin(req, res)) return;

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: "SUPABASE_URL / SUPABASE_SECRET_KEY is not set on the server." });
  }

  try {
    const docs = await listRegistrations();
    const registrations = docs.map(({ payment, amountDue, passwordHash, emails, ...safe }) => safe);

    const totals = registrations.reduce(
      (acc, r) => {
        acc.registrations += 1;
        acc.participants += r.headcount;
        if (r.entryFormat === "duo") acc.duo += 1;
        else acc.solo += 1;
        return acc;
      },
      { registrations: 0, participants: 0, solo: 0, duo: 0 }
    );

    return res.status(200).json({ registrations, totals });
  } catch (e) {
    console.error("admin list failed", e);
    return res.status(503).json({ error: "Could not read registrations from the registry." });
  }
};
