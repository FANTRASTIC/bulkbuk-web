/**
 * Fetch book covers from Google Books API
 * Run in browser console or Node.js with: node -e "require('node-fetch'); eval(require('fs').readFileSync('fetch-covers.js', 'utf8'))"
 */

const apiKey = 'AIzaSyDsvFftQsw1dW2n-l_zTLSbVbBLeq9IawU';

const books = [
  { title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292' },
  { title: 'Deep Work', author: 'Cal Newport', isbn: '9780465053032' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780201616224' }
];

async function fetchCover(book) {
  try {
    // Try ISBN search first
    const isbnUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}&maxResults=1&key=${apiKey}`;
    let response = await fetch(isbnUrl);
    let data = await response.json();
    
    if (data.items && data.items[0]) {
      const imageUrl = data.items[0].volumeInfo?.imageLinks?.medium ||
                       data.items[0].volumeInfo?.imageLinks?.large ||
                       data.items[0].volumeInfo?.imageLinks?.thumbnail;
      return { title: book.title, success: true, url: imageUrl };
    }

    // Fallback to title + author search
    const titleUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.title + ' ' + book.author)}&maxResults=1&key=${apiKey}`;
    response = await fetch(titleUrl);
    data = await response.json();
    
    if (data.items && data.items[0]) {
      const imageUrl = data.items[0].volumeInfo?.imageLinks?.medium ||
                       data.items[0].volumeInfo?.imageLinks?.large ||
                       data.items[0].volumeInfo?.imageLinks?.thumbnail;
      return { title: book.title, success: true, url: imageUrl };
    }

    return { title: book.title, success: false, url: null };
  } catch (error) {
    console.error(`Error fetching ${book.title}:`, error);
    return { title: book.title, success: false, url: null, error: error.message };
  }
}

async function fetchAllCovers() {
  console.log('Fetching book covers...\n');
  
  for (const book of books) {
    const result = await fetchCover(book);
    if (result.success) {
      console.log(`✓ ${result.title}`);
      console.log(`  ${result.url}\n`);
    } else {
      console.log(`✗ ${result.title} - Failed to fetch\n`);
    }
  }
}

// Run it
fetchAllCovers();
