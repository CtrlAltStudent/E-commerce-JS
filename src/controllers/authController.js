const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const JWT_SECRET = process.env.JWT_SECRET || "please-change-me";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password, first_name, last_name } = req.body;
      if (!email || !password) return res.status(400).json({ message: "email and password required" });

      const existing = await Users.findByEmail(email);
      if (existing) return res.status(409).json({ message: "Email already registered" });

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const user = await Users.create({ email, password_hash, first_name, last_name });
      delete user.password_hash;
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "email and password required" });

      const user = await Users.findByEmail(email);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });

      const payload = { sub: user.id, email: user.email, role_id: user.role_id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
};
