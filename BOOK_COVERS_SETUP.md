# Setting Up Book Cover Images

## Overview
Book covers are displayed on the gallery cards and in the detail modal. Currently, demo data uses placeholder images, but you can easily add your own book cover images.

## Where to Add Images

### Option 1: Static Images (Recommended)
Place your book cover images in the `public/books/` directory:
```
public/
└── books/
    ├── atomic-habits.jpg
    ├── deep-work.jpg
    └── pragmatic-programmer.jpg
```

### Option 2: External URLs
Use direct URLs from other services (e.g., Amazon, Open Library, etc.)

## How to Update Book Covers

### In the Demo Data (useLocalBooks hook)
Edit `src/BulkBukApp.jsx` and update the `coverUrl` field for each book:

**Option 1 - Using static files from `public/books/`:**
```javascript
{
  id: uid('book'),
  title: 'Atomic Habits',
  author: 'James Clear',
  summary: 'Tiny changes, remarkable results...',
  coverUrl: '/books/atomic-habits.jpg',  // Relative path from public folder
  // ... other fields
}
```

**Option 2 - Using external URLs:**
```javascript
{
  id: uid('book'),
  title: 'Deep Work',
  author: 'Cal Newport',
  summary: 'Rules for focused success...',
  coverUrl: 'https://example.com/covers/deep-work.jpg',
  // ... other fields
}
```

**Option 3 - Using data URLs (for small images):**
Convert your image to base64 and use as a data URL:
```javascript
coverUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
```

## Recommended Image Specifications

| Property | Value |
|----------|-------|
| Format | JPG, PNG, or WebP |
| Aspect Ratio | 3:4 (like book covers) |
| Width | 300-600px |
| Height | 400-800px |
| File Size | < 200KB |
| Quality | 80-90% compression |

## Code Location: Demo Data

**File:** `src/BulkBukApp.jsx`
**Lines:** ~95-145

The `useLocalBooks()` hook contains the demo book data. Look for the `demo` array and update the `coverUrl` field for each book.

## Admin Panel: Upload Covers Dynamically

When you log into the admin panel (Admin key: `bulkbuk_admin_demo_key`), you can:

1. Click **New Book** or **Edit** on any book
2. Scroll to the right side of the editor
3. Click the **Cover Image** upload area
4. Select an image file from your computer
5. The image will be converted to a data URL and stored in localStorage

This way, your cover images persist without needing to modify the source code.

## Example: How to Add Your First Cover Image

### Step 1: Find or Create a Cover Image
- Use an existing book cover image from your computer
- Or download one from websites like Amazon, Open Library, or Book Depository
- Resize to 300x400px for optimal performance

### Step 2: Save to `public/books/`
Place the image file in: `c:\Users\18707\Downloads\BULKBUK\bulkbuk\public\books\`

Example:
- `atomic-habits.jpg`
- `deep-work.jpg`
- `pragmatic-programmer.jpg`

### Step 3: Update Code in `src/BulkBukApp.jsx`
Find this section (around line 100):
```javascript
const demo = [
  {
    id: uid('book'),
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: PLACEHOLDER_COVER,  // ← Change this line
```

Replace `PLACEHOLDER_COVER` with:
```javascript
    coverUrl: '/books/atomic-habits.jpg',  // ← New path to your image
```

### Step 4: Save and Refresh
1. Save the file
2. Refresh your browser (http://localhost:3001)
3. You should see your book covers displayed!

## Troubleshooting

### Images Not Showing?
1. **Check file path**: Make sure the image is in `public/books/` folder
2. **Check filename**: Ensure spelling matches exactly (case-sensitive on Linux/Mac)
3. **Check browser console**: Look for 404 errors
4. **Clear cache**: Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Images Look Stretched?
- The cards expect a 3:4 aspect ratio
- Resize your images to match: if width is 300px, height should be 400px

### File Too Large?
- Compress the image using an online tool like TinyPNG or Squoosh
- Aim for < 200KB per image

## Next Steps

After setting up covers:
1. Log in as admin (key: `bulkbuk_admin_demo_key`)
2. Add audio overviews for each book
3. Add notes and key takeaways
4. Customize categories and tags

Enjoy your book library! 📚
