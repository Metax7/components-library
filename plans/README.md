# Implementation Plans Index

> **Audited Package:** `packages/core` (`components-library-mtx`)
> **Baseline Commit:** `cbb9dfd`
> **Generated:** 2026-08-26

---

## Plan Status Table

| Plan | Title | Category | Impact | Effort | Risk | Status |
|---|---|---|---|---|---|---|
| [001](001-fix-tenant-isolation.md) | Fix Tenant Isolation Bypass in Route Handlers | Security | **HIGH** | S | LOW | `DONE` |
| [002](002-fix-ky-prefixurl.md) | Fix Ky Base URL Configuration (`prefixUrl`) | Correctness | **HIGH** | S | LOW | `TODO` |
| [003](003-fix-client-url-and-protocol.md) | Fix Protocol & Path Stripping in Eden Treaty Client | Security | **HIGH** | S | LOW | `TODO` |
| [004](004-fix-usedata-error-handling.md) | Fix Inconsistent Error Handling in `useData` | Correctness | **HIGH** | S | LOW | `DONE` |
| [005](005-lazy-load-devtools.md) | Lazy Load React Query Devtools in `LibraryProvider` | Performance | **HIGH** | S | LOW | `DONE` |
| [006](006-safeguard-error-handling-in-provider.md) | Safeguard & Deduplicate Provider Error Handling | Correctness | **MEDIUM** | S | LOW | `DONE` |
| [007](007-fix-logout-token-cleanup.md) | Fix Logout Token & Cookie Cleanup on Expired Session | Correctness | **MEDIUM** | S | LOW | `DONE` |
| [008](008-merge-ky-options-hooks.md) | Properly Merge Custom `kyOptions.hooks` | Correctness | **MEDIUM** | S | LOW | `DONE` |
| [009](009-consolidate-validation-libraries.md) | Consolidate Validation Libraries (Drop Yup) | Performance | **HIGH** | M | LOW | `DONE` |
| [010](010-standardize-dal-return-types-and-helpers.md) | Standardize DAL Return Types & Query Helpers | Architecture | **HIGH** | M | MEDIUM | `DONE` |
| [011](011-allow-external-query-client-in-provider.md) | Allow External QueryClient in `LibraryProvider` | Architecture | **HIGH** | M | MEDIUM | `DONE` | Exec: daa5ce9 |
| [012](012-fix-stone-types.md) | Fix Overly Strict Literal Types in `Stone` Interface | Correctness | **MEDIUM** | S | LOW | `TODO` |
| [013](013-export-button-variants.md) | Export `buttonVariants` & Derive `ButtonProps` | DX | **MEDIUM** | S | LOW | `TODO` |
| [014](014-update-peer-dependencies-and-external-builds.md) | Update Peer Dependencies & Tsdown Externals | DX / Build | **HIGH** | S | MEDIUM | `DONE` | Exec: a9f9e5c |
| [015](015-setup-testing-framework.md) | Setup Testing Framework & Baseline Test Suite | Testing | **HIGH** | M | LOW | `TODO` |
| [016](016-clean-type-casts-and-add-jsdoc.md) | Clean Type Casts & Add Comprehensive JSDoc | DX | **MEDIUM** | M | LOW | `TODO` |
| [017](017-fix-ky-v2-api-and-suppress-client-toast-errors.md) | Fix ky v2 API (`prefixUrl` → `baseUrl`) & Suppress Toast Errors on Hydration | Security / UX | **HIGH** | S | LOW | `DONE` |

---

## Recommended Execution Order

### Phase 1: High-Leverage Security & Correctness Bug Fixes (Execute First)

1. **[Plan 001](001-fix-tenant-isolation.md)** — Prevent tenant ID override across Elysia API and Auth routes.
2. **[Plan 002](002-fix-ky-prefixurl.md)** — Fix `prefix` to `prefixUrl` typo in Ky configuration.
3. **[Plan 003](003-fix-client-url-and-protocol.md)** — Preserve HTTPS protocol and subpaths in Eden Treaty client.
4. **[Plan 007](007-fix-logout-token-cleanup.md)** — Ensure local cookie/token cleanup on logout regardless of backend status.
5. **[Plan 008](008-merge-ky-options-hooks.md)** — Prevent custom `kyOptions` from overriding internal auth hooks.

### Phase 2: Testing Baseline & Type Definitions

1. **[Plan 015](015-setup-testing-framework.md)** — Setup `bun test` runner and initial test suite.
2. **[Plan 012](012-fix-stone-types.md)** — Relax `Stone` interface literal types.
3. **[Plan 013](013-export-button-variants.md)** — Export `buttonVariants` from Button component.

### Phase 3: Client Hooks & Provider Improvements

1. **[Plan 011](011-allow-external-query-client-in-provider.md)** — Support external `queryClient` and `disableToaster` in `LibraryProvider`. ✅
2. **[Plan 004](004-fix-usedata-error-handling.md)** — Standardize error throwing across all 6 `useData` resources.
3. **[Plan 005](005-lazy-load-devtools.md)** — Lazy load `@tanstack/react-query-devtools` to avoid production leaks.
4. **[Plan 006](006-safeguard-error-handling-in-provider.md)** — Safeguard `response.clone().json()` and deduplicate cache error logic.

### Phase 4: Architecture Refactoring & Dependency Consolidation

1. **[Plan 009](009-consolidate-validation-libraries.md)** — Remove Yup dependency and standardize `useFormAction` on Zod 4.
2. **[Plan 010](010-standardize-dal-return-types-and-helpers.md)** — Extract `executeQuery` helper in DAL and unify return types.
3. **[Plan 014](014-update-peer-dependencies-and-external-builds.md)** — Support React 18/19 peer deps and configure tsdown externals.
4. **[Plan 016](016-clean-type-casts-and-add-jsdoc.md)** — Clean remaining `any` casts and add JSDoc across public APIs.

---

## Dependency Graph

```mermaid
graph TD
    P15[015: Setup Testing Framework] --> P01[001: Fix Tenant Isolation]
    P15 --> P02[002: Fix Ky prefixUrl]
    P15 --> P03[003: Fix Client Protocol]
    P15 --> P07[007: Fix Logout Cleanup]
    P15 --> P08[008: Merge Ky Hooks]
    
    P04[004: Fix useData Errors] --> P10[010: Standardize DAL]
    P05[005: Lazy Load DevTools] --> P17[017: Ky v2 Migration (DONE)]

    P09[009: Consolidate Validation] --> P16[016: Clean Type Casts & JSDoc]
    P12[012: Fix Stone Types] --> P16
    P13[013: Export Button Variants] --> P16
    P14[014: Peer Deps & Externals] --> P16
```
