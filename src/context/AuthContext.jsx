import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiIsLoggedIn, apiLogin, apiLogout, apiRegister } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiIsLoggedIn();
      setUsername(data.loggedIn ? data.username : null);
    } catch {
      setUsername(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const login = async (u, p) => {
    const data = await apiLogin(u, p);
    setUsername(data.username);
    return data;
  };

  const register = async (u, p) => {
    const data = await apiRegister(u, p);
    setUsername(data.username);
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
