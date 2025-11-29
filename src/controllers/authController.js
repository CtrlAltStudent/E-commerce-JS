const knex = require('../db/knex'); // upewnij się, że masz poprawny plik db/knex lub src/db/knex
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    // sprawdź czy użytkownik już istnieje
    const exists = await knex('users').where({ email }).first();
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const [user] = await knex('users').insert({
      email,
      password_hash: hash,
      first_name: first_name || null,
      last_name: last_name || null
    }).returning(['id','email','first_name','last_name']);

    return res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await knex('users').where({ email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash || user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    // na razie zwracamy user bez tokena — token dodamy w dalszych krokach
    return res.json({ user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name } });
  } catch (err) {
    next(err);
  }
};
