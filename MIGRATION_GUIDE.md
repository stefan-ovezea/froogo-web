# Migration Guide: Flutter to Next.js 15 PWA

This document outlines the migration plan from the existing Flutter/Dart codebase to a Next.js 15 (App Router) React application. The new architecture leverages TypeScript, Tailwind CSS, Lucide React icons, and standard PWA capabilities.

## 1. File Mapping

### Models -> TypeScript Interfaces (`/types`)
- `lib/models/offers_data.dart` ➔ `types/offers-data.ts`
- `lib/models/product.dart` ➔ `types/product.ts`
- `lib/models/section.dart` ➔ `types/section.ts`
- `lib/models/store.dart` ➔ `types/store.ts`

### Screens -> Next.js App Router (`/app`)
- `lib/screens/main_screen.dart` ➔ `app/(main)/layout.tsx` (App Shell)
- `lib/screens/home_screen.dart` ➔ `app/(main)/page.tsx`
- `lib/screens/auth/login_screen.dart` ➔ `app/login/page.tsx`
- `lib/screens/auth/signup_screen.dart` ➔ `app/signup/page.tsx`
- `lib/screens/product_detail_screen.dart` ➔ `app/products/[id]/page.tsx`
- `lib/screens/search_screen.dart` ➔ `app/search/page.tsx`
- `lib/screens/settings_screen.dart` ➔ `app/settings/page.tsx`
- `lib/screens/shopping_list_screen.dart` ➔ `app/shopping-list/page.tsx`
- `lib/screens/store_detail_screen.dart` ➔ `app/stores/[id]/page.tsx`

### Widgets -> React Components (`/components`)
- `lib/widgets/filter_chips.dart` ➔ `components/ui/filter-chips.tsx`
- `lib/widgets/product_card.dart` ➔ `components/product-card.tsx`
- `lib/widgets/search_overlay.dart` ➔ `components/search-overlay.tsx`
- `lib/widgets/store_logo.dart` ➔ `components/store-logo.tsx`
- `lib/widgets/store_section_card.dart` ➔ `components/store-section-card.tsx`

### Services & Config -> Library & Utilities (`/lib`)
- `lib/firebase_options.dart` ➔ `lib/firebase/config.ts`
- `lib/services/firebase_service.dart` ➔ `lib/firebase/firestore.ts`
- `lib/services/auth_service.dart` ➔ `lib/firebase/auth.ts`
- `lib/services/offers_service.dart` ➔ `lib/services/offers.ts`

### Providers -> React Contexts & Hooks (`/contexts` & `/hooks`)
- `lib/providers/auth_provider.dart` ➔ `contexts/auth-context.tsx` & `hooks/useAuth.ts`
- `lib/providers/theme_provider.dart` ➔ `contexts/theme-context.tsx` & `hooks/useTheme.ts`
- `lib/providers/offers_provider.dart` ➔ `contexts/offers-context.tsx`
- `lib/providers/shopping_list_provider.dart` ➔ `contexts/shopping-list-context.tsx`
- `lib/providers/watchlist_provider.dart` ➔ `contexts/watchlist-context.tsx`

---

## 2. Architecture: `useFirestore` Hook

To replace Flutter's streams and futures, we will implement a custom `useFirestore` React hook that handles read-only data fetching with SWR-like caching or real-time listeners where needed.

```typescript
// hooks/useFirestore.ts
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useFirestore<T>(collectionName: string, queryConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    // For read-only fast fetching (replace with onSnapshot if real-time updates are strictly needed)
    getDocs(q).then((snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
      setData(results);
    }).catch(err => {
      setError(err);
    }).finally(() => {
      setLoading(false);
    });
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
}
```

---

## 3. Theming System: CSS Variables + Tailwind

The existing Dart `ThemeProvider` will be replaced with a React Context controlling global CSS variables mapped to Tailwind configuration. 

**`app/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ...brand colors */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
  }
}
```

**`tailwind.config.ts`**
```typescript
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        // ...
      }
    }
  }
}
```
A `ThemeProvider` will inject the current theme class (`light`, `dark`, `brand-custom`) onto the `<html>` document tag and sync state via `localStorage`.

---

## 4. PWA Integration

We will implement standard service worker registration and a manifest for native-like installability on mobile.

1. **Manifest**: Add `manifest.json` to the `/public` directory along with masked and standardized app icons (copied from `web/icons/` and `assets/icon/`).
2. **Next.js PWA Plugin**: Configure `@ducanh2912/next-pwa` in `next.config.mjs` to auto-generate the service worker.

```javascript
// next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",
  sw: "service-worker.js",
});

export default withPWA({
  reactStrictMode: true,
});
```
