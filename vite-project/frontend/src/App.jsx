import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import Header from './components/Header';
import Licences from './pages/Licences';
import Trainings from './pages/Trainings';
import Login from './pages/Login';
import Users from './pages/Users';
import TrainerDashboard from './pages/TrainerDashboard';
import ReservationLicence from './pages/ReservationLicence';
import ProtectedRoute from './components/ProtectedRoute'; 
import './App.css';

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
    localStorage.removeItem('username');
    localStorage.removeItem('token'); 
    localStorage.removeItem('role');  
    setIsLoggedIn(false);
  };

  if (!authChecked) return <div>Loading...</div>;

  const HomeContent = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    return (
      <div className="home-content" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="grid-container">
          {role === 'ADMIN' && (
            <>
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
            </>
          )}

          {role === 'USER' && (
            <>
              <div className="grid-item clickable" onClick={() => navigate('/trainer')}>
                <h2>TRAINER DASHBOARD</h2>
                <p>View calendar and assign licence for the day.</p>
              </div>
              <div className="grid-item clickable" onClick={() => navigate('/reservation')}>
                <h2>RESERVE LICENCE</h2>
                <p>Choose and reserve a free licence for today.</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const username = localStorage.getItem('username');

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

          {/* Trener rute */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute requiredRole="USER">
                <TrainerDashboard loggedInTrainer={username} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation"
            element={
              <ProtectedRoute requiredRole="USER">
                <ReservationLicence />
              </ProtectedRoute>
            }
          />

          {/* Admin rute */}
          <Route
            path="/licences"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Licences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Trainings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
