/**
 * Utility to fetch real book covers from Google Books API
 * and generate data URLs for local storage
 */

const API_KEY = 'AIzaSyDsvFftQsw1dW2n-l_zTLSbVbBLeq9IawU';

export async function fetchAndConvertBookCovers() {
  const books = [
    { title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292' },
    { title: 'Deep Work', author: 'Cal Newport', isbn: '9780465053032' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780201616224' }
  ];

  const results = [];

  for (const book of books) {
    try {
      // Search by ISBN first (most reliable)
      const query = `isbn:${book.isbn}`;
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${API_KEY}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.items && data.items[0]) {
        const item = data.items[0];
        const imageUrl = 
          item.volumeInfo?.imageLinks?.large ||
          item.volumeInfo?.imageLinks?.medium ||
          item.volumeInfo?.imageLinks?.thumbnail;

        if (imageUrl) {
          // Convert image to data URL
          const dataUrl = await imageUrlToDataUrl(imageUrl);
          
          results.push({
            title: book.title,
            success: true,
            imageUrl: imageUrl,
            dataUrl: dataUrl
          });
          
          console.log(`✓ ${book.title}`);
          console.log(`  Original: ${imageUrl}`);
          console.log(`  DataURL: ${dataUrl?.substring(0, 100)}...`);
          console.log();
        }
      }
    } catch (error) {
      console.error(`✗ Failed to fetch ${book.title}:`, error);
      results.push({
        title: book.title,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Convert an image URL to a data URL (base64)
 */
export async function imageUrlToDataUrl(url) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image URL to data URL:', error);
    return null;
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchAndConvertBookCovers, imageUrlToDataUrl };
}
