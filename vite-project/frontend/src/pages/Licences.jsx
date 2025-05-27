import React, { useState, useEffect } from 'react';
import './Licences.css';

const Licences = () => {
  const [licences, setLicences] = useState([]);
  const [newLicence, setNewLicence] = useState({ name: '', type: '', user: '', password: '' });
  const [editLicence, setEditLicence] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLicences();
  }, []);

  const fetchLicences = () => {
    fetch('http://localhost:5001/api/licences')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setLicences(data))
      .catch(() => {
        setMessage('Failed to fetch licences. Please try again.');
      });
  };

  const addLicence = () => {
    const { name, type, user, password } = newLicence;

    if (!name || !type || !user || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    fetch('http://localhost:5001/api/licences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLicence),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(() => {
        fetchLicences();
        setNewLicence({ name: '', type: '', user: '', password: '' });
        setMessage('Licence successfully added!');
      })
      .catch(() => {
        setMessage('Failed to add licence. Please try again.');
      });
  };

  const deleteLicence = (id) => {
    fetch(`http://localhost:5001/api/licences/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchLicences();
        setMessage('Licence successfully deleted!');
      })
      .catch(() => {
        setMessage('Failed to delete licence. Please try again.');
      });
  };

  const updateLicence = () => {
    const { name, type, user, password } = editLicence;

    if (!name || !type || !user || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    fetch(`http://localhost:5001/api/licences/${editLicence.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editLicence),
    })
      .then(() => {
        fetchLicences();
        setEditLicence(null);
        setMessage('Licence successfully updated!');
      })
      .catch(() => {
        setMessage('Failed to update licence. Please try again.');
      });
  };

  return (
    <div className="licences-container">
      <h1>Licences</h1>

      {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

      {/* Form: Add Licence */}
      <div className="form-container">
        <h2>Add New Licence</h2>
        <input
          type="text"
          placeholder="Name"
          value={newLicence.name}
          onChange={(e) => setNewLicence({ ...newLicence, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          value={newLicence.type}
          onChange={(e) => setNewLicence({ ...newLicence, type: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          value={newLicence.user}
          onChange={(e) => setNewLicence({ ...newLicence, user: e.target.value })}
        />
        <input
          type="text"
          placeholder="Password"
          value={newLicence.password}
          onChange={(e) => setNewLicence({ ...newLicence, password: e.target.value })}
        />
        <button onClick={addLicence}>Add Licence</button>
      </div>

      {/* Form: Edit Licence */}
      {editLicence && (
        <div className="form-container">
          <h2>Edit Licence</h2>
          <input
            type="text"
            placeholder="Name"
            value={editLicence.name}
            onChange={(e) => setEditLicence({ ...editLicence, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Type"
            value={editLicence.type}
            onChange={(e) => setEditLicence({ ...editLicence, type: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            value={editLicence.user}
            onChange={(e) => setEditLicence({ ...editLicence, user: e.target.value })}
          />
          <input
            type="text"
            placeholder="Password"
            value={editLicence.password}
            onChange={(e) => setEditLicence({ ...editLicence, password: e.target.value })}
          />
          <button onClick={updateLicence}>Update Licence</button>
          <button onClick={() => setEditLicence(null)}>Cancel</button>
        </div>
      )}

      {/* Table: All Licences */}
      <table className="licences-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Username</th>
            <th>Password</th>
            <th>Assigned Trainer</th>
            <th>Usage Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {licences.map((licence) => (
            <tr key={licence.id}>
              <td>{licence.name}</td>
              <td>{licence.type}</td>
              <td>{licence.user}</td>
              <td>{licence.password}</td>
              <td>{licence.assigned_trainer || '-'}</td>
              <td>{licence.usage_date ? new Date(licence.usage_date).toLocaleDateString('hr-HR') : '-'}</td>
              <td>
                <button onClick={() => setEditLicence(licence)}>Edit</button>
                <button onClick={() => deleteLicence(licence.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Licences;
