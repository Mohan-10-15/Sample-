const { isMongoConfigured, getRegistrations } = require("../_lib");
const { requireTeam } = require("../auth_helpers");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });
  const session = requireTeam(req, res);
  if (!session) return;
  if (!isMongoConfigured()) return res.status(503).json({ error: "The team registry is not connected yet." });
  try {
    const col = await getRegistrations();
    const team = await col.findOne({ registrationId: session.sub }, { projection: { passwordHash: 0, emails: 0, agree: 0 } });
    if (!team) return res.status(404).json({ error: "Team record not found." });
    return res.status(200).json({ team });
  } catch (e) {
    console.error("team profile failed", e);
    return res.status(503).json({ error: "Could not load the team workspace." });
  }
};
