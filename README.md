# Components Library MTX

A premium, full-stack components library designed for modern React applications, specifically optimized for **Next.js 15+** using **Server Actions**, **Cache Components**, and **React Query**.

## 🚀 Features

- **Next.js 15+ Ready**: Optimized for the latest Next.js features.
- **Server Actions**: Type-safe mutation handling with built-in revalidation support.
- **Cache Components**: Native support for `"use cache"` and `"use cache: private"` patterns.
- **Universal Data Hook**: Flexible `useData` hook for client-side fetching with TanStack Query.
- **Full-Stack Auth**: Built-in authentication actions and session management.
- **Premium UI Components**: Sleek, accessible components built with Tailwind CSS and Framer Motion.

## 📦 Installation

```bash
bun add components-library-mtx
```

## 🛠️ Next.js 15+ Setup Guide

To get the most out of this library in a Next.js 15 environment, we recommend the following structure.

### 1. Configure API Clients

Create separate client and server API instances to handle session tokens correctly.

```typescript
// lib/api/client.ts (Client Side)
import { createClient } from "components-library-mtx/api";

export const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  companyId: process.env.NEXT_PUBLIC_COMPANY_ID!,
});

// lib/api/server.ts (Server Side)
import { createServerClient } from "components-library-mtx/api";
import { cookies } from "next/headers";

export const serverApi = createServerClient(
  {
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
    companyId: process.env.NEXT_PUBLIC_COMPANY_ID!,
  },
  {
    getAuthToken: async () => (await cookies()).get("auth_token")?.value,
    setAuthToken: async (token) => {
      (await cookies()).set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    },
    removeAuthToken: async () => {
      (await cookies()).delete("auth_token");
    },
  },
);
```

### 2. Implement Data Access Layer (DAL)

Leverage Next.js 15 Cache Components for efficient server-side data fetching.

```typescript
// lib/api/dal.ts
"use cache: private";

import { createDal } from "components-library-mtx/dal";
import { cacheLife, cacheTag } from "next/cache";
import { serverApi } from "./server";

const dal = createDal({
  api: serverApi,
  cacheLife: () => cacheLife("hours"),
  cacheTag,
});

export const getSession = async () => await dal.auth.getCurrentUser();
export const getJewelries = async (params?: any) =>
  await dal.jewelries.findMany(params);
export const getStones = async (params?: any) =>
  await dal.stones.findMany(params);
```

### 3. Setup Server Actions

Create type-safe server actions for mutations like authentication or bookmarks.

```typescript
// lib/api/actions.ts
"use server";

import {
  createAuthActions,
  createBookmarkActions,
} from "components-library-mtx/actions";
import { updateTag } from "next/cache";
import { serverApi } from "./server";

const deps = { api: serverApi, revalidateTag: updateTag };

export const { signIn, signUp, signOut } = createAuthActions(deps);
export const { toggleBookmark } = createBookmarkActions(deps);
```

### 4. Setup Client Hooks

Initialize the `useData` hook for client-side interactions.

```typescript
// hooks/use-data.ts
import { createUseData } from "components-library-mtx/hooks";
import { client } from "@/lib/api/client";
import { createDal } from "components-library-mtx/dal";

// Minimal DAL for client-side hooks (no caching needed here as Query handles it)
const clientDal = createDal({ api: client });

export const useData = createUseData({
  api: client,
  dal: clientDal,
});
```

### 5. Configure Root Provider

Wrap your application in the `LibraryProvider` to enable React Query and the configuration.

```tsx
// app/providers.tsx
"use client";

import { LibraryProvider } from "components-library-mtx";
import { useRouter } from "next/navigation";
import "@components-library-mtx/style.css";

export default function Providers({ children }) {
  const router = useRouter();

  return (
    <LibraryProvider
      config={{
        router,
        showDevTools: process.env.NODE_ENV === "development",
      }}
    >
      {children}
    </LibraryProvider>
  );
}
```

```tsx
// app/layout.tsx
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 📖 Usage Examples

### Fetching in Server Components (using DAL)

```tsx
import { getJewelries } from "@/lib/api/dal";

export default async function Page() {
  const jewelries = await getJewelries({ per_page: 10 });

  return <div>{/* Render your data */}</div>;
}
```

### Fetching in Client Components (using useData)

```tsx
"use client";

import { useData } from "@/hooks/use-data";

export function JewelryList() {
  const { data, isLoading } = useData({
    resource: "jewelries",
    params: { category: "Rings" },
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* Render data */}</div>;
}
```

### Using Server Actions

```tsx
"use client";

import { toggleBookmark } from "@/lib/api/actions";
import { toast } from "sonner";
import { useToggleBookmark } from "components-library-mtx/hooks";

export function BookmarkButton({ item }) {
  const { mutate, isPending } = useToggleBookmark(toggleBookmark);

  return (
    <button
      onClick={() =>
        mutate({
          id: item.type === "diamond" ? item.stone_id! : item.jewelry_id!,
          type: item.type as "stone" | "jewelry" | "diamond",
          isBookmarked: true,
        })
      }
      disabled={isPending}
    >
      Save
    </button>
  );
}
```
