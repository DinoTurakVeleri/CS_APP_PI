import React, { useEffect, useState } from 'react';
import './ReservationLicence.css';

const ReservationLicence = () => {
  const [freeLicences, setFreeLicences] = useState([]);
  const [selectedLicence, setSelectedLicence] = useState('');
  const [reservedLicence, setReservedLicence] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pendingLicence, setPendingLicence] = useState(null);

  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchFreeLicences();
    const stored = localStorage.getItem('reservedLicence');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const today = new Date().toISOString().slice(0, 10);
        if (parsed.usage_date === today) {
          setReservedLicence(parsed);
        } else {
          localStorage.removeItem('reservedLicence');
        }
      } catch {}
    }
  }, []);

  const fetchFreeLicences = () => {
    fetch('http://localhost:5001/api/free-licences')
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(setFreeLicences)
      .catch(() => {
        setMessageType('error');
        setMessage('Error fetching licences.');
      });
  };

  const handleReserveClick = () => {
    const today = new Date().toISOString().slice(0, 10);

    if (reservedLicence && reservedLicence.usage_date === today) {
      setMessageType('error');
      setMessage('You have already reserved a licence for today.');
      return;
    }

    if (!selectedLicence) {
      setMessageType('error');
      setMessage('Select a licence to reserve.');
      return;
    }

    const licence = freeLicences.find(l => l.id === parseInt(selectedLicence));
    if (!licence) return;

    setPendingLicence(licence);
    setShowModal(true);
  };

  const confirmReservation = () => {
    if (!pendingLicence || !username) return;

    const today = new Date().toISOString().slice(0, 10);

    fetch(`http://localhost:5001/api/licences/${pendingLicence.id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usage_date: today, assigned_trainer: username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessageType('error');
          setMessage(data.error);
        } else {
          const reserved = {
            ...pendingLicence,
            usage_date: today,
            assigned_trainer: username,
          };
          setReservedLicence(reserved);
          localStorage.setItem('reservedLicence', JSON.stringify(reserved));
          setMessageType('success');
          setMessage('Successfully reserved!');
          setSelectedLicence('');
          fetchFreeLicences();
        }
        setShowModal(false);
        setPendingLicence(null);
      })
      .catch(() => {
        setMessageType('error');
        setMessage('Error reserving licence.');
        setShowModal(false);
      });
  };

  return (
    <div className="day-licence-container">
      <h2>Reserve a licence for today!</h2>

      {message && (
        <p className={messageType === 'error' ? 'error-message' : 'success-message'}>
          {message}
        </p>
      )}

      <select
        value={selectedLicence}
        onChange={(e) => setSelectedLicence(e.target.value)}
      >
        <option value="">Choose a licence</option>
        {freeLicences.map((licence) => (
          <option key={licence.id} value={licence.id}>
            {licence.name} ({licence.type})
          </option>
        ))}
      </select>

      <button onClick={handleReserveClick}>Reserve</button>

      {reservedLicence && (
        <div className="licence-details-card">
          <h3>Reserved licence details</h3>
          <p><strong>Name:</strong> {reservedLicence.name}</p>
          <p><strong>Type:</strong> {reservedLicence.type}</p>
          <p><strong>Username:</strong> {reservedLicence.user}</p>
          <p><strong>Password:</strong> {reservedLicence.password}</p>
          <p><strong>Usage date:</strong> {reservedLicence.usage_date}</p>
          <p><strong>Assigned trainer:</strong> {reservedLicence.assigned_trainer}</p>
        </div>
      )}

      {showModal && pendingLicence && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm reservation</h3>
            <p>Do you want to reserve <strong>{pendingLicence.name}</strong> for today ({pendingLicence.type})?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmReservation}>Confirm</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationLicence;
