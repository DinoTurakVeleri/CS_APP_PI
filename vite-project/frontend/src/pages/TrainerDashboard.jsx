import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TrainerDashboard.css';

const TrainerDashboard = ({ loggedInTrainer }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]);
  const [users, setUsers] = useState([]); // Dodano: korisnici
  const [message, setMessage] = useState('');

  // Dohvati treninge
  useEffect(() => {
    fetch('http://localhost:5001/api/trainings')
      .then(res => res.json())
      .then(setTrainings)
      .catch(() => setMessage('Greška pri učitavanju treninga.'));
  }, []);

  // Dohvati korisnike
  useEffect(() => {
    fetch('http://localhost:5001/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setMessage('Greška pri učitavanju korisnika.'));
  }, []);

  // Pronađi korisnikovo "name" iz "username"
  const currentUser = users.find(u => u.username === loggedInTrainer);
  const currentName = currentUser?.name || '';

  // Filtriraj treninge na temelju imena trenera
  const myTrainings = trainings.filter(t => t.trainer === loggedInTrainer);
  const openTrainings = trainings.filter(t => !t.trainer);

  const trainingsOnSelectedDate = myTrainings.filter(t => {
    const trainingDate = new Date(t.date);
    return trainingDate.toDateString() === selectedDate.toDateString();
  });

  const handleAssign = (id) => {
    fetch(`http://localhost:5001/api/trainings/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainer: loggedInTrainer }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setMessage('Uspješno ste se prijavili na trening.');
        return fetch('http://localhost:5001/api/trainings');
      })
      .then(res => res.json())
      .then(setTrainings)
      .catch(() => setMessage('Greška pri prijavi na trening.'));
  };

  return (
    <div className="trainer-dashboard">
      {/* Lijeva strana: kalendar + detalji */}
      <div className="calendar-section">
        <h2>Trainings calendar</h2>
        <Calendar
          value={selectedDate}
          onClickDay={setSelectedDate}
          tileContent={({ date }) => {
            const isMyTraining = myTrainings.some(
              t => new Date(t.date).toDateString() === date.toDateString()
            );
            return isMyTraining ? <div className="dot"></div> : null;
          }}
        />

        <div className="day-details">
          <h3>Details for {selectedDate.toDateString()}</h3>
          {trainingsOnSelectedDate.length > 0 ? (
            trainingsOnSelectedDate.map(t => (
              <div key={t.id} className="training-item">
                <strong>{t.title}</strong><br />
                {t.description}
              </div>
            ))
          ) : (
            <p>No trainings today.</p>
          )}
        </div>
      </div>

      {/* Desna strana */}
      <div className="licence-section">
        <div className="training-list">
          <h3>My trainings</h3>
          {myTrainings.length > 0 ? (
            myTrainings.map(t => (
              <div key={t.id} className="training-item">
                <strong>{t.title}</strong><br />
                {new Date(t.date).toLocaleDateString()}<br />
                {t.description}<br />
                Licence: {t.licence_name || 'N/A'}<br />
                Password: {t.licence_password || 'N/A'}
              </div>
            ))
          ) : (
            <p>No scheduled trainings.</p>
          )}
        </div>

        <div className="training-list">
          <h3>Available trainings</h3>
          {openTrainings.length > 0 ? (
            openTrainings.map(t => (
              <div key={t.id} className="training-item">
                <strong>{t.title}</strong><br />
                {new Date(t.date).toLocaleDateString()}<br />
                {t.description}<br />
                <button onClick={() => handleAssign(t.id)}>Sign up</button>
              </div>
            ))
          ) : (
            <p>No available trainings.</p>
          )}
        </div>

        {message && (
          <div className={`message ${message.includes('Greška') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
