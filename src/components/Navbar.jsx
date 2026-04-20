import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { username, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = async () => {
    closeMenu();
    try {
      await logout();
      navigate('/');
    } catch {
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" onClick={closeMenu}>
        <svg
          className="nav-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
        </svg>
        <span>Sudoku Master</span>
      </Link>
      <button
        className={`nav-toggle-label ${menuOpen ? 'nav-open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span className="hamburger-line"></span>
      </button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link>
        <Link to="/games" className={isActive('/games')} onClick={closeMenu}>Games</Link>
        <Link to="/rules" className={isActive('/rules')} onClick={closeMenu}>Rules</Link>
        <Link to="/scores" className={isActive('/scores')} onClick={closeMenu}>Scores</Link>
        {username ? (
          <>
            <span className="nav-user" title="You are signed in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {username}
            </span>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')} onClick={closeMenu}>Login</Link>
            <Link to="/register" className={isActive('/register')} onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
