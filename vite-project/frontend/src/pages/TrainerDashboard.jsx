import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TrainerDashboard.css';

const TrainerDashboard = ({ loggedInTrainer }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Trenutno odabrani datum
  const [trainings, setTrainings] = useState([]); // Svi treninzi iz baze
  const [message, setMessage] = useState(''); // Poruka korisniku

  // Dohvati sve treninge kad se stranica učita
  useEffect(() => {
    fetch('http://localhost:5001/api/trainings')
      .then(res => res.json())
      .then(setTrainings)
      .catch(() => setMessage('Greška pri učitavanju treninga.'));
  }, []);

  // Filtriraj korisnikove treninge
  const myTrainings = trainings.filter(t => t.trainer === loggedInTrainer);

  // Filtriraj treninge koji nemaju trenera
  const openTrainings = trainings.filter(t => !t.trainer);

  // Filtriraj treninge na odabrani datum
  const trainingsOnSelectedDate = myTrainings.filter(t => {
    const trainingDate = new Date(t.date);
    return trainingDate.toDateString() === selectedDate.toDateString();
  });

  // Prijava na slobodni trening
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

      {/* Desna strana: korisnikovi treninzi i otvoreni treninzi */}
      <div className="licence-section">
        <div className="training-list">
          <h3>My trainings</h3>
          {myTrainings.length > 0 ? (
            myTrainings.map(t => (
              <div key={t.id} className="training-item">
                <strong>{t.title}</strong><br />
                {new Date(t.date).toLocaleDateString()}<br />
                {t.description}
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
