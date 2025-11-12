# Quick Reference: Adding Book Covers

## The Easiest Way (3 Steps)

### Step 1: Find the Demo Data
**File:** `src/BulkBukApp.jsx`
**Search for:** `const demo = [`
**Lines:** Around 95-145

### Step 2: Update Each Book's coverUrl

Replace this:
```javascript
coverUrl: PLACEHOLDER_COVER,
```

With ONE of these options:

**A) Local image file:**
```javascript
coverUrl: '/books/atomic-habits.jpg',
```

**B) External URL:**
```javascript
coverUrl: 'https://example.com/path/to/cover.jpg',
```

**C) Data URL (copy-paste from online converter):**
```javascript
coverUrl: 'data:image/jpeg;base64,iVBORw0KGgoAAAAN...',
```

### Step 3: Save & Refresh
- Save the file in your editor
- Refresh the browser (http://localhost:3001)
- Done! ✓

---

## Option A: Local Images (Recommended)

### What You Need:
1. Images in the correct folder: `public/books/`
2. Image files named clearly: `atomic-habits.jpg`, `deep-work.jpg`, etc.
3. Images should be 3:4 aspect ratio (300x400px recommended)

### Folder Structure:
```
bulkbuk/
├── public/
│   ├── vite.svg
│   └── books/
│       ├── atomic-habits.jpg
│       ├── deep-work.jpg
│       └── pragmatic-programmer.jpg
└── src/
```

### Example Code Change:
**Before:**
```javascript
const demo = [
  {
    title: 'Atomic Habits',
    coverUrl: PLACEHOLDER_COVER,  // ← This is a placeholder
```

**After:**
```javascript
const demo = [
  {
    title: 'Atomic Habits',
    coverUrl: '/books/atomic-habits.jpg',  // ← Points to your image
```

---

## Option B: External URLs (No Setup Needed)

Use direct links to existing covers online:

```javascript
// From Open Library
coverUrl: 'https://covers.openlibrary.org/b/id/8382167-M.jpg'

// From Google Books API
coverUrl: 'https://lh3.googleusercontent.com/...'

// From Amazon (may have CORS issues)
coverUrl: 'https://m.media-amazon.com/images/P/...'

// From any other website
coverUrl: 'https://example.com/book-covers/atomic-habits.jpg'
```

### Pros & Cons:
✅ No file setup needed
✅ Easy to test immediately
❌ Dependent on external servers
❌ May have CORS issues
❌ Images might disappear if external server goes down

---

## Option C: Use Admin Panel (Most Flexible)

Instead of editing code, use the admin panel:

1. Go to http://localhost:3001
2. Click "Admin" button
3. Enter key: `bulkbuk_admin_demo_key`
4. Click "New Book" or "Edit" on existing book
5. Scroll to "Cover Image" section
6. Click to upload your image
7. The image converts to a data URL and stores in browser's localStorage
8. Changes persist across page refreshes!

### Pros & Cons:
✅ No code editing
✅ Very user-friendly
✅ Images persist in localStorage
✅ Works with browser's file picker
❌ Need to be in admin mode
❌ Data only persists in browser (not in code)

---

## Where Exactly to Edit

### File: src/BulkBukApp.jsx

Search for this line (around line 95):
```javascript
function useLocalBooks() {
  const [books, setBooks] = useState(() => {
    const s = loadFromStorage();
    if (s && s.length) return s;
    // Seed demo data for first-time users so the UI looks populated
    const now = new Date().toISOString();
    const demo = [  // ← Start here
```

Then find each book object. Each looks like this:
```javascript
      {
        id: uid('book'),
        title: 'Atomic Habits',
        author: 'James Clear',
        summary: 'Tiny changes...',
        categories: ['Self-Improvement'],
        tags: ['habits', 'productivity'],
        coverUrl: PLACEHOLDER_COVER,  // ← CHANGE THIS LINE
        audioUrl: null,
        notes: [ { id: uid('note'), title: 'Core Idea', content: 'Focus on systems, not goals.' } ],
        published: true,
        createdAt: now,
        updatedAt: now,
      },
```

There are 3 books total in the demo array. Update the `coverUrl` for each one.

---

## Examples Ready to Copy & Paste

### Example 1: Using Open Library API
Replace all `PLACEHOLDER_COVER` with these:

```javascript
// Book 1
coverUrl: 'https://covers.openlibrary.org/b/id/8382167-M.jpg'

// Book 2
coverUrl: 'https://covers.openlibrary.org/b/id/8382168-M.jpg'

// Book 3
coverUrl: 'https://covers.openlibrary.org/b/id/8382169-M.jpg'
```

### Example 2: Using Local Files
1. Create `public/books/` folder
2. Add your images
3. Replace all `PLACEHOLDER_COVER` with:

```javascript
// Book 1
coverUrl: '/books/atomic-habits.jpg'

// Book 2
coverUrl: '/books/deep-work.jpg'

// Book 3
coverUrl: '/books/pragmatic-programmer.jpg'
```

### Example 3: Mixed URLs
You can use different sources for each book:

```javascript
// From Open Library
coverUrl: 'https://covers.openlibrary.org/b/id/8382167-M.jpg'

// From local file
coverUrl: '/books/deep-work.jpg'

// From external URL
coverUrl: 'https://bookcovers.example.com/pragmatic.jpg'
```

---

## Verification Checklist

After making changes:

- [ ] Saved the file
- [ ] File is `src/BulkBukApp.jsx`
- [ ] Refreshed browser (Ctrl+R or Cmd+R)
- [ ] Book covers now visible on cards
- [ ] No 404 errors in browser console (F12 > Console tab)
- [ ] Images display in book detail modal when clicked

---

## Need Help?

### Image Doesn't Show?
1. Check the browser console (F12) for errors
2. Verify the file path (if using local images)
3. Check that the file exists in `public/books/`
4. Try using an external URL instead to test

### Image Looks Stretched?
- Images need 3:4 aspect ratio
- Resize to 300x400px for best results

### Can't Find the Code?
- Open `src/BulkBukApp.jsx`
- Press Ctrl+F (or Cmd+F on Mac)
- Search for `PLACEHOLDER_COVER`
- You'll see all 3 places to change

Enjoy your book covers! 📚✨
