import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'; // Kalendar za odabir datuma
import 'react-datepicker/dist/react-datepicker.css'; // Stilovi za kalendar
import './Trainings.css'; // Stilovi za stranicu

const Trainings = () => {
  const [trainings, setTrainings] = useState([]); // State za pohranu treninga
  const [licences, setLicences] = useState([]); // State za pohranu licenci
  const [newTraining, setNewTraining] = useState({ title: '', description: '', date: new Date(), trainer: '', licence_id: '' }); // State za unos novog treninga
  const [editTraining, setEditTraining] = useState(null); // State za uređivanje treninga
  const [message, setMessage] = useState(''); // State za poruke
  const [isLoading, setIsLoading] = useState(false); // State za učitavanje
  const [searchTerm, setSearchTerm] = useState(''); // State za pretraživanje

  // Funkcija za formatiranje datuma u format YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mjeseci su 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Dohvaćanje podataka iz API-ja
  useEffect(() => {
    fetchTrainings();
    fetchLicences();
  }, []);

  const fetchTrainings = () => {
    setIsLoading(true); // Pokreni učitavanje
    fetch('http://localhost:5001/api/trainings')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setTrainings(data))
      .catch((error) => {
        console.error('Error fetching trainings:', error);
        setMessage('Failed to fetch trainings. Please try again.');
      })
      .finally(() => setIsLoading(false)); // Zaustavi učitavanje
  };

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
        setMessage('Failed to fetch licences. Please try again.');
      });
  };

  // Dodavanje novog treninga
  const addTraining = () => {
    if (!newTraining.title || !newTraining.description || !newTraining.trainer || !newTraining.licence_id) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true); // Pokreni učitavanje

    const licenceId = newTraining.licence_id || null; // Ako je licence_id prazan, postavi na NULL
    fetch('http://localhost:5001/api/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newTraining,
        date: formatDate(newTraining.date), // Koristi formatDate umjesto toISOString
        licence_id: licenceId, // Koristi licenceId umjesto newTraining.licence_id
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        setMessage('Training successfully added!');
        fetchTrainings(); // Ponovno dohvaćanje podataka
        setNewTraining({ title: '', description: '', date: new Date(), trainer: '', licence_id: '' }); // Resetiranje forme
      })
      .catch((error) => {
        setMessage('Failed to add training. Please try again.');
        console.error('Error adding training:', error);
      })
      .finally(() => setIsLoading(false)); // Zaustavi učitavanje
  };

  // Brisanje treninga
  const deleteTraining = (id) => {
    setIsLoading(true); // Pokreni učitavanje

    fetch(`http://localhost:5001/api/trainings/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMessage('Training successfully deleted!');
        fetchTrainings(); // Ponovno dohvaćanje podataka
      })
      .catch((error) => {
        setMessage('Failed to delete training. Please try again.');
        console.error('Error deleting training:', error);
      })
      .finally(() => setIsLoading(false)); // Zaustavi učitavanje
  };

  // Ažuriranje treninga
  const updateTraining = () => {
    if (!editTraining.title || !editTraining.description || !editTraining.trainer || !editTraining.licence_id) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true); // Pokreni učitavanje

    const licenceId = editTraining.licence_id || null; // Ako je licence_id prazan, postavi na NULL
    fetch(`http://localhost:5001/api/trainings/${editTraining.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...editTraining,
        date: formatDate(editTraining.date), // Koristi formatDate umjesto toISOString
        licence_id: licenceId, // Koristi licenceId umjesto editTraining.licence_id
      }),
    })
      .then(() => {
        setMessage('Training successfully updated!');
        fetchTrainings(); // Ponovno dohvaćanje podataka
        setEditTraining(null); // Zatvaranje forme za uređivanje
      })
      .catch((error) => {
        setMessage('Failed to update training. Please try again.');
        console.error('Error updating training:', error);
      })
      .finally(() => setIsLoading(false)); // Zaustavi učitavanje
  };

  // Filtriranje treninga po naslovu
  const filteredTrainings = trainings.filter((training) =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="trainings-container">
      <h1>Trainings</h1>

      {/* Prikaz poruka */}
      {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

      {/* Indikator učitavanja */}
      {isLoading && <div className="loading">Loading...</div>}

      {/* Forma za dodavanje novog treninga */}
      <div className="form-container">
        <h2>Add New Training</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTraining.title}
          onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTraining.description}
          onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
        />
        <DatePicker
          selected={newTraining.date}
          onChange={(date) => setNewTraining({ ...newTraining, date })}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
        />
        <input
          type="text"
          placeholder="Trainer"
          value={newTraining.trainer}
          onChange={(e) => setNewTraining({ ...newTraining, trainer: e.target.value })}
        />
        <select
          value={newTraining.licence_id}
          onChange={(e) => setNewTraining({ ...newTraining, licence_id: e.target.value })}
        >
          <option value="">Select Licence</option>
          {licences.map((licence) => (
            <option key={licence.id} value={licence.id}>
              {licence.name} (ID: {licence.id})
            </option>
          ))}
        </select>
        <button onClick={addTraining}>Add Training</button>
      </div>

      {/* Forma za uređivanje treninga */}
      {editTraining && (
        <div className="form-container">
          <h2>Edit Training</h2>
          <input
            type="text"
            placeholder="Title"
            value={editTraining.title}
            onChange={(e) => setEditTraining({ ...editTraining, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={editTraining.description}
            onChange={(e) => setEditTraining({ ...editTraining, description: e.target.value })}
          />
          <DatePicker
            selected={new Date(editTraining.date)}
            onChange={(date) => setEditTraining({ ...editTraining, date })}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
          />
          <input
            type="text"
            placeholder="Trainer"
            value={editTraining.trainer}
            onChange={(e) => setEditTraining({ ...editTraining, trainer: e.target.value })}
          />
          <select
            value={editTraining.licence_id}
            onChange={(e) => setEditTraining({ ...editTraining, licence_id: e.target.value })}
          >
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

      {/* Polje za pretraživanje */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tablica za prikaz treninga */}
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