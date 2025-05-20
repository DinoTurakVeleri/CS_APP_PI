import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Licences from './pages/Licences';
import Trainings from './pages/Trainings';
import Login from './pages/Login';
import './App.css';
import Users from './pages/Users';
import TrainerDashboard from './pages/TrainerDashboard'; // ✅ NOVO

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
    setAuthChecked(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username'); // brišemo i username
    setIsLoggedIn(false);
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  const HomeContent = () => {
    const navigate = useNavigate();

    return (
      <div className="home-content">
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
          <div className="grid-item clickable" onClick={() => navigate('/trainer')}> {}
            <h2>TRAINER DASHBOARD</h2>
            <p>View calendar and assign licence for the day.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/"
            element={isLoggedIn ? <HomeContent /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer"
            element={
              isLoggedIn
                ? <TrainerDashboard loggedInTrainer={localStorage.getItem('username')} />
                : <Navigate to="/login" />
            }
          />
          <Route path="/licences" element={isLoggedIn ? <Licences /> : <Navigate to="/login" />} />
          <Route path="/trainings" element={isLoggedIn ? <Trainings /> : <Navigate to="/login" />} />
          <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
