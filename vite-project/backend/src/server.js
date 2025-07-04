require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const licencesRoutes = require('./routes/licencesRoutes');
const trainingsRoutes = require('./routes/trainingsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const reservationRoutes = require('./routes/reservationRoutes');


const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Test ruta
app.get('/', (req, res) => {
  res.send('Backend server je pokrenut!');
});

// Rute
app.use('/api', authRoutes);                 // /api/register, /api/login
app.use('/api/licences', licencesRoutes);   // /api/licences + :id
app.use('/api/trainings', trainingsRoutes); // /api/trainings + :id
app.use('/api/users', usersRoutes);     // /api/users + :id
app.use('/api', reservationRoutes);


// Start servera
app.listen(PORT, () => {
  console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
