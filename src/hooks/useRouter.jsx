import { useState, useEffect } from 'react';

/**
 * useRouter - Simple client-side routing hook
 * 
 * Usage:
 * const { currentPage, navigate } = useRouter();
 * 
 * Supported routes:
 * '/' - public gallery
 * '/login' - login page
 * '/admin' - admin dashboard
 * '/admin/books' - admin books manager
 * '/unauthorized' - access denied page
 */
export function useRouter() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Try to get page from URL hash or default to '/'
    const hash = window.location.hash.slice(1) || '/';
    return hash || '/';
  });

  const navigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  // Listen for hash changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return { currentPage, navigate };
}
