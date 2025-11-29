const knex = require("../db/knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "change_this_secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role_id: user.role_id || null
    },
    secret,
    { expiresIn: jwtExpiresIn }
  );
}

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const existing = await knex("users").where({ email }).first();
  if (existing) return res.status(409).json({ message: "User already exists" });

  const hash = bcrypt.hashSync(password, 10);
  const [id] = await knex("users").insert({ email, password: hash, created_at: new Date(), updated_at: new Date() }).returning("id");
  const user = await knex("users").where({ id }).first();
  delete user.password;
  const token = signToken(user);
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const user = await knex("users").where({ email }).first();
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = bcrypt.compareSync(password, user.password || "");
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  delete user.password;
  const token = signToken(user);
  res.json({ token, user });
};

exports.me = async (req, res) => {
  // requireAuth middleware powinien ustawić req.user
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const user = req.user;
  delete user.password;
  res.json({ user });
};
