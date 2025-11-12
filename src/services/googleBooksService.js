export async function searchBooks(query, maxResults = 5) {
  const key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  if (!key) throw new Error('Missing VITE_GOOGLE_BOOKS_API_KEY in .env.local');

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Books API error: ${res.status} ${text}`);
  }
  const json = await res.json();
  const items = json.items || [];
  return items.map((item) => {
    const vi = item.volumeInfo || {};
    const image = vi.imageLinks?.large || vi.imageLinks?.medium || vi.imageLinks?.thumbnail || vi.imageLinks?.smallThumbnail || null;
    return {
      id: item.id,
      title: vi.title || '',
      authors: vi.authors || [],
      description: vi.description || '',
      categories: vi.categories || [],
      publisher: vi.publisher || '',
      publishedDate: vi.publishedDate || '',
      pageCount: vi.pageCount || null,
      image,
      industryIdentifiers: vi.industryIdentifiers || [],
    };
  });
}

/**
 * Fetch an image URL and convert it to a data URL (base64). Useful to cache remote thumbnails
 * into local storage friendly format (avoids hotlinking and CORS image issues).
 */
export async function imageUrlToDataUrl(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read blob as data URL'));
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    // Return null on failure so callers can fallback to the remote URL
    return null;
  }
}
