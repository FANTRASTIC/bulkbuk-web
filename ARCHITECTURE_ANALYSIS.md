# BulkBuk Architecture Analysis & Admin Role Implementation Plan

## 📋 Current State Analysis

### Tech Stack
- **Frontend**: React 19.1.1 + Vite (rolldown-vite v7.1.14)
- **Styling**: Tailwind CSS (Play CDN) + Custom CSS variables
- **State Management**: React hooks (useState, useRef, useMemo, useEffect)
- **UI Components**: Custom shadcn/ui components (Button, Card, Input, Dialog, etc.)
- **Icons**: lucide-react v0.553.0
- **Animations**: Framer Motion v12.23.24
- **Storage**: Browser localStorage (no backend)
- **Authentication**: Simple localStorage flag (ADMIN_FLAG = "bulkbuk.isAdmin")
- **External APIs**: Google Books API (client-side)

### Current Architecture
```
src/
├── App.jsx                          # Entry point, mounts BulkBukApp
├── BulkBukApp.jsx                   # Main monolithic component (968 lines)
│   ├── useLocalBooks()              # localStorage persistence
│   ├── useAdminMode()               # Demo admin auth (password-based)
│   ├── BookCard()                   # Book display component
│   ├── BookModal()                  # Book detail view
│   ├── AdminEditor()                # Admin form for CRUD
│   └── Default export (main UI)     # Combined public + admin UI
├── services/
│   └── googleBooksService.js        # Google Books API wrapper
├── components/ui/
│   ├── button.jsx, input.jsx, etc.  # UI primitives
│   └── [other components]
└── index.css                        # CSS variables + theme
```

### Current Authentication/Authorization
- **Method**: Simple localStorage flag
- **Admin Key**: Hardcoded demo key (`bulkbuk_admin_demo_key`)
- **Session Storage**: localStorage
- **Protected Routes**: None (frontend only, no routing)
- **Backend**: None (fully client-side)
- **Role System**: Only binary (isAdmin: true/false)

**Problem**: No separation of concerns, no real authorization, admin UI mixed with public UI.

---

## 🎯 Implementation Plan

### Phase 1: User & Role System (Frontend)
1. Create a user/session context for global auth state
2. Introduce role enum: `user`, `admin`
3. Replace localStorage flag with user object:
   ```js
   {
     id: "user_xxx",
     username: "john_doe",
     role: "user" | "admin",
     email: "john@example.com"
   }
   ```

### Phase 2: Separate Routes & Pages
1. Create simple client-side router:
   - `/` → Public gallery (PublicGallery.jsx)
   - `/admin` → Admin dashboard (AdminDashboard.jsx)
   - `/admin/books` → Admin book manager (AdminBooksManager.jsx)
   - `/login` → Login page (LoginPage.jsx)
   - `/unauthorized` → Access denied page

2. Navigation based on role:
   - Public users: see only `/` 
   - Admins: see `/`, `/admin`, `/admin/books`

### Phase 3: Component Refactoring
1. Split BulkBukApp.jsx into:
   - `PublicGallery.jsx` (books display, no admin features)
   - `AdminLayout.jsx` (sidebar + admin nav)
   - `AdminDashboard.jsx` (welcome + stats)
   - `AdminBooksManager.jsx` (CRUD for books)

2. Move shared logic to hooks/utilities:
   - `useBooks()` (manage book state)
   - `useAuth()` (manage auth state)
   - `useRouter()` (simple routing)

### Phase 4: Authorization (Frontend)
1. Create route guards:
   - `ProtectedRoute` component (checks role)
   - Redirects to `/login` if not authenticated
   - Redirects to `/unauthorized` if insufficient permissions

2. Component-level access control:
   - Hide admin buttons from public users
   - Disable admin APIs for non-admins

### Phase 5: Future Backend Security (When Adding Backend)
- Every admin operation requires JWT with `role: admin`
- Server validates role on every request
- No trusting client role claims
- Implement proper 401/403 responses

---

## 📊 Files to Create & Modify

### New Files
```
src/
├── pages/
│   ├── PublicGallery.jsx            # Public book browsing
│   ├── AdminDashboard.jsx           # Admin welcome screen
│   ├── AdminBooksManager.jsx        # Admin CRUD interface
│   ├── LoginPage.jsx                # Login form
│   └── UnauthorizedPage.jsx         # Access denied
├── components/
│   ├── AdminLayout.jsx              # Admin sidebar + header
│   ├── ProtectedRoute.jsx           # Route guard wrapper
│   └── [admin-specific components]
├── hooks/
│   ├── useAuth.jsx                  # Auth state & logic
│   ├── useBooks.jsx                 # Books state & logic
│   └── useRouter.jsx                # Simple routing
├── contexts/
│   └── AuthContext.jsx              # Global auth provider
└── constants/
    └── routes.js                    # Route definitions
```

### Modified Files
```
src/
├── App.jsx                          # Add routing logic
├── BulkBukApp.jsx                   # Refactor or deprecate
├── index.css                        # Add admin-specific styles
└── main.jsx                         # (no changes)
```

---

## 🔐 Security Checklist

- ✅ Admin UI only visible to admin users
- ✅ Non-admins redirected if accessing /admin
- ✅ No hard-coded admin bypasses
- ✅ Role checks before sensitive operations
- ✅ Clear separation of public vs admin components
- 🔜 (Future) Backend validates all admin requests
- 🔜 (Future) JWTs with role embedded
- 🔜 (Future) Session management

---

## 🚀 Implementation Steps (Order)

1. ✅ Create `useAuth()` hook with user/role state
2. ✅ Create `AuthContext` for global auth state
3. ✅ Create simple router (`useRouter()` hook)
4. ✅ Extract `PublicGallery.jsx` from BulkBukApp
5. ✅ Create `AdminLayout.jsx` wrapper
6. ✅ Create `AdminDashboard.jsx`
7. ✅ Create `AdminBooksManager.jsx`
8. ✅ Create `LoginPage.jsx`
9. ✅ Create `ProtectedRoute.jsx` component
10. ✅ Update `App.jsx` to use routing
11. ✅ Add role-based navigation to headers
12. ✅ Test: public access to `/`
13. ✅ Test: public access blocked to `/admin`
14. ✅ Test: admin access to both routes
15. ✅ Refactor book management logic into `useBooks()` hook

---

## 📝 Development Workflow

### For Testing
1. Run `npm run dev`
2. Login as admin: mock login with role = "admin"
3. Login as user: mock login with role = "user"
4. Test route access
5. Test admin features blocked for users

### Before Adding Real Backend
1. Document API contract for auth endpoints
2. Plan JWT/session tokens
3. Plan database schema for users/books/roles
4. Plan migration strategy

---

## Next Action
Ready to start implementation. Confirm:
1. Should we use simple state-based routing or React Router?
2. Local role assignment mechanism (admin "seed" function)?
3. Any specific admin pages needed beyond dashboard + books manager?
