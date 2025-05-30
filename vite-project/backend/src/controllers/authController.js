const jwt = require('jsonwebtoken');
const pool = require('../database');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'tajna_lozinka';

// LOGIN
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

    const tokenPayload = {
      id: user.user_id,
      username: user.username,
      role: user.role.toUpperCase() // osiguraj da je uvijek UPPERCASE
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: tokenPayload
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Login error.' });
  }
};

// REGISTER
exports.register = async (req, res) => {
  const { username, password, role = 'user' } = req.body;

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
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, passwordHash, role.toUpperCase()] // Uvijek spremi role kao velikim slovima
    );

    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Registration error.' });
  }
};
