const { isSupabaseConfigured, getRegistrationById } = require("../_lib");
const { requireTeam } = require("../auth_helpers");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });
  const session = requireTeam(req, res);
  if (!session) return;
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "The team registry is not connected yet." });
  try {
    const team = await getRegistrationById(session.sub);
    if (team) {
      delete team.passwordHash;
      delete team.emails;
      delete team.agree;
    }
    if (!team) return res.status(404).json({ error: "Team record not found." });
    return res.status(200).json({ team });
  } catch (e) {
    console.error("team profile failed", e);
    return res.status(503).json({ error: "Could not load the team workspace." });
  }
};
