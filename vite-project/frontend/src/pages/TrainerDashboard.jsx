import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TrainerDashboard.css';

const TrainerDashboard = ({ loggedInTrainer }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [licences, setLicences] = useState([]);
  const [selectedLicenceId, setSelectedLicenceId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/api/licences')
      .then(res => res.json())
      .then(data => setLicences(data))
      .catch(() => setMessage('Failed to load licences.'));
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedLicenceId(''); // reset odabira
    setMessage('');
  };

  const assignLicence = () => {
    if (!selectedLicenceId) {
      setMessage('Please select a licence.');
      return;
    }

    fetch(`http://localhost:5001/api/licences/${selectedLicenceId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usage_date: selectedDate.toISOString().split('T')[0],
        assigned_trainer: loggedInTrainer,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => setMessage('Licence successfully assigned.'))
      .catch(() => setMessage('Failed to assign licence.'));
  };

  return (
    <div className="trainer-dashboard">
      <div className="calendar-section">
        <h2>Training Calendar</h2>
        <Calendar value={selectedDate} onClickDay={handleDateChange} />
      </div>

      <div className="licence-section">
        <h2>Assign Licence for {selectedDate.toDateString()}</h2>
        <select
          value={selectedLicenceId}
          onChange={(e) => setSelectedLicenceId(e.target.value)}
        >
          <option value="">-- Select Licence --</option>
          {licences.map((lic) => (
            <option key={lic.id} value={lic.id}>
              {lic.name} ({lic.type})
            </option>
          ))}
        </select>
        <button onClick={assignLicence}>Assign</button>

        {message && (
          <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
