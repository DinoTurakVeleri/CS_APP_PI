import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Licences from './pages/Licences';
import Trainings from './pages/Trainings';
import Login from './pages/Login'; // Uvozimo Login komponentu
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Provjera da li je korisnik prijavljen (npr. iz localStorage ili sessionStorage)
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Funkcija za odjavu
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const HomeContent = () => {
    const navigate = useNavigate();

    return (
      <div className="home-content">
        {/* Grid sekcija za Treninge i Licence */}
        <div className="grid-container enlarged">
          <div className="grid-item clickable" onClick={() => navigate('/trainings')}>
            <h2>Treninzi</h2>
            <p>Pregledaj dostupne edukacije i planiraj svoj napredak.</p>
          </div>
          <div className="grid-item clickable" onClick={() => navigate('/licences')}>
            <h2>Licence</h2>
            <p>Upravljaj svojim licencama i provjeri status certifikata.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="App">
        {/* Prosljeđujemo `isLoggedIn` i `onLogout` u Header */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          {/* Log-in i registracijska stranica */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          {/* Glavna stranica */}
          <Route
            path="/"
            element={isLoggedIn ? <HomeContent /> : <Navigate to="/login" />}
          />
          {/* Stranica za licence */}
          <Route path="/licences" element={isLoggedIn ? <Licences /> : <Navigate to="/login" />} />
          {/* Stranica za treninge */}
          <Route path="/trainings" element={isLoggedIn ? <Trainings /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
