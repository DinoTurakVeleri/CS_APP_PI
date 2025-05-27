const pool = require('../database');

// Dohvati sve treninge
exports.getAllTrainings = (req, res) => {
  const query = `
    SELECT 
      t.*, 
      l.name AS licence_name, 
      l.password AS licence_password
    FROM trainings t
    LEFT JOIN licences l ON t.licence_id = l.id
  `;
  pool.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Dodaj novi trening
exports.createTraining = (req, res) => {
  const { title, description, date, trainer, licence_id } = req.body;
  const query = 'INSERT INTO trainings (title, description, date, trainer, licence_id) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [title, description, date, trainer, licence_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, title, description, date, trainer, licence_id });
  });
};

// Ažuriraj trening
exports.updateTraining = (req, res) => {
  const { id } = req.params;
  const { title, description, date, trainer, licence_id } = req.body;
  const query = 'UPDATE trainings SET title = ?, description = ?, date = ?, trainer = ?, licence_id = ? WHERE id = ?';
  pool.query(query, [title, description, date, trainer, licence_id, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Training not found' });
    res.json({ id, title, description, date, trainer, licence_id });
  });
};

// Obriši trening
exports.deleteTraining = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM trainings WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Training not found' });
    res.status(204).send();
  });
};

// Odabir treninga kao korisnik
exports.assignTrainer = (req, res) => {
  const { id } = req.params;
  const { trainer } = req.body;

  const query = 'UPDATE trainings SET trainer = ? WHERE id = ?';
  pool.query(query, [trainer, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Training not found' });
    res.json({ message: 'Trainer assigned successfully' });
  });
};

