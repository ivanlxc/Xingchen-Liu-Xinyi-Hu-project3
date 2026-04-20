import { useEffect, useState } from 'react';
import { apiLeaderboard, errMessage } from '../api/client';
import './HighScores.css';

function rankClass(rank) {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return '';
}

function HighScores() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiLeaderboard();
        setRows(data);
      } catch (err) {
        setError(errMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="page-container">
      <h1 className="page-title">High Scores</h1>
      <p className="page-subtitle">Top Sudoku players, ranked by total wins.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading leaderboard…</div>
      ) : rows.length === 0 ? (
        <div className="empty-state">
          <strong>No wins recorded yet.</strong>
          Be the first to complete a puzzle!
        </div>
      ) : (
        <div className="scores-wrapper">
          <table className="scores-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const rank = idx + 1;
                return (
                  <tr key={row.userId}>
                    <td>
                      <span className={`rank-badge ${rankClass(rank)}`}>{rank}</span>
                    </td>
                    <td className="username">{row.username}</td>
                    <td>{row.wins}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default HighScores;
