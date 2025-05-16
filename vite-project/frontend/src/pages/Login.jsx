import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/pages/login.css';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Funkcija za registraciju
  const handleRegister = async (e) => {
    e.preventDefault();

    // Provjera da li su polja popunjena
    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Provjera da li se lozinke podudaraju
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Provjera minimalne duljine lozinke
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Slanje podataka na backend API za registraciju
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Ako je registracija uspješna, prikaži poruku i prebaci na prijavu
      setError('Registration successful! You can now log in.');
      setIsRegistering(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Funkcija za prijavu
  const handleLogin = async (e) => {
    e.preventDefault();

    // Provjera da li su polja popunjena
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Slanje podataka na backend API za prijavu
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Ako je prijava uspješna, postavi stanje prijave i preusmjeri na početnu stranicu
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Log-in'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegistering && (
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit" className="submit-button">
          {isRegistering ? 'Register' : 'Log in'}
        </button>
      </form>
      <p className="toggle-text">
        {isRegistering ? (
          <span>
            Already have an account?{' '}
            <button className="toggle-button" onClick={() => setIsRegistering(false)}>
              Log in here
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{' '}
            <button className="toggle-button" onClick={() => setIsRegistering(true)}>
              Register here
            </button>
          </span>
        )}
      </p>
    </div>
  );
}

export default Login;