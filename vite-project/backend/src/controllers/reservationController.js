const pool = require('../database');

exports.getFreeLicencesForToday = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const [rows] = await pool.promise().query(
      `SELECT * FROM licences WHERE usage_date IS NULL OR usage_date != ?`,
      [today]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching free licences:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.reserveLicence = async (req, res) => {
  const { id, username } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  if (!id || !username) {
    return res.status(400).json({ error: 'Missing licence ID or username' });
  }

  try {
    const [result] = await pool.promise().query(
      `UPDATE licences
       SET usage_date = ?, user = ?, assigned_trainer = ?
       WHERE id = ? AND (usage_date IS NULL OR usage_date != ?)`,
      [today, username, username, id, today]
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({ error: 'Licence already reserved for today' });
    }

    res.json({ message: 'Licence reserved successfully' });
  } catch (err) {
    console.error('Error reserving licence:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
