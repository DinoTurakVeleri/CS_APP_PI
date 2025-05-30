import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const role = localStorage.getItem('role'); // Dohvati rolu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <h1>Consultancy & Support Department</h1>
      </div>

      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul>
          <li>
            <button onClick={() => handleNavigation('/')}>Home</button>
          </li>

          {/* ADMIN opcije */}
          {isLoggedIn && role === 'ADMIN' && (
            <>
              <li>
                <button onClick={() => handleNavigation('/licences')}>Licences</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/trainings')}>Trainings</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/users')}>Users</button>
              </li>
            </>
          )}

          {/* USER opcije */}
          {isLoggedIn && role === 'USER' && (
            <>
              <li>
                <button onClick={() => handleNavigation('/trainer')}>Trainer Dashboard</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/reservation')}>Reserve Licence</button>
              </li>
            </>
          )}

          {/* Logout uvijek za prijavljene */}
          {isLoggedIn && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
