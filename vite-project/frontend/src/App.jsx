import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
            element={
              isLoggedIn ? (
                <div className="home-content">
                  <h1>Welcome to the Home Page</h1>
                  <p>This is the home page of your application.</p>
                  
                  <div className="grid-container">
                    <div className="grid-item">
                      <h2>Section 1</h2>
                      <p>Content for section 1 goes here. You can add more text, images, or other elements.</p>
                    </div>
                    <div className="grid-item">
                      <h2>Section 2</h2>
                      <p>Content for section 2 goes here. You can add more text, images, or other elements.</p>
                    </div>
                  </div>

                  <div className="table-container">
                    <h2>Sample Table</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>John Doe</td>
                          <td>Admin</td>
                          <td>Active</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Jane Smith</td>
                          <td>User</td>
                          <td>Inactive</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>James Miller</td>
                          <td>Editor</td>
                          <td>Active</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
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