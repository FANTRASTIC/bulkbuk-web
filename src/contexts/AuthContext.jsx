import React, { createContext, useState, useEffect } from 'react';

/**
 * AuthContext - Global authentication state
 * 
 * User shape:
 * {
 *   id: string,
 *   username: string,
 *   email: string,
 *   role: 'user' | 'admin',
 *   createdAt: string (ISO)
 * }
 */
export const AuthContext = createContext(null);

const LS_USER_KEY = 'bulkbuk.user.v1';
const DEMO_ACCOUNTS = {
  admin: {
    password: 'bulkbuk_admin_demo_key',
    user: {
      id: 'user_demo_admin',
      username: 'admin',
      email: 'admin@bulkbuk.local',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  },
  user: {
    password: 'user_demo_password',
    user: {
      id: 'user_demo_user',
      username: 'user',
      email: 'user@bulkbuk.local',
      role: 'user',
      createdAt: new Date().toISOString(),
    },
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS_USER_KEY);
    }
  }, [user]);

  /**
   * Login with username and password
   * For demo: accepts 'admin' or 'user' as username
   */
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 500));

      const account = DEMO_ACCOUNTS[username];
      if (!account || account.password !== password) {
        throw new Error('Invalid username or password');
      }

      setUser(account.user);
      return account.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout - clear user session
   */
  const logout = () => {
    setUser(null);
    setError(null);
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = Boolean(user);

  /**
   * Check if user is admin
   */
  const isAdmin = user?.role === 'admin';

  /**
   * Check if user has a specific role
   */
  const hasRole = (role) => user?.role === role;

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
