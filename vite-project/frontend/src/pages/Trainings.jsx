import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Trainings.css';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [licences, setLicences] = useState([]);
  const [newTraining, setNewTraining] = useState({ title: '', description: '', date: new Date(), trainer: '', licence_id: '' });
  const [editTraining, setEditTraining] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchTrainings();
    fetchLicences();
  }, []);

  const fetchTrainings = () => {
    setIsLoading(true);
    fetch('http://localhost:5001/api/trainings')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setTrainings(data))
      .catch((error) => {
        console.error('Error fetching trainings:', error);
        setMessage('Failed to fetch trainings. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const fetchLicences = () => {
    fetch('http://localhost:5001/api/licences')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setLicences(data))
      .catch((error) => {
        console.error('Error fetching licences:', error);
        setMessage('Failed to fetch licences. Please try again.');
      });
  };

  const addTraining = () => {
    if (!newTraining.title || !newTraining.description || !newTraining.trainer || !newTraining.licence_id) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    const licenceId = newTraining.licence_id || null;
    fetch('http://localhost:5001/api/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newTraining,
        date: formatDate(newTraining.date),
        licence_id: licenceId,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(() => {
        setMessage('Training successfully added!');
        fetchTrainings();
        setNewTraining({ title: '', description: '', date: new Date(), trainer: '', licence_id: '' });
      })
      .catch((error) => {
        setMessage('Failed to add training. Please try again.');
        console.error('Error adding training:', error);
      })
      .finally(() => setIsLoading(false));
  };

  const deleteTraining = (id) => {
    setIsLoading(true);
    fetch(`http://localhost:5001/api/trainings/${id}`, { method: 'DELETE' })
      .then(() => {
        setMessage('Training successfully deleted!');
        fetchTrainings();
      })
      .catch((error) => {
        setMessage('Failed to delete training. Please try again.');
        console.error('Error deleting training:', error);
      })
      .finally(() => setIsLoading(false));
  };

  const updateTraining = () => {
    if (!editTraining.title || !editTraining.description || !editTraining.trainer || !editTraining.licence_id) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    const licenceId = editTraining.licence_id || null;
    fetch(`http://localhost:5001/api/trainings/${editTraining.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editTraining,
        date: formatDate(editTraining.date),
        licence_id: licenceId,
      }),
    })
      .then(() => {
        setMessage('Training successfully updated!');
        fetchTrainings();
        setEditTraining(null);
      })
      .catch((error) => {
        setMessage('Failed to update training. Please try again.');
        console.error('Error updating training:', error);
      })
      .finally(() => setIsLoading(false));
  };

  const filteredTrainings = trainings.filter((training) =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholderText="Select date"
          renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
            <div className="custom-datepicker-header">
              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>‹</button>
              <span>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</span>
              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>›</button>
            </div>
          )}
        />
        <input type="text" placeholder="Trainer" value={newTraining.trainer} onChange={(e) => setNewTraining({ ...newTraining, trainer: e.target.value })} />
        <select value={newTraining.licence_id} onChange={(e) => setNewTraining({ ...newTraining, licence_id: e.target.value })}>
          <option value="">Select Licence</option>
          {licences.map((licence) => (
            <option key={licence.id} value={licence.id}>
              {licence.name} (ID: {licence.id})
            </option>
          ))}
        </select>
        <button onClick={addTraining}>Add Training</button>
      </div>

      {editTraining && (
        <div className="form-container">
          <h2>Edit Training</h2>
          <input type="text" placeholder="Title" value={editTraining.title} onChange={(e) => setEditTraining({ ...editTraining, title: e.target.value })} />
          <input type="text" placeholder="Description" value={editTraining.description} onChange={(e) => setEditTraining({ ...editTraining, description: e.target.value })} />
          <DatePicker
            selected={editTraining.date ? new Date(editTraining.date) : null}
            onChange={(date) => setEditTraining({ ...editTraining, date })}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
          />
          <input type="text" placeholder="Trainer" value={editTraining.trainer} onChange={(e) => setEditTraining({ ...editTraining, trainer: e.target.value })} />
          <select value={editTraining.licence_id} onChange={(e) => setEditTraining({ ...editTraining, licence_id: e.target.value })}>
            <option value="">Select Licence</option>
            {licences.map((licence) => (
              <option key={licence.id} value={licence.id}>
                {licence.name} (ID: {licence.id})
              </option>
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
