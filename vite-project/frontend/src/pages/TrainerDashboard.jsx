import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TrainerDashboard.css';

const TrainerDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Dohvati trenutno ulogiranog korisnika
  useEffect(() => {
    fetch('/api/users/me', { headers: authHeaders })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(setCurrentUser)
      .catch(() => setMessage('Error fetching user.'));
  }, []);

  // Dohvati treninge
  useEffect(() => {
    fetch('/api/trainings', { headers: authHeaders })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(setTrainings)
      .catch(() => setMessage('Error fetching trainings.'));
  }, []);

  const myTrainings = trainings.filter(t => t.trainer === currentUser?.username);
  const openTrainings = trainings.filter(t => !t.trainer);

  const trainingsOnSelectedDate = myTrainings.filter(t => {
    const trainingDate = new Date(t.date);
    return trainingDate.toDateString() === selectedDate.toDateString();
  });

  const handleAssign = (id) => {
    fetch(`/api/trainings/${id}/assign`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ trainer: currentUser?.username }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setMessage('Successfully assigned to training.');
        return fetch('/api/trainings', { headers: authHeaders });
      })
      .then(res => res.json())
      .then(setTrainings)
      .catch(() => setMessage('Error while signing up for training.'));
  };

  return (
    <div className="trainer-dashboard">
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
