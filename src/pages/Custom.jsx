import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import { apiCreateCustomGame, errMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { checkViolations, emptyBoard, cloneBoard } from '../utils/sudoku';
import './Custom.css';

function Custom() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [board, setBoard] = useState(() => emptyBoard(9));
  const [errors, setErrors] = useState(() =>
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const hasErrors = errors.some((row) => row.some(Boolean));
  const hasAnyCell = board.some((row) => row.some((v) => v !== 0));

  const handleCellChange = (row, col, value) => {
    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = value;
      setErrors(checkViolations(next, 9));
      return next;
    });
    setFeedback(null);
  };

  const handleClear = () => {
    setBoard(emptyBoard(9));
    setErrors(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (!username || submitting) return;
    if (hasErrors) {
      setFeedback({ kind: 'error', msg: 'Fix the highlighted conflicts first.' });
      return;
    }
    if (!hasAnyCell) {
      setFeedback({ kind: 'error', msg: 'Add some clues before submitting.' });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      const { id } = await apiCreateCustomGame(board);
      navigate(`/game/${id}`);
    } catch (err) {
      setFeedback({ kind: 'error', msg: errMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <h1 className="page-title">Create a Custom Puzzle</h1>
      <p className="page-subtitle">
        Fill in the clues for a 9×9 grid, then submit. The server will verify it has
        exactly one valid solution before publishing the game.
      </p>

      {!username && (
        <div className="login-required">
          <Link to="/login">Log in</Link> to submit a custom puzzle.
        </div>
      )}

      {feedback && (
        <div className={`alert alert-${feedback.kind === 'error' ? 'error' : 'info'}`}>
          {feedback.msg}
        </div>
      )}

      <Board
        board={board}
        initialBoard={emptyBoard(9)}
        errors={errors}
        size={9}
        isComplete={false}
        hintCell={null}
        disabled={!username}
        onCellChange={handleCellChange}
      />

      <div className="custom-controls">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleClear}
          disabled={submitting}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!username || hasErrors || !hasAnyCell || submitting}
        >
          {submitting ? 'Verifying…' : 'Submit'}
        </button>
      </div>

      <p className="custom-hint">
        Tip: classic puzzles need at least 17 clues to have a unique solution.
      </p>
    </main>
  );
}

export default Custom;
