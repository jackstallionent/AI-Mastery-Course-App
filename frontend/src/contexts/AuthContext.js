import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || '';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('jse_token'));

  const saveToken = useCallback((newToken) => {
    localStorage.setItem('jse_token', newToken);
    setToken(newToken);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('jse_token');
    setToken(null);
    setUser(null);
  }, []);

  // Check for token in URL params (OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      saveToken(urlToken);
      // Remove token from URL without reload
      const newUrl = window.location.pathname + 
        (params.get('admin') === 'true' ? '?admin=true' : '');
      window.history.replaceState({}, '', newUrl || '/');
    }
    const authError = params.get('auth_error');
    if (authError) {
      console.error('Auth error:', authError);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [saveToken]);

  // Fetch user profile when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          clearAuth();
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token, clearAuth]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google/start`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error('Google sign-in failed:', e);
    }
  }, []);

  const signOut = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const getAuthHeaders = useCallback(() => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      token,
      signInWithGoogle,
      signOut,
      saveToken,
      getAuthHeaders,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
