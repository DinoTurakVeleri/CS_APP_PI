import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Licences from './pages/Licences';
import Trainings from './pages/Trainings';
import Login from './pages/Login'; // Uvozimo Login komponentu
import './App.css';
import Users from './pages/Users';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Provjera autentikacije

  // Provjera da li je korisnik prijavljen
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
    setAuthChecked(true); // Signal da je provjera završena
  }, []);

  // Funkcija za odjavu
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // Ako autentikacija još nije provjerena, ne prikazuj ništa (ili loader)
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  const HomeContent = () => {
    const navigate = useNavigate();

    return (
      <div className="home-content">
        {/* Grid sekcija za Treninge i Licence */}
        <div className="grid-container enlarged">
          <div className="grid-item clickable" onClick={() => navigate('/trainings')}>
            <h2>TRAININGS</h2>
            <p>View your trainings, and select upcoming ones.</p>
          </div>
          <div className="grid-item clickable" onClick={() => navigate('/licences')}>
            <h2>LICENCES</h2>
            <p>View and manage licences.</p>
          </div>
          <div className="grid-item clickable" onClick={() => navigate('/users')}>
            <h2>USERS</h2>
            <p>Manage platform users.</p>
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
          {/* Stranica za korisnike */}
          <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
