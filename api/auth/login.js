const { isSupabaseConfigured, findRegistrationByTeamNameKey } = require("../_lib");
const { verifyPassword, setTeamSession } = require("../auth_helpers");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "The team registry is not connected yet." });
  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ error: "Enter your team name and password." });
  }
  try {
    const team = await findRegistrationByTeamNameKey(username.trim().toLowerCase());
    if (!team || !team.passwordHash || !(await verifyPassword(password, team.passwordHash))) {
      return res.status(401).json({ error: "Team name or password is incorrect." });
    }
    setTeamSession(res, team.registrationId, team.teamName);
    return res.status(200).json({ username: team.teamName, registrationId: team.registrationId });
  } catch (e) {
    console.error("team login failed", e);
    return res.status(503).json({ error: "Could not reach the team registry." });
  }
};
