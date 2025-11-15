# CLAUDE.md - AI Assistant Guide for Nomading Now

## Project Overview

**Nomading Now** is a real-time digital nomad community platform for sharing location-based tips. It's a Progressive Web App (PWA) built with React, TypeScript, and Supabase, designed for mobile-first experiences with desktop support.

**Purpose:** Enable digital nomads to share and discover location-based tips about food, cafes, workspaces, accommodation, and more in real-time.

---

## Tech Stack & Architecture

### Core Technologies
- **Frontend:** React 18.3.1 + TypeScript 5.6.3
- **Build Tool:** Vite 6.0.1 (fast dev server, optimized builds)
- **Backend:** Supabase 2.46.1 (PostgreSQL + Auth + Real-time + Storage)
- **Routing:** React Router DOM 6.28.0
- **State Management:** Zustand 5.0.1 (lightweight, no boilerplate)
- **Styling:** Tailwind CSS 3.4.14 with custom design system
- **UI Components:** shadcn/ui (68 components based on Radix UI)
- **Maps:** Leaflet 1.9.4 + React Leaflet 4.2.1
- **Forms:** React Hook Form 7.54.0 + Zod 3.23.8 validation
- **Icons:** Lucide React 0.460.0
- **Notifications:** Sonner 1.7.1
- **Theme:** next-themes 0.4.3 (dark/light mode)
- **PWA:** VitePWA 0.21.1 (offline support, service worker)

### Architecture Patterns
1. **Component-based architecture** - Single responsibility components
2. **Type-safe development** - Comprehensive TypeScript definitions
3. **Database-driven UI** - API layer abstraction in `src/lib/database.ts`
4. **Optimistic updates** - UI updates before API confirmation
5. **Mobile-first responsive** - Progressive enhancement for desktop
6. **PWA-ready** - Offline capabilities, installable

---

## Directory Structure

```
nomading-now/
├── public/                      # Static assets
│   ├── manifest.json           # PWA manifest
│   └── white_circle_360x360.png
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication (AuthProvider, AuthModal)
│   │   ├── dev/               # Debug tools (7 dev components)
│   │   ├── layout/            # Layout (AppLayout, TabNavigation, DesktopSidebar)
│   │   ├── map/               # Map components (MapView, LocationPicker)
│   │   ├── profile/           # Profile components
│   │   ├── tips/              # Feed components (TipFeed, TipCard, CreateTipModal)
│   │   └── ui/                # shadcn/ui library (68 components)
│   ├── hooks/                 # Custom React hooks (use-toast)
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client + auth helpers
│   │   ├── database.ts       # Complete API layer (tips, interactions, comments, profiles)
│   │   └── utils.ts          # Utilities (cn() for Tailwind)
│   ├── pages/                 # Route pages
│   │   ├── HomePage.tsx      # Main feed
│   │   ├── MapPage.tsx       # Map view
│   │   ├── ProfilePage.tsx   # User profile
│   │   └── DevPage.tsx       # Debug tools
│   ├── store/
│   │   ├── useAuthStore.ts   # Auth state (user, loading, signOut)
│   │   └── useTipStore.ts    # Tips state (tips, category, location)
│   ├── types/
│   │   └── index.ts          # TypeScript definitions
│   ├── App.tsx               # Main app with routes
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + Tailwind
├── supabase/
│   └── migrations/           # 4 SQL migration files
├── vite.config.ts            # Vite + PWA config
├── tailwind.config.js        # Tailwind + custom theme
├── tsconfig.json             # TypeScript config
└── components.json           # shadcn/ui config

```

---

## Key Files & Their Purposes

### Entry Points
- **index.html** - HTML entry with PWA meta tags, iOS optimizations
- **src/main.tsx** - React app entry, renders `<App />` in StrictMode
- **src/App.tsx** - Router setup, theme provider, auth provider, routes

### Core Library Files
- **src/lib/supabase.ts** - Supabase client initialization
  ```typescript
  // Key exports:
  export const supabase: SupabaseClient
  export const signUp(email, password, nickname)
  export const signIn(email, password)
  export const signOut()
  export const getCurrentUser()
  export const onAuthStateChange(callback)
  ```

- **src/lib/database.ts** - Complete database API layer
  ```typescript
  // Key exports:
  export const tipsApi = {
    getAll, getById, create, update, delete, getByUserId, getByCategory
  }
  export const interactionsApi = {
    likeTip, unlikeTip, saveTip, unsaveTip, getUserLikes, getUserSaves
  }
  export const commentsApi = {
    getByTipId, create, update, delete
  }
  export const profilesApi = {
    getById, update, getStats
  }
  ```

### Type Definitions (src/types/index.ts)
```typescript
// Core types:
User, UserProfile, UserStats
Tip, Comment, TipLike, TipSave
TipCategory (10 categories: food, cafe, accommodation, workspace, etc.)
TipCategoryInfo (with emoji, label, color)
Location, MarketingLink

// Constants:
TIP_CATEGORIES[] // Array of 10 category objects
```

### State Management
- **src/store/useAuthStore.ts** - Global auth state
  ```typescript
  { user, isLoading, setUser, setLoading, signOut }
  ```
- **src/store/useTipStore.ts** - Global tips state
  ```typescript
  { tips, selectedCategory, currentLocation, isLoading, setTips, addTip, updateTip, ... }
  ```

---

## Database Schema (Supabase)

### Tables
1. **users** - User profiles
   - Columns: id (uuid), email, nickname, bio, avatar_url, points, trust_level, created_at
   - RLS: Public read, authenticated users can update their own

2. **tips** - Location-based tips
   - Columns: id, user_id, content, category, images[], latitude, longitude, city, country, likes_count, comments_count, saves_count, created_at, updated_at
   - RLS: Public read, authenticated create/update/delete own
   - Indexes: user_id, category, created_at, location

3. **tip_likes** - Like relationships
   - Columns: id, tip_id, user_id, created_at
   - Unique constraint: (tip_id, user_id)
   - Triggers: Auto-increment/decrement tips.likes_count

4. **tip_saves** - Save/bookmark relationships
   - Columns: id, tip_id, user_id, created_at
   - Unique constraint: (tip_id, user_id)
   - Triggers: Auto-increment/decrement tips.saves_count

5. **tip_comments** - Comments
   - Columns: id, tip_id, user_id, content, created_at, updated_at
   - Triggers: Auto-increment/decrement tips.comments_count

6. **user_profiles** - Extended profile data
   - Columns: user_id, full_name, location, website, social links, languages[], interests[], travel_style, work_type, marketing_bio, marketing_links[], show_marketing

7. **user_stats** - Aggregated statistics
   - Columns: user_id, tips_count, likes_received, comments_received, saves_received, cities_visited, countries_visited, last_activity

### Row Level Security (RLS)
- All tables have RLS enabled
- Public read access for tips, comments, user profiles
- Authenticated-only write access
- Users can only modify their own data
- Admin policies for moderation (future)

### Database Migrations
Located in `supabase/migrations/`:
1. `20250629031208_quiet_bird.sql` - Initial schema
2. `20250629031551_graceful_peak.sql` - Enhanced schema with profiles/stats
3. `20250629031624_peaceful_wave.sql` - Indexes and triggers
4. `20250629175133_old_wood.sql` - Additional optimizations

---

## Component Library (shadcn/ui)

### Installation & Usage
- **Config:** `components.json` (New York style, TypeScript)
- **Location:** All UI components in `src/components/ui/`
- **68 pre-built components** including:
  - Layout: card, separator, sheet, drawer, scroll-area
  - Forms: input, textarea, select, checkbox, radio-group, switch, slider
  - Feedback: toast, alert, progress, skeleton
  - Navigation: tabs, navigation-menu, menubar, command
  - Overlays: dialog, alert-dialog, popover, tooltip, hover-card
  - Data: table, chart, calendar, carousel
  - And more...

### Adding New Components
```bash
npx shadcn-ui@latest add [component-name]
```

### Custom Components
- **BoltBadge** (`src/components/ui/bolt-badge.tsx`) - Bolt.new badge
- **EmptyState** (`src/components/ui/empty-state.tsx`) - Empty state component

### Styling Pattern
```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-classes", conditionalClass && "additional-classes")} />
```

---

## Routing & Pages

### Routes (React Router v6)
```tsx
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<HomePage />} />        // Main feed
    <Route path="map" element={<MapPage />} />    // Map view
    <Route path="profile" element={<ProfilePage />} /> // User profile
    <Route path="dev" element={<ProtectedDevRoute><DevPage /></ProtectedDevRoute>} />
  </Route>
</Routes>
```

### Page Components
- **HomePage** (`src/pages/HomePage.tsx`) - Main feed with search + category filters
- **MapPage** (`src/pages/MapPage.tsx`) - Leaflet map with tip markers
- **ProfilePage** (`src/pages/ProfilePage.tsx`) - User profile, stats, settings
- **DevPage** (`src/pages/DevPage.tsx`) - Debug tools (protected route)

### Layout
- **AppLayout** (`src/components/layout/AppLayout.tsx`) - Main layout with:
  - Desktop sidebar navigation
  - Mobile tab navigation
  - Bolt badge
  - `<Outlet />` for nested routes

---

## State Management (Zustand)

### Auth Store (`useAuthStore`)
```typescript
import { useAuthStore } from '@/store/useAuthStore';

// Usage in components:
const { user, isLoading, setUser, signOut } = useAuthStore();

// State shape:
interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
}
```

### Tips Store (`useTipStore`)
```typescript
import { useTipStore } from '@/store/useTipStore';

// Usage:
const { tips, selectedCategory, setSelectedCategory, addTip } = useTipStore();

// State shape:
interface TipState {
  tips: Tip[];
  selectedCategory: TipCategory | 'all';
  currentLocation: Location | null;
  isLoading: boolean;
  setTips: (tips: Tip[]) => void;
  addTip: (tip: Tip) => void;
  updateTip: (id: string, updates: Partial<Tip>) => void;
  setSelectedCategory: (category: TipCategory | 'all') => void;
  setCurrentLocation: (location: Location | null) => void;
  setLoading: (loading: boolean) => void;
}
```

---

## Code Conventions & Best Practices

### TypeScript
- **Strict mode enabled** - No implicit any, strict null checks
- **Explicit types** - Always define interfaces for props, state, API responses
- **Import aliases** - Use `@/` instead of relative paths
  ```typescript
  import { Button } from '@/components/ui/button';
  import { tipsApi } from '@/lib/database';
  ```

### React Component Patterns
```typescript
// Functional components with TypeScript
interface MyComponentProps {
  title: string;
  count: number;
  onAction?: () => void;
}

export function MyComponent({ title, count, onAction }: MyComponentProps) {
  return <div>{title}: {count}</div>;
}
```

### Naming Conventions
- **Components:** PascalCase (`TipCard.tsx`, `AuthProvider.tsx`)
- **Hooks:** camelCase with "use" prefix (`useAuthStore.ts`, `use-toast.ts`)
- **Utilities:** camelCase (`supabase.ts`, `database.ts`)
- **Types:** PascalCase for interfaces/types (`User`, `TipCategory`)
- **Constants:** UPPER_SNAKE_CASE (`TIP_CATEGORIES`)

### File Organization
- **One component per file** (except small related components)
- **Co-locate related files** (component + styles if needed)
- **Index exports** for public APIs
- **Separate concerns** (UI components vs. logic vs. API calls)

### Styling with Tailwind
```tsx
// Use cn() utility for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes p-4 rounded-lg",
  isActive && "bg-blue-500 text-white",
  variant === "large" && "text-lg"
)} />

// Prefer Tailwind utilities over custom CSS
// Use CSS variables for theme colors (already configured)
```

### API & Data Fetching
```typescript
// Use the database API layer, not direct Supabase queries
import { tipsApi } from '@/lib/database';

// ✅ Good
const tips = await tipsApi.getAll();

// ❌ Avoid direct Supabase queries in components
const { data } = await supabase.from('tips').select('*');

// Handle errors with try/catch
try {
  const tip = await tipsApi.getById(id);
} catch (error) {
  console.error('Failed to fetch tip:', error);
  toast.error('Failed to load tip');
}
```

### Optimistic Updates Pattern
```typescript
// Example: Like button
const handleLike = async (tipId: string) => {
  // 1. Update UI immediately (optimistic)
  updateTip(tipId, {
    is_liked: true,
    likes_count: tip.likes_count + 1
  });

  try {
    // 2. Make API call
    await interactionsApi.likeTip(tipId, userId);
  } catch (error) {
    // 3. Revert on failure
    updateTip(tipId, {
      is_liked: false,
      likes_count: tip.likes_count
    });
    toast.error('Failed to like tip');
  }
};
```

### Error Handling
```typescript
// Use toast notifications for user feedback
import { toast } from "sonner";

toast.success("Tip created!");
toast.error("Failed to create tip");
toast.loading("Creating tip...", { id: 'create-tip' });
toast.success("Tip created!", { id: 'create-tip' }); // Updates loading toast
```

---

## Development Workflows

### Setup & Installation
```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Run dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Common Development Tasks

#### Adding a New Component
```bash
# 1. Create component file
touch src/components/example/MyComponent.tsx

# 2. Define the component
# 3. Export from index if needed
# 4. Import and use in parent component
```

#### Adding a New Page
```bash
# 1. Create page file
touch src/pages/NewPage.tsx

# 2. Add route in App.tsx
<Route path="new-page" element={<NewPage />} />

# 3. Add navigation link in AppLayout
```

#### Adding a New API Function
```typescript
// In src/lib/database.ts

export const myApi = {
  async myFunction(params) {
    try {
      const { data, error } = await supabase
        .from('table')
        .select('*')
        .eq('column', params);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
```

#### Adding a shadcn/ui Component
```bash
# List available components
npx shadcn-ui@latest add

# Add specific component (e.g., badge)
npx shadcn-ui@latest add badge

# Component will be added to src/components/ui/
```

#### Creating a Database Migration
```bash
# Create new migration file
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_description.sql

# Write SQL
# Apply via Supabase dashboard or CLI
```

---

## Testing & Debugging

### Development Tools
- **DevPage** (`/dev` route) - Database testing tools
  - View all tips
  - Test authentication
  - Create sample data
  - Debug API calls
- **Debug info in TipFeed** - Shows API call timing, data flow
- **Test account auto-login** - enfpdevtest@gmail.com (in AuthProvider)

### Browser DevTools
- **React DevTools** - Component tree, props, state
- **Zustand DevTools** - State inspection (if configured)
- **Network tab** - Supabase API calls
- **Console** - Debug logs (search for "TipFeed:", "Database:", etc.)

### Common Issues & Solutions

**Issue: Tips not loading**
- Check Supabase URL/key in .env
- Check network tab for API errors
- Verify RLS policies in Supabase
- Check console for error logs

**Issue: Auth not working**
- Verify Supabase auth settings
- Check email confirmation settings
- Clear localStorage and retry
- Check user in Supabase dashboard

**Issue: PWA not installing**
- Run production build (`npm run build && npm run preview`)
- PWA only works over HTTPS or localhost
- Check manifest.json and service worker in DevTools

**Issue: Map not rendering**
- Check Leaflet CSS is imported
- Verify location data has valid lat/lng
- Check console for Leaflet errors

---

## Build & Deployment

### Production Build
```bash
# Type check + build
npm run build

# Output: dist/ directory
# - Optimized bundles (vendor, ui, map, utils chunks)
# - Service worker for PWA
# - Static assets
```

### Build Optimizations (vite.config.ts)
- **Code splitting:** vendor, ui, map, utils chunks
- **Tree shaking:** Removes unused code
- **Minification:** esbuild (fast minifier)
- **PWA:** Service worker with caching strategies
  - NetworkFirst for Supabase API (30 day cache)
  - CacheFirst for images (7 day cache)

### Deployment Checklist
1. ✅ Set environment variables (Supabase URL/key)
2. ✅ Run `npm run build` successfully
3. ✅ Test production build locally (`npm run preview`)
4. ✅ Verify PWA manifest and icons
5. ✅ Test on mobile devices
6. ✅ Check Supabase RLS policies
7. ✅ Deploy `dist/` directory to hosting (Netlify, Vercel, etc.)
8. ✅ Configure custom domain (if applicable)
9. ✅ Enable HTTPS (required for PWA)
10. ✅ Test all features post-deployment

### Environment Variables Required
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **Use existing patterns** - Follow the established component, API, and state management patterns
2. **Type everything** - Always define TypeScript types/interfaces
3. **Use the API layer** - Don't write raw Supabase queries in components
4. **Mobile-first** - Design for mobile, enhance for desktop
5. **Accessibility** - Use semantic HTML, ARIA labels, keyboard navigation
6. **Performance** - Optimize images, lazy load components, use code splitting
7. **Security** - Never expose sensitive keys, validate user input, respect RLS policies

### Before Making Changes

1. **Read existing code** - Understand the current implementation
2. **Check types** - Review `src/types/index.ts` for data structures
3. **Review API layer** - Check `src/lib/database.ts` for available functions
4. **Check UI components** - See if shadcn/ui component exists before creating custom
5. **Test changes** - Run dev server and verify functionality

### Common Requests & How to Handle

**"Add a new feature"**
1. Define types in `src/types/index.ts`
2. Create API functions in `src/lib/database.ts`
3. Create components in appropriate directory
4. Add to store if global state needed
5. Update routes/navigation if needed
6. Test thoroughly

**"Fix a bug"**
1. Reproduce the issue
2. Check console/network for errors
3. Review related code files
4. Fix with minimal changes
5. Test edge cases

**"Add a UI component"**
1. Check if shadcn/ui has it (`npx shadcn-ui@latest add`)
2. If custom, create in `src/components/[category]/`
3. Use TypeScript for props
4. Follow Tailwind styling conventions
5. Make it responsive

**"Update database schema"**
1. Create migration file in `supabase/migrations/`
2. Write SQL (tables, RLS, indexes, triggers)
3. Update TypeScript types in `src/types/index.ts`
4. Update API functions in `src/lib/database.ts`
5. Apply migration via Supabase dashboard/CLI

---

## Quick Reference

### Key Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Lint code
```

### Key Paths
```
@/components/ui/        # shadcn/ui components
@/lib/database.ts       # API layer
@/lib/supabase.ts       # Supabase client
@/types/index.ts        # Type definitions
@/store/               # Zustand stores
```

### Key Imports
```typescript
import { Button } from "@/components/ui/button"
import { tipsApi } from "@/lib/database"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
```

### Useful Links
- Vite Docs: https://vitejs.dev/
- React Router: https://reactrouter.com/
- Supabase Docs: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/
- Zustand: https://github.com/pmndrs/zustand
- Leaflet: https://leafletjs.com/

---

## Project Status & Roadmap

### Current State
- ✅ Core architecture implemented
- ✅ Authentication system
- ✅ Tip feed with CRUD operations
- ✅ Like/save/comment functionality
- ✅ User profiles and stats
- ✅ Map view
- ✅ Category filtering
- ✅ PWA support
- ✅ Mobile-first responsive design

### Future Enhancements
- ⏳ Real-time updates (Supabase subscriptions)
- ⏳ Image upload to Supabase Storage
- ⏳ Push notifications
- ⏳ Advanced search/filtering
- ⏳ User following/followers
- ⏳ Direct messaging
- ⏳ Moderation tools
- ⏳ Analytics dashboard

---

*Last Updated: 2025-11-15*
*Codebase Version: 0.1.0*
