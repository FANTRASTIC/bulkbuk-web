// Alternative Demo Data with Real Book Covers
// This file shows how to use real book cover images from external sources
// To use these, replace the demo array in useLocalBooks() with this content

// Option A: Using Open Library API (Free Book Covers)
const demoWithOpenLibraryCovers = [
  {
    id: uid('book'),
    title: 'Atomic Habits',
    author: 'James Clear',
    summary: 'Tiny changes, remarkable results — an easy & proven way to build good habits and break bad ones.',
    categories: ['Self-Improvement'],
    tags: ['habits', 'productivity'],
    // Open Library returns book covers - requires ISBN
    // Format: https://covers.openlibrary.org/b/id/{coverID}-M.jpg
    // You need to look up the ISBN first, then get the cover ID from Open Library API
    coverUrl: 'https://covers.openlibrary.org/b/id/8382167-M.jpg', // Atomic Habits cover
    audioUrl: null,
    notes: [ { id: uid('note'), title: 'Core Idea', content: 'Focus on systems, not goals.' } ],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid('book'),
    title: 'Deep Work',
    author: 'Cal Newport',
    summary: 'Rules for focused success in a distracted world. Practical strategies for producing at an elite level.',
    categories: ['Productivity'],
    tags: ['focus', 'work'],
    coverUrl: 'https://covers.openlibrary.org/b/id/8382168-M.jpg', // Deep Work cover
    audioUrl: null,
    notes: [],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Option B: Using Google Books API
// Format: https://www.googleapis.com/books/v1/volumes?q={search_term}
// Returns JSON with thumbnail URLs

// Option C: Using Static Local Files
// Save images to public/books/ folder and reference as:
const demoWithLocalFiles = [
  {
    // ... book data
    coverUrl: '/books/atomic-habits.jpg',  // Will be served from public/books/atomic-habits.jpg
  }
];

// Option D: Using Data URLs (for very small images or embedded)
// Convert image to base64 first
// Tools: https://www.base64encode.org/ or https://ezgif.com/image-to-datauri
const demoWithDataUrls = [
  {
    // ... book data
    coverUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=',
  }
];

// Recommended approach for testing:
// 1. Create public/books/ folder
// 2. Download book cover images (3:4 aspect ratio, ~300x400px)
// 3. Save them as: atomic-habits.jpg, deep-work.jpg, pragmatic-programmer.jpg
// 4. Update coverUrl in src/BulkBukApp.jsx to point to /books/filename.jpg
// 5. Or use external URLs from Open Library, Google Books, or Goodreads

export { demoWithOpenLibraryCovers, demoWithLocalFiles, demoWithDataUrls };
