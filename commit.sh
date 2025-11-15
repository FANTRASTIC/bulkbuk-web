#!/bin/bash
# Commit all changes to git

cd /c/Users/18707/Downloads/BULKBUK/bulkbuk

# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "feat: improve book covers, add logo navigation, and refine UI component theming

- Update demo book covers to use reliable Amazon CDN URLs
- Add crossOrigin attribute to images for proper CORS handling
- Implement clickable logo navigation across all layouts
- Enhance image loading state handling in BookCard
- Update UI components (Dialog, Input, Textarea, Label, Switch, Card) with CSS variables for better theme support
- Fix focus ring styling on input fields
- Improve Button component with destructive variant support
- All components now properly adapt to light/dark theme automatically"

# Push to GitHub
git push origin main

echo "✅ Changes committed and pushed to GitHub!"
