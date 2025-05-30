const pool = require('../database');
const bcrypt = require('bcryptjs');

// Dohvati sve korisnike (ADMIN)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.promise().query('SELECT user_id, name, username, role FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Error fetching users.' });
  }
};

// Dodaj novog korisnika (ADMIN)
exports.createUser = async (req, res) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [existing] = await pool.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.promise().query(
      'INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, username, hashedPassword, role.toUpperCase()]
    );

    res.status(201).json({
      user_id: result.insertId,
      name,
      username,
      role: role.toUpperCase()
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Error creating user.' });
  }
};

// Ažuriraj korisnika (bez lozinke)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, role } = req.body;

  if (!name || !username || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await pool.promise().query(
      'UPDATE users SET name = ?, username = ?, role = ? WHERE user_id = ?',
      [name, username, role.toUpperCase(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user_id: id, name, username, role: role.toUpperCase() });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Error updating user.' });
  }
};

// Obriši korisnika
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.promise().query(
      'DELETE FROM users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Error deleting user.' });
  }
};

// Dohvati trenutno prijavljenog korisnika (USER ili ADMIN)
exports.getMyUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.promise().query(
      'SELECT user_id, name, username, role FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Error fetching user info.' });
  }
};
