import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Board from '../components/Board';
import {
  apiGetGame,
  apiDeleteGame,
  apiRecordScore,
  errMessage,
} from '../api/client';
import { useAuth } from '../context/AuthContext';
import { checkViolations, checkComplete, findHint, cloneBoard } from '../utils/sudoku';
import './GamePage.css';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function GamePage() {
  const { gameId } = useParams();
  const { username } = useAuth();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [errors, setErrors] = useState([]);
  const [hintCell, setHintCell] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const recorded = useRef(false);

  const size = game?.size ?? 9;
  const isOwner = game && username && game.createdByUsername === username;
  const alreadyCompleted = !!game?.completed;
  const interactive = !!username && !alreadyCompleted && !isComplete;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await apiGetGame(gameId);
        if (cancelled) return;
        setGame(data);
        if (data.completed && data.solution) {
          setBoard(cloneBoard(data.solution));
          setErrors(
            Array.from({ length: data.size }, () => Array(data.size).fill(false))
          );
          setTimer(data.durationSeconds || 0);
          setIsComplete(true);
        } else {
          const initial = cloneBoard(data.initialBoard);
          setBoard(initial);
          setErrors(
            Array.from({ length: data.size }, () => Array(data.size).fill(false))
          );
          setTimer(0);
          setIsComplete(false);
        }
      } catch (err) {
        if (!cancelled) setError(errMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [gameId]);

  useEffect(() => {
    if (!interactive) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [interactive]);

  useEffect(() => {
    if (!isComplete || !username || !game || alreadyCompleted || recorded.current) return;
    recorded.current = true;
    (async () => {
      try {
        await apiRecordScore(game.id, timer);
      } catch (err) {
        setNotice(errMessage(err));
      }
    })();
  }, [isComplete, username, game, alreadyCompleted, timer]);

  const handleCellChange = (row, col, value) => {
    if (!interactive) return;
    setHintCell(null);
    setBoard((prev) => {
      if (prev[row][col] === value) return prev;
      if (game.initialBoard[row][col] !== 0) return prev;
      const next = cloneBoard(prev);
      next[row][col] = value;
      const newErrors = checkViolations(next, size);
      setErrors(newErrors);
      if (checkComplete(next, newErrors, size)) {
        setIsComplete(true);
      }
      return next;
    });
  };

  const handleReset = () => {
    if (!game || alreadyCompleted) return;
    setBoard(cloneBoard(game.initialBoard));
    setErrors(Array.from({ length: size }, () => Array(size).fill(false)));
    setTimer(0);
    setIsComplete(false);
    setHintCell(null);
    recorded.current = false;
    setNotice('');
  };

  const handleHint = () => {
    if (!interactive) return;
    const hint = findHint(board, game.initialBoard, size);
    if (!hint) {
      setNotice('No forced moves available right now.');
      return;
    }
    setHintCell({ row: hint.row, col: hint.col });
    handleCellChange(hint.row, hint.col, hint.value);
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    const confirmed = window.confirm(
      `Delete "${game.name}"? This will also remove it from everyone's high scores.`
    );
    if (!confirmed) return;
    try {
      await apiDeleteGame(game.id);
      navigate('/games');
    } catch (err) {
      setError(errMessage(err));
    }
  };

  const title = useMemo(() => {
    if (!game) return 'Game';
    return game.name;
  }, [game]);

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">Loading puzzle…</div>
      </main>
    );
  }

  if (error && !game) {
    return (
      <main className="page-container">
        <div className="alert alert-error">{error}</div>
        <Link to="/games" className="btn btn-outline">Back to games</Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">
        {game.difficulty} · {game.size}×{game.size} · by {game.createdByUsername}
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-info">{notice}</div>}
      {!username && (
        <div className="login-required">
          <Link to="/login">Log in</Link> to play and save your score.
        </div>
      )}
      {username && alreadyCompleted && (
        <div className="alert alert-success">
          You already completed this puzzle in {formatTime(game.durationSeconds || 0)}. The solution is shown below.
        </div>
      )}

      <div className="game-header">
        <div className="game-info-bar">
          <span className="difficulty-label">
            Difficulty:{' '}
            <span className={`difficulty-value ${game.difficulty === 'EASY' ? 'easy' : ''}`}>
              {game.difficulty}
            </span>
          </span>
        </div>
        <div className="timer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={game.difficulty === 'EASY' ? 'var(--success)' : 'var(--accent)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span className="timer-display">{formatTime(timer)}</span>
        </div>
      </div>

      {isComplete && !alreadyCompleted && (
        <div className="congrats-message">
          Congratulations! You solved the puzzle in {formatTime(timer)}!
        </div>
      )}

      <Board
        board={board}
        initialBoard={game.initialBoard}
        errors={errors}
        size={size}
        isComplete={isComplete || alreadyCompleted}
        hintCell={hintCell}
        disabled={!interactive}
        onCellChange={handleCellChange}
      />

      <div className="game-controls">
        <div className="game-actions">
          {!alreadyCompleted && (
            <button className="btn btn-outline" onClick={handleReset}>
              Reset
            </button>
          )}
          {interactive && (
            <button className="btn btn-accent" onClick={handleHint}>
              Hint
            </button>
          )}
          {isOwner && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default GamePage;
