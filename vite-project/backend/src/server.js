const express = require('express');
const cors = require('cors');
const pool = require('./database'); // Import pool za povezivanje na bazu
const bcrypt = require('bcryptjs'); // Za hashiranje lozinki
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Testna ruta za provjeru servera
app.get('/', (req, res) => {
  res.send('Backend server je pokrenut!');
});

// Ruta za registraciju korisnika
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Provjera da li su sva polja popunjena
  if (!username || !password) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  // Provjera minimalne duljine lozinke
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    // Provjera da li korisničko ime već postoji
    const [users] = await pool.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Hashiranje lozinke
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Dodavanje novog korisnika u bazu podataka
    const [result] = await pool.promise().query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );

    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

// Ruta za prijavu korisnika
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Provjera da li su sva polja popunjena
  if (!username || !password) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  try {
    // Pronalaženje korisnika u bazi podataka
    const [users] = await pool.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const user = users[0];

    // Provjera lozinke
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    // Ako je prijava uspješna, vraćamo odgovor
    res.status(200).json({ message: 'Login successful!', user: { id: user.user_id, username: user.username } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
}); 

// Ruta za dohvat podataka o licencama
app.get('/api/licences', (req, res) => {
  const query = 'SELECT * FROM licences'; // Pretpostavimo da je tablica naziva "licences"
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Vraća podatke u JSON formatu
  });
});

// Ruta za dodavanje nove licence
app.post('/api/licences', (req, res) => {
  const { name, type, user, password } = req.body;
  const query = 'INSERT INTO licences (name, type, user, password) VALUES (?, ?, ?, ?)';
  pool.query(query, [name, type, user, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, name, type, user, password });
  });
});

// Ruta za ažuriranje postojeće licence
app.put('/api/licences/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, user, password } = req.body;
  const query = 'UPDATE licences SET name = ?, type = ?, user = ?, password = ? WHERE id = ?';
  pool.query(query, [name, type, user, password, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Licenca nije pronađena' });
    }
    res.json({ id, name, type, user, password });
  });
});

// Ruta za brisanje licence
app.delete('/api/licences/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM licences WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Licenca nije pronađena' });
    }
    res.status(204).send(); // 204 No Content
  });
});

// Ruta za dohvat treninga
app.get('/api/trainings', (req, res) => {
  const query = 'SELECT * FROM trainings';
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Ruta za dodavanje treninga
app.post('/api/trainings', (req, res) => {
  const { title, description, date, trainer, licence_id } = req.body;
  const query = 'INSERT INTO trainings (title, description, date, trainer, licence_id) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [title, description, date, trainer, licence_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, title, description, date, trainer, licence_id });
  });
});

// Ruta za ažuriranje treninga
app.put('/api/trainings/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, trainer, licence_id } = req.body;
  const query = 'UPDATE trainings SET title = ?, description = ?, date = ?, trainer = ?, licence_id = ? WHERE id = ?';
  pool.query(query, [title, description, date, trainer, licence_id, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.json({ id, title, description, date, trainer, licence_id });
  });
});

// Ruta za brisanje treninga
app.delete('/api/trainings/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM trainings WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.status(204).send();
  });
});

// Pokreni server
app.listen(PORT, () => {
  console.log(`Server je pokrenut na http://localhost:${PORT}`);
});