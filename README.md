# Components Library MTX

A premium components library built with React, Tailwind CSS, and Framer Motion. This library provides a unified interface for UI components, API clients, Data Access Layers (DAL), and hooks, specifically optimized for Next.js applications.

## Installation

```bash
bun add components-library-mtx
```

## Setup

### 1. Styles

Import the library's styles in your main entry point (e.g., `layout.tsx` or `_app.tsx`):

```tsx
import "components-library-mtx/style.css";
```

### 2. Library Provider

Wrap your application with the `LibraryProvider` to provide configuration to all components and hooks. You can use the `defineConfig` helper to easily define your configuration with type-safety and apply standard default settings (like `theme: "light"`, `rippleEffect: true`, and default component tags/wrappers).

```tsx
// app/providers.tsx
"use client";

import { LibraryProvider, defineConfig } from "components-library-mtx";
import { useRouter } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const config = defineConfig({
    router,
    enableDevtools: process.env.NODE_ENV === "development",
  });

  return <LibraryProvider config={config}>{children}</LibraryProvider>;
}
```

## Infrastructure Setup

### 1. API Route Handler (Next.js)

The library includes a pre-configured [Elysia](https://elysiajs.com/) app factory that you can mount directly into a Next.js App Router route handler.

```tsx
// app/api/[[...slug]]/route.ts
import { createApiApp } from "components-library-mtx/api/routes";

const app = createApiApp({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  companyId: process.env.NEXT_PUBLIC_COMPANY_ID!,
});

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;
```

### 2. API Client (`components-library-mtx/api`)

The API client is built on top of [Elysia Eden](https://elysiajs.com/eden/overview.html) and [ky](https://github.com/sindresorhus/ky).

```tsx
// lib/api.ts
import { createClient, nextSync } from "components-library-mtx/api";

export const api = createClient({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  hooks: nextSync(), // Automatically handles auth tokens in Next.js
});
```

### 3. Server Actions (`components-library-mtx/actions`)

Define your server-side actions by injecting the API client and cache revalidation logic.

```tsx
// lib/actions.ts
"use server";

import {
  createAuthActions,
  createBookmarkActions,
} from "components-library-mtx/actions";
import { revalidateTag } from "next/cache";
import { api } from "./api";

const deps = { api, revalidateTag };

export const { signIn, signUp, signOut } = createAuthActions(deps);
export const { toggleBookmark } = createBookmarkActions(deps);
```

### 4. Shared Hooks Setup (`components-library-mtx/hooks`)

Create a shared instance of the `useData` hook to be used throughout your client components.

```tsx
// hooks/use-data.ts
"use client";

import { createUseData } from "components-library-mtx/hooks";
import { api } from "@/lib/api";

export const useData = createUseData({ api });
```

## Data Access Layer (`components-library-mtx/dal` - optional)

The DAL is designed for server-side data fetching with built-in support for Next.js caching.

```tsx
// lib/dal.ts
"use cache: private";

import { createDal } from "components-library-mtx/dal";
import { cacheLife, cacheTag } from "next/cache";
import { api } from "./api";

export const dal = createDal({
  api,
  cacheLife: (profile) => cacheLife(profile),
  cacheTag,
});

// Example usage
export const getSession = async () => await dal.auth.getCurrentUser();
```

## Client-side Usage

### Data Fetching with `useData`

The `useData` hook provides a type-safe way to fetch resources from the API.

```tsx
import { useData } from "@/hooks/use-data";

export function MyComponent() {
  const { data, isLoading } = useData({
    resource: "jewelries",
    params: { page: 1, per_page: 20 },
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>Found {data?.data.length} items</div>;
}
```

#### Supported Resources

| Resource     | Description                                       | Returns                                                                                        |
| :----------- | :------------------------------------------------ | :--------------------------------------------------------------------------------------------- |
| `session`    | Get current user session.                         | [`User`](./src/api/types.ts#L251) \| null                                                      |
| `bookmarks`  | Get user bookmarks.                               | [`BookmarkResponse`](./src/api/types.ts#L243) \| null                                          |
| `jewelries`  | Search and list jewelry items.                    | [`JewelryResponse`](./src/api/types.ts#L114)                                                   |
| `stones`     | Search and list stones/diamonds.                  | [`StoneResponse`](./src/api/types.ts#L203)                                                     |
| `properties` | Get filter properties (categories, metals, etc.). | [`JewelryProperties`](./src/api/types.ts#L281) \| [`StoneProperties`](./src/api/types.ts#L297) |
| `quotes`     | List user quotes.                                 | [`QuoteResponse`](./src/api/types.ts#L227)                                                     |

### Form Handling with `useFormAction`

Seamlessly integrate `react-hook-form` with Next.js Server Actions.

```tsx
import { useFormAction } from "components-library-mtx/hooks";
import { signIn } from "@/lib/actions"; // Your server action
import { loginSchema } from "@/lib/schemas";

export function LoginForm() {
  const { form, onSubmit, isPending } = useFormAction({
    action: signIn,
    schema: loginSchema,
    defaultValues: {
      email: "",
    },
    onSuccess: () => router.push("/dashboard"),
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...form.register("email")} />
      <button type="submit" disabled={isPending}>
        Login
      </button>
    </form>
  );
}
```

### Bookmark Management

Example of using `useToggleBookmark` mutation hook.

```tsx
"use client";

import { useToggleBookmark } from "components-library-mtx/hooks";
import { toggleBookmark } from "@/lib/actions";
import { useData } from "@/hooks/use-data";

export function BookmarksList() {
  const { data: bookmarks } = useData({ resource: "bookmarks" });
  const { mutate, isPending } = useToggleBookmark(toggleBookmark);

  return (
    <div>
      {bookmarks?.data.map((bookmark) => (
        <div key={bookmark.id}>
          {bookmark.item.item_no}
          <button
            disabled={isPending}
            onClick={() =>
              mutate({
                id: bookmark.stone_id || bookmark.jewelry_id,
                type: bookmark.item.type,
                isBookmarked: true,
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Filter Hooks

Manage complex search and filter states in the URL automatically. These hooks leverage [`nuqs`](https://nuqs.47ng.com/)'s `useQueryStates` under the hood to parse, serialize, and synchronize UI state with the browser query string in a type-safe manner.

They return a `[filters, setFilters]` tuple, where:

- **`filters`**: An object containing the current URL parameters (all typed as strings or floats).
- **`setFilters`**: A function to update the query state, which accepts partial updates or `null` to clear a parameter from the URL.

- [`useJewelryFilters()`](./src/hooks/use-jewelry-filters.ts): Manages URL filters for jewelry searches (categories, metals, sizes, prices, weights, etc.).
- [`useStoneFilters()`](./src/hooks/use-stone-filters.ts): Manages URL filters for loose stones/diamonds (shape, color, clarity, cut, carats, etc.).

#### Example Usage

Here is how you can use `useJewelryFilters` in combination with the `useData` hook to implement a real-time, URL-synced search interface:

```tsx
"use client";

import { useJewelryFilters } from "components-library-mtx/hooks";
import { useData } from "@/hooks/use-data";

export function JewelrySearch() {
  const [filters, setFilters] = useJewelryFilters();

  // Pass the URL filter state directly to useData as query params
  const { data, isLoading } = useData({
    resource: "jewelries",
    params: filters,
  });

  return (
    <div className="space-y-4">
      {/* Search Input synced with URL 'item_no' */}
      <input
        type="text"
        placeholder="Search item no..."
        value={filters.item_no ?? ""}
        onChange={(e) => setFilters({ item_no: e.target.value || null })}
        className="border p-2 rounded"
      />

      {/* Category Dropdown synced with URL 'category' */}
      <select
        value={filters.category ?? ""}
        onChange={(e) => setFilters({ category: e.target.value || null })}
        className="border p-2 rounded ml-2"
      >
        <option value="">All Categories</option>
        <option value="Rings">Rings</option>
        <option value="Necklaces">Necklaces</option>
      </select>

      {isLoading ? (
        <div>Loading items...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data?.data?.map((item) => (
            <div key={item.id} className="border p-4 rounded">
              <h3>{item.item_no}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Components (`components-library-mtx/button`)

Basic UI components following a consistent design system.

```tsx
import { Button } from "components-library-mtx/button";

export function Example() {
  return (
    <Button variant="primary" size="lg" onClick={() => console.log("Clicked!")}>
      Click Me
    </Button>
  );
}
```
