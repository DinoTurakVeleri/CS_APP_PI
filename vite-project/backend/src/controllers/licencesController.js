const pool = require('../database');

// Dohvati sve licence
exports.getAllLicences = (req, res) => {
  const query = 'SELECT * FROM licences';
  pool.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Dodaj novu licencu
exports.createLicence = (req, res) => {
  const { name, type, user, password } = req.body;

  if (!name || !type || !user || !password) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  const query = 'INSERT INTO licences (name, type, user, password) VALUES (?, ?, ?, ?)';
  pool.query(query, [name, type, user, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, name, type, user, password });
  });
};

// Ažuriraj licencu
exports.updateLicence = (req, res) => {
  const { id } = req.params;
  const { name, type, user, password } = req.body;

  const query = 'UPDATE licences SET name = ?, type = ?, user = ?, password = ? WHERE id = ?';
  pool.query(query, [name, type, user, password, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Licence not found' });
    res.json({ id, name, type, user, password });
  });
};

// Obriši licencu
exports.deleteLicence = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM licences WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Licence not found' });
    res.status(204).send();
  });
};
