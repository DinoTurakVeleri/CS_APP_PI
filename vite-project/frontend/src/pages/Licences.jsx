import React, { useState, useEffect } from 'react';
import './Licences.css';

const Licences = () => {
  const [licences, setLicences] = useState([]);
  const [newLicence, setNewLicence] = useState({ name: '', type: '', user: '', password: '' });
  const [editLicence, setEditLicence] = useState(null);
  const [error, setError] = useState('');

  // Dohvaćanje podataka iz API-ja
  useEffect(() => {
    fetchLicences();
  }, []);

  const fetchLicences = () => {
    fetch('http://localhost:5001/api/licences')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setLicences(data))
      .catch((error) => {
        console.error('Error fetching licences:', error);
        setError('Failed to fetch licences. Please try again.');
      });
  };

  // Dodavanje nove licence
  const addLicence = () => {
    fetch('http://localhost:5001/api/licences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLicence),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        fetchLicences();
        setNewLicence({ name: '', type: '', user: '', password: '' });
      })
      .catch((error) => {
        console.error('Error adding licence:', error);
        setError('Failed to add licence. Please try again.');
      });
  };

  // Brisanje licence
  const deleteLicence = (id) => {
    fetch(`http://localhost:5001/api/licences/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchLicences();
      })
      .catch((error) => {
        console.error('Error deleting licence:', error);
        setError('Failed to delete licence. Please try again.');
      });
  };

  // Ažuriranje licence
  const updateLicence = () => {
    fetch(`http://localhost:5001/api/licences/${editLicence.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editLicence),
    })
      .then(() => {
        fetchLicences();
        setEditLicence(null);
      })
      .catch((error) => {
        console.error('Error updating licence:', error);
        setError('Failed to update licence. Please try again.');
      });
  };

  return (
    <div className="licences-container">
      <h1>Licences</h1>

      {/* Prikaz grešaka */}
      {error && <div className="error-message">{error}</div>}

      {/* Forma za unos nove licence */}
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
          placeholder="User"
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

      {/* Forma za ažuriranje postojeće licence */}
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
            placeholder="User"
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

      {/* Tablica za prikaz licenci */}
      <table className="licences-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>User</th>
            <th>Password</th>
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