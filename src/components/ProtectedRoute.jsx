import { useAuth } from '@/hooks/useAuth';

/**
 * ProtectedRoute - Guard admin routes
 * 
 * Usage:
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRole = 'admin', onUnauthorized = null }) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    // Not logged in - redirect to login
    return onUnauthorized ? onUnauthorized({ reason: 'not_authenticated' }) : null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // Logged in but doesn't have required role - show unauthorized
    return onUnauthorized ? onUnauthorized({ reason: 'insufficient_permissions' }) : null;
  }

  // All checks passed - render content
  return children;
}
