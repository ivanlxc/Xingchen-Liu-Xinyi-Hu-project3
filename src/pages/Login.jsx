import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMessage } from '../api/client';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const disabled = !username.trim() || !password || submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;
    setError('');
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate('/games');
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <div className="auth-wrapper">
        <div className="auth-card card">
          <div className="auth-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          {error && <div className="alert alert-error">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={disabled}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
