/**
 * Simple router hook for URL-based view switching.
 * No external dependency — uses window.location.pathname and History API.
 */

export function useRouter() {
  const [path, setPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath) => {
    window.history.pushState(null, '', newPath);
    setPath(newPath);
  };

  return { path, navigate };
}
