import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * useAuth hook - Access auth state and methods
 * 
 * Usage:
 * const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
