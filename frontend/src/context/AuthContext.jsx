import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AUTH_TOKEN_KEY,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('veloop:unauthorized', handleUnauthorized);

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setInitializing(false);
      return () => window.removeEventListener('veloop:unauthorized', handleUnauthorized);
    }

    getCurrentUser()
      .then((response) => setUser(response.user))
      .catch(() => clearSession())
      .finally(() => setInitializing(false));

    return () => window.removeEventListener('veloop:unauthorized', handleUnauthorized);
  }, [clearSession]);

  const signIn = useCallback(async (email, password) => {
    const response = await loginRequest(email, password);
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const signUp = useCallback(async (email, displayName, password) => {
    const response = await registerRequest(email, displayName, password);
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (localStorage.getItem(AUTH_TOKEN_KEY)) await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, initializing, isAuthenticated: Boolean(user), signIn, signUp, signOut }),
    [user, initializing, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

