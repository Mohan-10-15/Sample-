const crypto = require("crypto");

function sessionSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_KEY || "development-only-change-me";
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, derived) => {
      if (err) return reject(err);
      resolve(`scrypt$${salt}$${derived.toString("hex")}`);
    });
  });
}

function verifyPassword(password, stored) {
  return new Promise((resolve, reject) => {
    const [scheme, salt, digest] = String(stored || "").split("$");
    if (scheme !== "scrypt" || !salt || !digest) return resolve(false);
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, derived) => {
      if (err) return reject(err);
      const expected = Buffer.from(digest, "hex");
      resolve(expected.length === derived.length && crypto.timingSafeEqual(expected, derived));
    });
  });
}

function sign(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function readCookie(req, name) {
  const raw = String(req.headers.cookie || "");
  const match = raw.split(";").map((s) => s.trim()).find((s) => s.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function verifyToken(token) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

function setTeamSession(res, registrationId, teamName) {
  const token = sign({ sub: registrationId, teamName, exp: Date.now() + 1000 * 60 * 60 * 12 });
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL ? "; Secure" : "";
  res.setHeader("Set-Cookie", `rh_team_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${secure}`);
}

function clearTeamSession(res) {
  res.setHeader("Set-Cookie", "rh_team_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
}

function getTeamSession(req) {
  return verifyToken(readCookie(req, "rh_team_session"));
}

function requireTeam(req, res) {
  const session = getTeamSession(req);
  if (!session) {
    res.status(401).json({ error: "Your team session has expired. Log in again." });
    return null;
  }
  return session;
}

module.exports = { hashPassword, verifyPassword, setTeamSession, clearTeamSession, getTeamSession, requireTeam };
