import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { username } = useAuth();

  return (
    <main className="page-container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Sudoku <span className="highlight">Master</span>
          </h1>
          <p className="hero-description">
            {username
              ? `Welcome back, ${username}! Jump back in or try a new puzzle.`
              : 'Test your logic skills with Sudoku puzzles. Pick a difficulty level and see how fast you can solve it!'}
          </p>
          <div className="hero-buttons">
            <Link to="/games" className="btn btn-primary">Play Now</Link>
            <Link to="/rules" className="btn btn-outline">Learn Rules</Link>
          </div>
        </div>
        <div className="hero-image">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="280" height="280">
            <rect x="10" y="10" width="180" height="180" rx="10" fill="#f5f6fa" stroke="#1e272e" strokeWidth="3" />
            <line x1="70" y1="10" x2="70" y2="190" stroke="#1e272e" strokeWidth="2" />
            <line x1="130" y1="10" x2="130" y2="190" stroke="#1e272e" strokeWidth="2" />
            <line x1="10" y1="70" x2="190" y2="70" stroke="#1e272e" strokeWidth="2" />
            <line x1="10" y1="130" x2="190" y2="130" stroke="#1e272e" strokeWidth="2" />
            <text x="40" y="50" textAnchor="middle" fontSize="24" fill="#0984e3" fontWeight="bold">5</text>
            <text x="100" y="50" textAnchor="middle" fontSize="24" fill="#2d3436" fontWeight="bold">3</text>
            <text x="160" y="50" textAnchor="middle" fontSize="24" fill="#0984e3" fontWeight="bold">7</text>
            <text x="40" y="110" textAnchor="middle" fontSize="24" fill="#2d3436" fontWeight="bold">6</text>
            <text x="100" y="110" textAnchor="middle" fontSize="24" fill="#0984e3" fontWeight="bold">9</text>
            <text x="160" y="110" textAnchor="middle" fontSize="24" fill="#2d3436" fontWeight="bold">2</text>
            <text x="40" y="170" textAnchor="middle" fontSize="24" fill="#0984e3" fontWeight="bold">1</text>
            <text x="100" y="170" textAnchor="middle" fontSize="24" fill="#2d3436" fontWeight="bold">8</text>
            <text x="160" y="170" textAnchor="middle" fontSize="24" fill="#0984e3" fontWeight="bold">4</text>
          </svg>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Play Sudoku Master?</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>Multiple Difficulties</h3>
            <p>Choose easy 6x6 grids, standard 9x9 puzzles, or build your own.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
            <h3>Timed Challenges</h3>
            <p>Every puzzle is timed so you can beat your best time.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Live Leaderboard</h3>
            <p>See how you stack up against every other player in real time.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
