const jwt = require("jsonwebtoken");
const knex = require("../db/knex");
const secret = process.env.JWT_SECRET || "change_this_secret";

async function getUserFromToken(token) {
  try {
    const payload = jwt.verify(token, secret);
    if (!payload || !payload.sub) return null;
    const user = await knex("users").where({ id: payload.sub }).first();
    return user || null;
  } catch (err) {
    return null;
  }
}

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }
  const token = auth.split(" ")[1];
  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ message: "Invalid token or user not found" });
  // mask sensitive
  delete user.password;
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = req.user;
  // załóżmy: role_id === 1 => admin; jeśli masz tabelę roles możesz dostosować
  if (!user) return res.status(401).json({ message: "Not authenticated" });
  if (user.role_id !== 1) return res.status(403).json({ message: "Admin only" });
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  getUserFromToken
};
