import './App.css';
import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/hooks/useRouter';
import { LoginPage } from '@/pages/LoginPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { PublicGallery } from '@/pages/PublicGallery';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminBooksManager } from '@/pages/AdminBooksManager';
import { UserLayout } from '@/components/UserLayout';
import { UserContentPage } from '@/pages/UserContentPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useBooks } from '@/hooks/useBooks';

function AppContent() {
  const auth = useAuth();
  const { currentPage, navigate } = useRouter();
  const { books } = useBooks();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bulkbuk.theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('bulkbuk.theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLoginSuccess = () => {
    navigate('/');
  };

  // Public pages (no auth required)
  if (currentPage === '/login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === '/unauthorized') {
    return (
      <UnauthorizedPage
        reason={!auth.isAuthenticated ? 'not_authenticated' : 'insufficient_permissions'}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // User pages (auth required)
  if (currentPage === '/my-content') {
    if (!auth.isAuthenticated) {
      navigate('/unauthorized');
      return null;
    }

    return (
      <UserLayout 
        theme={theme} 
        onThemeToggle={handleThemeToggle}
        onLogoClick={() => navigate('/')}
      >
        <UserContentPage />
      </UserLayout>
    );
  }

  // Admin pages (auth required with admin role)
  if (currentPage === '/admin' || currentPage === '/admin/books') {
    if (!auth.isAuthenticated) {
      navigate('/unauthorized');
      return null;
    }

    if (!auth.isAdmin) {
      navigate('/unauthorized');
      return null;
    }

    const adminPage = currentPage === '/admin/books' ? 'books' : 'dashboard';

    return (
      <AdminLayout
        currentPage={adminPage}
        onNavigate={(page) => navigate(`/admin${page === 'books' ? '/books' : ''}`)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      >
        {adminPage === 'books' && <AdminBooksManager />}
        {adminPage === 'dashboard' && <AdminDashboard books={books} onNavigateToBooks={() => navigate('/admin/books')} />}
      </AdminLayout>
    );
  }

  // Default: Public gallery
  return (
    <PublicGallery
      theme={theme}
      onThemeToggle={handleThemeToggle}
      onLoginClick={handleLoginClick}
      isAdmin={auth.isAdmin}
      isAuthenticated={auth.isAuthenticated}
      onMyContentClick={() => navigate('/my-content')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
