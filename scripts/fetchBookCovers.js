/**
 * Script to fetch real book covers from Google Books API
 * Run with: node scripts/fetchBookCovers.js
 */

async function fetchBookCovers() {
  // You'll need to set this in your .env.local file
  const googleBooksKey = process.env.VITE_GOOGLE_BOOKS_API_KEY;
  
  if (!googleBooksKey) {
    console.error('Error: VITE_GOOGLE_BOOKS_API_KEY not set in environment');
    process.exit(1);
  }

  const booksToFetch = [
    { title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292' },
    { title: 'Deep Work', author: 'Cal Newport', isbn: '9780465053032' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt David Thomas', isbn: '9780201616224' }
  ];

  console.log('Fetching book covers from Google Books API...\n');
  const results = [];
  
  for (const book of booksToFetch) {
    try {
      // Try searching by ISBN first (more reliable)
      let query = book.isbn ? `isbn:${book.isbn}` : `${book.title} ${book.author}`;
      let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${googleBooksKey}`;
      
      let res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      
      let json = await res.json();
      let item = json.items?.[0];
      
      // If ISBN search didn't work, try title + author
      if (!item) {
        query = `${book.title} ${book.author}`;
        url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${googleBooksKey}`;
        res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        json = await res.json();
        item = json.items?.[0];
      }

      if (item) {
        const imageUrl = item.volumeInfo?.imageLinks?.medium || 
                        item.volumeInfo?.imageLinks?.large ||
                        item.volumeInfo?.imageLinks?.thumbnail;
        
        results.push({
          title: book.title,
          author: book.author,
          imageUrl: imageUrl || 'NOT_FOUND',
          success: !!imageUrl
        });
        
        console.log(`✓ ${book.title}`);
        console.log(`  Cover: ${imageUrl}`);
        console.log();
      } else {
        results.push({ 
          title: book.title, 
          author: book.author,
          imageUrl: 'NOT_FOUND',
          success: false
        });
        console.log(`✗ ${book.title} - Not found in Google Books API`);
        console.log();
      }
    } catch (err) {
      results.push({ 
        title: book.title, 
        author: book.author,
        imageUrl: `ERROR: ${err.message}`,
        success: false
      });
      console.log(`✗ ${book.title} - Error: ${err.message}`);
      console.log();
    }
  }

  console.log('\n=== Summary ===');
  console.log('Copy these URLs into useBooks.jsx demo data:');
  console.log();
  
  results.forEach(r => {
    if (r.success) {
      console.log(`${r.title}:`);
      console.log(`  coverUrl: '${r.imageUrl}',`);
    }
  });

  return results;
}

fetchBookCovers().catch(console.error);
