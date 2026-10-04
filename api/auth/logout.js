const { clearTeamSession } = require("../auth_helpers");
module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  clearTeamSession(res);
  return res.status(200).json({ ok: true });
};
