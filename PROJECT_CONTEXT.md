# Froogo Project Context & Architecture

This document serves as the source of truth for the technical implementation of the Froogo Web/PWA.

## 1. Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (using `@custom-variant dark` for class-based theming)
- **Icons:** Lucide React
- **Database:** Firebase Firestore
- **State Management:** React Context (Auth, Theme, Offers, Watchlist)

## 2. Low-Cost Strategy (Critical)
To minimize Firebase read costs, the app uses a **Strict 12-Hour Client-Side Cache**:
- **Mechanism:** Data is fetched via `getDocs` (not real-time listeners) and stored in `localStorage`.
- **Logic:** `services/offers.ts` manages the `CACHE_EXPIRY`.
- **ID Generation:** Product IDs are generated client-side during the fetch/mapping process to enable SEO-friendly routing without storing IDs in the DB.

## 3. Current Implementation Status
- **Authentication:** Currently mocked in `contexts/auth-context.tsx` to keep the app "Open" for immediate use. 
- **Theming:** Functional Light/Dark mode toggle in `Settings`.
- **Data:** Home, Store Detail, and Product Detail pages are fully wired to Firestore with the caching layer.
- **Shopping List:** Fully functional using `localStorage` through `WatchlistProvider`.

## 4. Internationalization
- **Primary Language:** Romanian (RO). All UI strings, labels, and placeholders must be in Romanian, regardless of the design source.

## 5. Responsive Strategy
- The app must be fully responsive, behaving as a desktop-optimized web app on large screens and a native-like PWA on mobile.
- **Requirement:** Implement a `PlatformProvider` to globally track the view state.
