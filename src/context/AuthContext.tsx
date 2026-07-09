import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, onSessionExpired, persistSession, readStoredToken, readStoredUsername } from '../lib/session';

interface AuthContextValue {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, username: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [username, setUsername] = useState<string | null>(readStoredUsername);
  const navigate = useNavigate();

  useEffect(() => {
    onSessionExpired(() => {
      setToken(null);
      setUsername(null);
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  function signIn(nextToken: string, nextUsername: string) {
    persistSession(nextToken, nextUsername);
    setToken(nextToken);
    setUsername(nextUsername);
  }

  function signOut() {
    clearSession();
    setToken(null);
    setUsername(null);
    navigate('/login', { replace: true });
  }

  const value = useMemo(
    () => ({ token, username, isAuthenticated: Boolean(token), signIn, signOut }),
    [token, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
