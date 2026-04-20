import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiListGames, apiCreateGame, errMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Selection.css';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function badgeClass(difficulty) {
  if (difficulty === 'EASY') return 'easy';
  if (difficulty === 'CUSTOM') return 'hard';
  return 'medium';
}

function Selection() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(null);

  const loadGames = async () => {
    setError('');
    try {
      const data = await apiListGames();
      setGames(data);
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleCreate = async (difficulty) => {
    if (!username) return;
    setCreating(difficulty);
    setError('');
    try {
      const { id } = await apiCreateGame(difficulty);
      navigate(`/game/${id}`);
    } catch (err) {
      setError(errMessage(err));
      setCreating(null);
    }
  };

  return (
    <main className="page-container">
      <h1 className="page-title">Select a Game</h1>
      <p className="page-subtitle">Create a new puzzle, or pick one from the list.</p>

      {!username && (
        <div className="login-required">
          You are browsing as a guest. <Link to="/login">Log in</Link> or{' '}
          <Link to="/register">register</Link> to create and play games.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="create-bar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleCreate('NORMAL')}
          disabled={!username || creating !== null}
        >
          {creating === 'NORMAL' ? 'Creating…' : 'Create Normal Game'}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => handleCreate('EASY')}
          disabled={!username || creating !== null}
        >
          {creating === 'EASY' ? 'Creating…' : 'Create Easy Game'}
        </button>
        <Link
          to="/custom"
          className={`btn btn-accent ${!username ? 'btn-disabled' : ''}`}
          onClick={(e) => { if (!username) e.preventDefault(); }}
          aria-disabled={!username}
        >
          Create Custom Game
        </Link>
      </div>

      {loading ? (
        <div className="loading-state">Loading games…</div>
      ) : games.length === 0 ? (
        <div className="empty-state">
          <strong>No games yet.</strong>
          Be the first to create one!
        </div>
      ) : (
        <div className="game-list">
          {games.map((g) => (
            <Link to={`/game/${g.id}`} key={g.id} className="game-card card">
              <div className="game-info">
                <h2 className="game-name">{g.name}</h2>
                <p className="game-author">
                  by <span className="author-name">{g.createdByUsername}</span> ·{' '}
                  {formatDate(g.createdAt)}
                </p>
              </div>
              <div className="game-meta">
                <span className={`difficulty-badge ${badgeClass(g.difficulty)}`}>
                  {g.difficulty} {g.size}x{g.size}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default Selection;
