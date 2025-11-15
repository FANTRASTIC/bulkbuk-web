import { useState, useEffect } from 'react';

const LS_KEY = 'bulkbuk.books.v1';

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function saveToStorage(books) {
  localStorage.setItem(LS_KEY, JSON.stringify(books));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

const PLACEHOLDER_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="100%" height="100%" fill="#f2f2f2"/><g fill="#b0b0b0" font-family="sans-serif" font-size="14" text-anchor="middle"><text x="100" y="120">No Cover</text><text x="100" y="145">Available</text></g></svg>'
)}`;

/**
 * useBooks - Manage book state and operations
 */
export function useBooks() {
  const [books, setBooks] = useState(() => {
    const s = loadFromStorage();
    if (s && s.length) return s;

    // Seed demo data for first-time users
    const now = new Date().toISOString();
    const adminUserId = 'user_demo_admin'; // Admin user owns demo books
    const demo = [
      {
        id: uid('book'),
        title: 'Atomic Habits',
        author: 'James Clear',
        summary: 'Transform your life through the power of tiny, incremental changes. Atomic Habits reveals practical strategies for building good habits and breaking bad ones. Learn how small adjustments in behavior can compound over time to deliver remarkable results. Perfect for anyone seeking sustainable self-improvement and lasting personal growth.',
        categories: ['Self-Improvement', 'Productivity'],
        tags: ['habits', 'productivity', '9780735211292'],
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/P/0735211299.01.L.jpg',
        audioUrl: null,
        notes: [
          { id: uid('note'), title: 'Core Principle', content: 'Focus on systems, not goals. Build identity-based habits instead of outcome-based ones.' },
          { id: uid('note'), title: 'Key Insight', content: '1% improvement every day compounds to 37x better over a year (1.01^365 = 37.78).' }
        ],
        published: true,
        archived: false,
        createdBy: adminUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uid('book'),
        title: 'Deep Work',
        author: 'Cal Newport',
        summary: 'In a world of constant distraction, the ability to focus deeply has become a superpower. Deep Work provides actionable strategies for achieving elite-level productivity and performing at your best. Discover how to minimize distractions, structure your work environment, and cultivate deep focus to produce meaningful, high-quality work that stands out.',
        categories: ['Productivity', 'Career'],
        tags: ['focus', 'work', 'success', '9780465053032'],
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/P/0465050530.01.L.jpg',
        audioUrl: null,
        notes: [
          { id: uid('note'), title: 'Definition', content: 'Deep Work: Professional activities performed in a state of unbroken concentration that push your abilities to their limit.' },
          { id: uid('note'), title: 'Key Strategy', content: 'Structure your day with uninterrupted blocks for deep work. Schedule shallow work (emails, meetings) separately.' }
        ],
        published: true,
        archived: false,
        createdBy: adminUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uid('book'),
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        summary: 'Essential wisdom for modern software developers. The Pragmatic Programmer shares time-tested practices, tips, and techniques for writing better code and becoming a more effective engineer. From debugging strategies to career development, this book delivers practical guidance that directly improves your craft and professional life.',
        categories: ['Software', 'Programming'],
        tags: ['engineering', 'best-practices', 'development', '9780201616224'],
        coverUrl: 'https://images-na.ssl-images-amazon.com/images/P/0201616224.01.L.jpg',
        audioUrl: null,
        notes: [
          { id: uid('note'), title: 'Philosophy', content: 'Programmers should take responsibility for their code and become craftspeople dedicated to their work.' },
          { id: uid('note'), title: 'Practical Tip', content: 'Always use version control, automate repetitive tasks, and write code that is easy for others to understand.' }
        ],
        published: true,
        archived: false,
        createdBy: adminUserId,
        createdAt: now,
        updatedAt: now,
      },
    ];
    saveToStorage(demo);
    return demo;
  });

  useEffect(() => saveToStorage(books), [books]);

  const addBook = (book, userId) => {
    const newBook = {
      ...book,
      id: book.id || uid('book'),
      createdBy: userId,
      archived: false,
      createdAt: book.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBooks((prev) => [newBook, ...prev]);
    return newBook;
  };

  const updateBook = (id, updates) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
      )
    );
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const getBook = (id) => books.find((b) => b.id === id);

  /**
   * Get books created by a specific user
   */
  const getUserBooks = (userId) => {
    return books.filter((b) => b.createdBy === userId && !b.archived);
  };

  /**
   * Get all non-archived books for public gallery
   */
  const getPublishedBooks = () => {
    return books.filter((b) => b.published && !b.archived);
  };

  /**
   * Archive a book (admin only)
   */
  const archiveBook = (id) => {
    updateBook(id, { archived: true });
  };

  /**
   * Restore an archived book (admin only)
   */
  const restoreBook = (id) => {
    updateBook(id, { archived: false });
  };

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    getUserBooks,
    getPublishedBooks,
    archiveBook,
    restoreBook,
    PLACEHOLDER_COVER,
  };
}
