const { isSupabaseConfigured, updateRegistration, readJsonBody } = require("../_lib");
const { requireTeam } = require("../auth_helpers");

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  const session = requireTeam(req, res);
  if (!session) return;
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "The team registry is not connected yet." });
  let body;
  try { body = await readJsonBody(req); } catch (_) { return res.status(400).json({ error: "Send a valid submission." }); }
  const problemStatement = clean(body.problemStatement, 5000);
  const solution = clean(body.solution, 8000);
  if (problemStatement.length < 20) return res.status(400).json({ error: "Write a problem statement with at least 20 characters." });
  if (solution.length < 20) return res.status(400).json({ error: "Write a solution with at least 20 characters." });
  try {
    const now = new Date().toISOString();
    const updated = await updateRegistration(session.sub, { problemStatement, solution, submittedAtWork: now, updatedAt: now });
    if (!updated) return res.status(404).json({ error: "Team record not found." });
    return res.status(200).json({ message: "Submission updated.", submittedAtWork: now });
  } catch (e) {
    console.error("team submission failed", e);
    return res.status(503).json({ error: "Could not save the team submission." });
  }
};
