const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "changeme123";

/**
 * Middleware: expects header:
 *   Authorization: Bearer <token>
 * Po weryfikacji przyczepia obiekt payload jako req.user
 */
module.exports = (req, res, next) => {
  const auth = req.get('authorization') || req.get('Authorization');
  if (!auth) return res.status(401).json({ message: "Missing Authorization header" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: "Bad Authorization format. Expected: Bearer <token>" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
