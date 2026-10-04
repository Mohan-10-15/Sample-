const { guardAdmin, isMongoConfigured, getRegistrations, readJsonBody } = require("../_lib");

module.exports = async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Use PATCH." });
  if (!guardAdmin(req, res)) return;
  if (!isMongoConfigured()) return res.status(503).json({ error: "MONGODB_URI is not set on the server." });
  let body;
  try { body = await readJsonBody(req); } catch (_) { return res.status(400).json({ error: "Send a valid mark." }); }
  const registrationId = typeof body.registrationId === "string" ? body.registrationId.trim() : "";
  const raw = body.mark;
  const mark = raw === "" || raw === null || raw === undefined ? null : Number(raw);
  if (!registrationId) return res.status(400).json({ error: "Registration ID is required." });
  if (mark !== null && (!Number.isFinite(mark) || mark < 0 || mark > 100)) {
    return res.status(400).json({ error: "Mark must be between 0 and 100." });
  }
  try {
    const col = await getRegistrations();
    const result = await col.updateOne(
      { registrationId },
      { $set: { mark, markUpdatedAt: new Date() } }
    );
    if (!result.matchedCount) return res.status(404).json({ error: "Team record not found." });
    return res.status(200).json({ registrationId, mark });
  } catch (e) {
    console.error("admin mark failed", e);
    return res.status(503).json({ error: "Could not save the mark." });
  }
};
