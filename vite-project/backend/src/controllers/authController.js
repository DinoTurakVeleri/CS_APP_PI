const pool = require('../database'); // Povezivanje s bazom
const bcrypt = require('bcryptjs');  // Za hashiranje lozinki

// Funkcija za registraciju korisnika
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const [users] = await pool.promise().query(
      'SELECT * FROM users WHERE username = ?', [username]
    );

    if (users.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.promise().query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );

    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Registration error.' });
  }
};

// 📌 Funkcija za prijavu korisnika
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  try {
    const [users] = await pool.promise().query(
      'SELECT * FROM users WHERE username = ?', [username]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    res.status(200).json({
      message: 'Login successful!',
      user: { id: user.user_id, username: user.username }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Login error.' });
  }
};
