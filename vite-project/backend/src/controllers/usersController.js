const pool = require('../database');
const bcrypt = require('bcryptjs');

// Dohvati sve korisnike
exports.getAllUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  pool.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Dodaj novog korisnika
exports.createUser = async (req, res) => {
  const { name, username, password_hash, role } = req.body;

  if (!name || !username || !password_hash || !role) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    const query = 'INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?)';
    pool.query(query, [name, username, hashedPassword, role], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ user_id: results.insertId, name, username, role });
    });
  } catch (err) {
    res.status(500).json({ error: 'Greška kod hashiranja lozinke.' });
  }
};

// Ažuriraj korisnika (bez promjene lozinke)
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, username, role } = req.body;

  const query = 'UPDATE users SET name = ?, username = ?, role = ? WHERE user_id = ?';
  pool.query(query, [name, username, role, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user_id: id, name, username, role });
  });
};

// Obriši korisnika
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE user_id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  });
};
