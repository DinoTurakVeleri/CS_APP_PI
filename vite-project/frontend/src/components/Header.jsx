import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, onLogout }) => { // Dodajemo `isLoggedIn` i `onLogout` kao props
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State za otvaranje/zatvaranje izbornika
  const menuRef = useRef(null); // Referenca za izbornik

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Promijeni stanje izbornika
  };

  // Zatvori izbornik kada se klikne izvan njega
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

  // Funkcija za zatvaranje izbornika i navigaciju
  const handleNavigation = (path) => {
    setIsMenuOpen(false); // Zatvori izbornik
    navigate(path); // Navigiraj na odabranu rutu
  };

  // Funkcija za odjavu
  const handleLogout = () => {
    onLogout(); // Pozivamo `onLogout` funkciju iz propsa
    navigate('/login'); // Preusmjeravamo korisnika na login stranicu
  };

  return (
    <header className="header">
      <div className="header-content">
        <button className="hamburger" onClick={toggleMenu}>
          ☰ {/* Hamburger ikona */}
        </button>
        <h1>Consultancy & Support Department</h1>
      </div>

      {/* Padajući izbornik */}
      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul>
          <li>
            <button onClick={() => handleNavigation('/')}>Home</button>
          </li>
          <li>
            <button onClick={() => handleNavigation('/licences')}>Licences</button>
          </li>
          <li>
            <button onClick={() => handleNavigation('/trainings')}>Trainings</button>
          </li>
          {/* Dodajemo Logout dugme samo ako je korisnik prijavljen */}
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