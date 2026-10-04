/**
 * GET /api/admin/registrations
 *
 * Returns registrations and the format/headcount totals shown in the dashboard.
 * Requires the x-admin-key header.
 */

const { guardAdmin, isMongoConfigured, getRegistrations } = require("../_lib");

/** Do not read legacy payment data; current registrations are free. */
const LIST_PROJECTION = { payment: 0, amountDue: 0, passwordHash: 0, emails: 0 };

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Use GET." });
  }

  if (!guardAdmin(req, res)) return;

  if (!isMongoConfigured()) {
    return res.status(503).json({ error: "MONGODB_URI is not set on the server." });
  }

  try {
    const col = await getRegistrations();
    const docs = await col.find({}, { projection: LIST_PROJECTION }).sort({ submittedAt: -1 }).toArray();

    const registrations = docs;

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
