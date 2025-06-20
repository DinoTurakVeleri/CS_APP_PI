import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Trainings.css';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [licences, setLicences] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTraining, setNewTraining] = useState({ title: '', description: '', date: new Date(), trainer: '', licence_id: '' });
  const [editTraining, setEditTraining] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return !isNaN(d) ? d.toISOString().split('T')[0] : '';
  };

  useEffect(() => {
    fetchTrainings();
    fetchLicences();
    fetchUsers();
  }, []);

  const fetchTrainings = () => {
    setIsLoading(true);
    fetch('/api/trainings', { headers: authHeaders })
      .then(res => res.json())
      .then(setTrainings)
      .catch(() => setMessage('Failed to fetch trainings. Please try again.'))
      .finally(() => setIsLoading(false));
  };

  const fetchLicences = () => {
    fetch('/api/licences', { headers: authHeaders })
      .then(res => res.json())
      .then(setLicences)
      .catch(() => setMessage('Failed to fetch licences. Please try again.'));
  };

  const fetchUsers = () => {
    fetch('/api/users', { headers: authHeaders })
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setMessage('Failed to load users.'));
  };

  const usedLicenceIds = trainings.map(t => t.licence_id).filter(Boolean);

  const addTraining = () => {
    if (!newTraining.title || !newTraining.description || !newTraining.licence_id) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    fetch('/api/trainings', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        ...newTraining,
        date: formatDate(newTraining.date),
        licence_id: newTraining.licence_id || null,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setMessage('Training successfully added!');
        fetchTrainings();
        setNewTraining({ title: '', description: '', date: new Date(), trainer: '', licence_id: '' });
      })
      .catch(() => setMessage('Failed to add training. Please try again.'))
      .finally(() => setIsLoading(false));
  };

  const deleteTraining = (id) => {
    setIsLoading(true);
    fetch(`/api/trainings/${id}`, {
      method: 'DELETE',
      headers: authHeaders
    })
      .then(() => {
        setMessage('Training successfully deleted!');
        fetchTrainings();
      })
      .catch(() => setMessage('Failed to delete training. Please try again.'))
      .finally(() => setIsLoading(false));
  };

  const updateTraining = () => {
    if (!editTraining.title || !editTraining.description || !editTraining.licence_id) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    fetch(`/api/trainings/${editTraining.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        ...editTraining,
        date: formatDate(editTraining.date),
        licence_id: editTraining.licence_id || null,
      }),
    })
      .then(() => {
        setMessage('Training successfully updated!');
        fetchTrainings();
        setEditTraining(null);
      })
      .catch(() => setMessage('Failed to update training. Please try again.'))
      .finally(() => setIsLoading(false));
  };

  const filteredTrainings = trainings.filter((training) =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCustomHeader = ({ date, decreaseMonth, increaseMonth }) => (
    <div className="custom-datepicker-header">
      <button onClick={decreaseMonth}>{'<'}</button>
      <span>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</span>
      <button onClick={increaseMonth}>{'>'}</button>
    </div>
  );

  return (
    <div className="trainings-container">
      <h1>Trainings</h1>

      {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}
      {isLoading && <div className="loading">Loading...</div>}

      <div className="form-container">
        <h2>Add New Training</h2>
        <input type="text" placeholder="Title" value={newTraining.title} onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })} />
        <input type="text" placeholder="Description" value={newTraining.description} onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })} />
        <DatePicker
          selected={newTraining.date}
          onChange={(date) => setNewTraining({ ...newTraining, date })}
          dateFormat="yyyy-MM-dd"
          renderCustomHeader={renderCustomHeader}
        />
        <select value={newTraining.trainer} onChange={(e) => setNewTraining({ ...newTraining, trainer: e.target.value })}>
          <option value="">Select Trainer</option>
          {users.map(user => (
            <option key={user.id || user.username} value={user.name}>{user.name}</option>
          ))}
        </select>
        <select value={newTraining.licence_id} onChange={(e) => setNewTraining({ ...newTraining, licence_id: e.target.value })}>
          <option value="">Select Licence</option>
          {licences.filter(lic => !usedLicenceIds.includes(lic.id)).map(licence => (
            <option key={licence.id} value={licence.id}>{licence.name} (ID: {licence.id})</option>
          ))}
        </select>
        <button onClick={addTraining}>Add Training</button>
      </div>

      {editTraining && (
        <div className="form-container">
          <h2>Edit Training</h2>
          <input type="text" value={editTraining.title} onChange={(e) => setEditTraining({ ...editTraining, title: e.target.value })} />
          <input type="text" value={editTraining.description} onChange={(e) => setEditTraining({ ...editTraining, description: e.target.value })} />
          <DatePicker
            selected={editTraining.date ? new Date(editTraining.date) : null}
            onChange={(date) => setEditTraining({ ...editTraining, date })}
            dateFormat="yyyy-MM-dd"
            renderCustomHeader={renderCustomHeader}
          />
          <select value={editTraining.trainer} onChange={(e) => setEditTraining({ ...editTraining, trainer: e.target.value })}>
            <option value="">Select Trainer</option>
            {users.map(user => (
              <option key={user.id || user.username} value={user.name}>{user.name}</option>
            ))}
          </select>
          <select value={editTraining.licence_id} onChange={(e) => setEditTraining({ ...editTraining, licence_id: e.target.value })}>
            <option value="">Select Licence</option>
            {licences.filter(lic => !usedLicenceIds.includes(lic.id) || lic.id === editTraining.licence_id).map(licence => (
              <option key={licence.id} value={licence.id}>{licence.name} (ID: {licence.id})</option>
            ))}
          </select>
          <button onClick={updateTraining}>Update Training</button>
          <button onClick={() => setEditTraining(null)}>Cancel</button>
        </div>
      )}

      <div className="search-container">
        <input type="text" placeholder="Search by title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <table className="trainings-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Trainer</th>
            <th>Licence ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrainings.map((training) => (
            <tr key={training.id}>
              <td>{training.title}</td>
              <td>{training.description}</td>
              <td>{new Date(training.date).toLocaleDateString()}</td>
              <td>{training.trainer}</td>
              <td>{training.licence_id}</td>
              <td>
                <button onClick={() => setEditTraining(training)}>Edit</button>
                <button onClick={() => deleteTraining(training.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trainings;
