# Visual Guide: Book Cover Setup

## 🎯 The 3 Books That Need Covers

Your app currently has 3 demo books. Here's where to find them and how to update each one.

---

## 📍 Book #1: Atomic Habits

**Location in code:** Line ~101 in `src/BulkBukApp.jsx`

### BEFORE (Current):
```javascript
{
  id: uid('book'),
  title: 'Atomic Habits',
  author: 'James Clear',
  summary: 'Tiny changes, remarkable results...',
  categories: ['Self-Improvement'],
  tags: ['habits', 'productivity'],
  coverUrl: PLACEHOLDER_COVER,    // 👈 CHANGE THIS
  audioUrl: null,
  notes: [ { id: uid('note'), title: 'Core Idea', content: 'Focus on systems, not goals.' } ],
  published: true,
  createdAt: now,
  updatedAt: now,
},
```

### AFTER - Option A (Local File):
```javascript
{
  // ... same fields ...
  coverUrl: '/books/atomic-habits.jpg',    // 👈 Now points to your image
  // ... rest same ...
},
```

### AFTER - Option B (External URL):
```javascript
{
  // ... same fields ...
  coverUrl: 'https://covers.openlibrary.org/b/id/8382167-M.jpg',
  // ... rest same ...
},
```

---

## 📍 Book #2: Deep Work

**Location in code:** Line ~114 in `src/BulkBukApp.jsx`

### BEFORE (Current):
```javascript
{
  id: uid('book'),
  title: 'Deep Work',
  author: 'Cal Newport',
  summary: 'Rules for focused success...',
  categories: ['Productivity'],
  tags: ['focus', 'work'],
  coverUrl: PLACEHOLDER_COVER,    // 👈 CHANGE THIS
  audioUrl: null,
  notes: [],
  published: true,
  createdAt: now,
  updatedAt: now,
},
```

### AFTER - Option A (Local File):
```javascript
{
  // ... same fields ...
  coverUrl: '/books/deep-work.jpg',    // 👈 Now points to your image
  // ... rest same ...
},
```

### AFTER - Option B (External URL):
```javascript
{
  // ... same fields ...
  coverUrl: 'https://covers.openlibrary.org/b/id/8382168-M.jpg',
  // ... rest same ...
},
```

---

## 📍 Book #3: The Pragmatic Programmer

**Location in code:** Line ~127 in `src/BulkBukApp.jsx`

### BEFORE (Current):
```javascript
{
  id: uid('book'),
  title: 'The Pragmatic Programmer',
  author: 'Andrew Hunt & David Thomas',
  summary: 'A practical guide to...',
  categories: ['Software'],
  tags: ['engineering', 'best-practices'],
  coverUrl: PLACEHOLDER_COVER,    // 👈 CHANGE THIS
  audioUrl: null,
  notes: [],
  published: true,
  createdAt: now,
  updatedAt: now,
},
```

### AFTER - Option A (Local File):
```javascript
{
  // ... same fields ...
  coverUrl: '/books/pragmatic-programmer.jpg',    // 👈 Now points to your image
  // ... rest same ...
},
```

### AFTER - Option B (External URL):
```javascript
{
  // ... same fields ...
  coverUrl: 'https://covers.openlibrary.org/b/id/8382169-M.jpg',
  // ... rest same ...
},
```

---

## 🛠️ How to Apply Changes

### Method 1: Direct Code Edit (Fastest)

1. Open file: `src/BulkBukApp.jsx`
2. Use Ctrl+F to search for: `PLACEHOLDER_COVER`
3. You'll find 3 matches (one for each book)
4. Replace each `PLACEHOLDER_COVER` with your image URL or path
5. Save the file
6. Refresh browser at http://localhost:3001

### Method 2: Use Admin Panel (No Coding)

1. Go to http://localhost:3001
2. Click the "Admin" button (top right)
3. Enter admin key: `bulkbuk_admin_demo_key`
4. Click "Edit" on any book
5. Scroll to "Cover Image" section
6. Click to upload your image
7. Click "Save"
8. Done! Image persists in browser storage

### Method 3: Add Local Files

1. Create folder: `public/books/` (already done ✓)
2. Download or prepare 3 book cover images
3. Save them with names:
   - `atomic-habits.jpg`
   - `deep-work.jpg`
   - `pragmatic-programmer.jpg`
4. Edit `src/BulkBukApp.jsx` and replace `PLACEHOLDER_COVER` with:
   - `/books/atomic-habits.jpg`
   - `/books/deep-work.jpg`
   - `/books/pragmatic-programmer.jpg`
5. Save and refresh

---

## 📊 What You'll See

### Before (With Placeholders):
- Gray boxes with "No Cover Available" text
- Subtle book icon in the center
- Each card still shows title, author, summary, and tags

### After (With Real Covers):
- Actual book cover images displayed
- 3:4 aspect ratio (tall rectangular like real books)
- Professional appearance
- Same functionality, just better looking

---

## 🎨 Where Covers Are Displayed

Your book covers appear in **3 places**:

1. **Gallery Cards** (Main page)
   - On the left side of each card
   - 20x28 size
   - Clickable to view details

2. **Book Detail Modal** (When clicked)
   - Larger display (left side)
   - 3:4 aspect ratio (~300x400px on screen)
   - Full book information

3. **Admin Editor** (When editing books)
   - Preview in the top right
   - Shows current cover as thumbnail

---

## ✅ Implementation Checklist

Choose your approach and follow these steps:

### ☐ Using External URLs (Easiest, Fastest)
- [ ] Open `src/BulkBukApp.jsx`
- [ ] Find line with `coverUrl: PLACEHOLDER_COVER,`
- [ ] Replace with external URL (e.g., Open Library link)
- [ ] Do this for all 3 books
- [ ] Save file
- [ ] Refresh browser
- [ ] Verify covers show up

### ☐ Using Local Files (Recommended)
- [ ] Create `public/books/` folder ✓ (already done)
- [ ] Get 3 book cover images (300x400px, <200KB each)
- [ ] Save to `public/books/`:
  - `atomic-habits.jpg`
  - `deep-work.jpg`
  - `pragmatic-programmer.jpg`
- [ ] Open `src/BulkBukApp.jsx`
- [ ] Replace all `PLACEHOLDER_COVER` with `/books/filename.jpg`
- [ ] Save file
- [ ] Refresh browser
- [ ] Verify covers show up

### ☐ Using Admin Panel (Most User-Friendly)
- [ ] Go to http://localhost:3001
- [ ] Click "Admin" button
- [ ] Enter key: `bulkbuk_admin_demo_key`
- [ ] For each book:
  - [ ] Click "Edit" button
  - [ ] Scroll to "Cover Image" section
  - [ ] Click to upload image
  - [ ] Select image from your computer
  - [ ] Click "Save"
- [ ] Done!

---

## 🎓 Tips & Tricks

### Finding Good Test Images
- **Open Library API:** `https://covers.openlibrary.org/`
- **Google Books:** `https://books.google.com/`
- **Project Gutenberg:** `https://www.gutenberg.org/`
- **Book Depository:** `https://www.bookdepository.com/`
- **Amazon:** (right-click book cover > Copy image)

### Image Requirements
- **Format:** JPG, PNG, or WebP
- **Aspect Ratio:** 3:4 (width:height)
- **Recommended Size:** 300x400px
- **File Size:** < 200KB
- **Quality:** 80% compression is usually fine

### Resizing Images
Online tools (no installation needed):
- **Squoosh:** https://squoosh.app/
- **TinyPNG:** https://tinypng.com/
- **Canva:** https://www.canva.com/

Command line (if you have ImageMagick):
```bash
convert input.jpg -resize 300x400 output.jpg
```

### Converting to Base64
If you want to embed images directly in code:
1. Go to https://www.base64encode.org/
2. Upload your image
3. Copy the base64 string
4. Use as: `coverUrl: 'data:image/jpeg;base64,iVBORw0KGgo...'`

---

## 🚀 Next Steps

Once covers are set up:
1. Add audio overviews (optional)
2. Customize categories and tags
3. Add notes and key takeaways for each book
4. Style the app with your brand colors
5. Deploy to production

Enjoy your book library! 📚✨
