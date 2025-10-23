Zuperior Frontend Code Review Report

Summary
- Stack: Next.js 15 (app router), React 19, Redux Toolkit + Persist, TypeScript.
- Scope reviewed: app routes (API proxies), store slices, services, libs, and selected components.
- Key risks: Inconsistent auth flow (Redux vs localStorage), missing API route used by services, mixed transport/content-type defaults, mock endpoints shipped to prod code, and noisy logging.

Critical Issues
- Auth state split between Redux and localStorage (causes redirects and unauthorized calls)
  - UI checks Redux (`state.auth.token` / `state.auth.clientId`) for access control, but login/register flows write only to localStorage via `authService.setAuthData`.
  - Examples:
    - Auth gating: `zuperior-front/src/lib/withAuth.tsx:18` (uses `state.auth.clientId`)
    - Terminal layout: `zuperior-front/src/app/terminal/layout.tsx:10` (uses `state.auth.token`)
    - Login/Register flow: `zuperior-front/src/app/login/_components/auth-form.tsx` uses `authService.login/register` and writes to localStorage, not Redux.
  - Result: After login, Redux remains empty → protected views redirect to `/login`, thunks using Redux token 401.
  - Fix options:
    - On successful login/register, dispatch a Redux action to set `auth.token` + `auth.clientId` in store; or
    - Remove Redux auth slice and read the cookie/localStorage consistently in hooks; or
    - Hydrate Redux from cookies/localStorage on app start.

- Service calls an API route that doesn’t exist in Next
  - `zuperior-front/src/services/api.service.ts:246` uses `GET /api/deposit/transactions/:accountId`.
  - There is no Next.js route implementing this path; the working backend path is `/api/transactions/database` and is already proxied by `src/app/api/transactions/database/route.ts`.
  - Fix: Point the UI to `/api/transactions/database?accountId=...` (or call the backend route via the existing proxy helper).

- Mock admin stats endpoint shipped with app
  - `zuperior-front/src/app/api/admin/stats/dashboard/route.ts` returns static mock data.
  - Admin dashboards relying on this won’t reflect real backend data.
  - Fix: Proxy to backend `GET /api/admin/stats/dashboard` (when the backend controller is corrected) or remove admin pages until backend is ready.

High Priority
- Conflicting login implementations
  - Old Redux slice expects Skale-style responses (`status_code`, `object._token`): `zuperior-front/src/store/slices/authSlice.ts:23, 36`.
  - Current app login/register uses `authService` and expects backend JSON (`token`, `clientId`): `zuperior-front/src/app/login/_components/auth-form.tsx`.
  - Fix: Remove or refactor the legacy `authSlice.ts`; unify on one login flow and one source of truth for auth.

- Overly verbose logging in production paths
  - Many files log large payloads or internal details, e.g. `mt5AccountSlice.ts` has numerous console logs of transformed data.
  - Fix: Gate debug logs by `process.env.NODE_ENV !== 'production'` or a feature flag. Prefer a logger with levels.

- CORS and auth expectation mismatch with backend
  - Frontend proxy for `GET /api/mt5/groups` requires Authorization header, while backend route is public.
  - Fix: Align both sides (either require auth on backend or stop requiring it in the proxy).

Medium Priority
- Axios default content-type misaligned with usage
  - `zuperior-front/src/lib/axios.ts` sets `"Content-Type": "application/x-www-form-urlencoded"` globally even when most proxies use JSON bodies.
  - Fix: Default to JSON; only set `x-www-form-urlencoded` for endpoints that need it (build `URLSearchParams` as needed).

- Multiple proxies to external systems mixed with internal BE
  - Coexistence of Skale API proxies (e.g., `/api/deposit`, `/api/get-user`) with the new Express backend proxies causes user and transaction flows to diverge.
  - Fix: Choose a single source (prefer the new backend), deprecate old proxy routes, and update UI to rely on one path.

- Access token handling in server contexts
  - Interceptors (both in `lib/axios.ts` and `services/api.service.ts`) read from `localStorage`, which doesn’t exist in server-side routes. Guards exist, but be mindful when calling these from Next API routes—prefer reading the `Authorization` header and passing it along.

Low Priority
- CORS headers in Next proxies
  - `zuperior-front/src/app/api/proxy/users/route.ts` adds `Access-Control-Allow-Origin: *` in responses. For same-origin calls this is redundant.

- Persist configuration breadth
  - Many slices are persisted by default (`store/index.ts`). Consider whitelisting only what is essential to reduce stale state issues.

Repeated Root Causes
- Dual auth state (Redux vs localStorage/cookies) → UI thinks user is logged out, while API calls succeed or vice versa.
- Stale/legacy endpoints kept alongside new backend routes → 404s or data mismatches.
- Logging of large or sensitive payloads → noisy console and potential privacy risks.

Actionable Fix Plan (ordered)
1) Unify authentication
   - On successful login/register (in `auth-form.tsx`), dispatch a Redux action to set `auth.token` and `auth.clientId`. Alternatively, deprecate Redux auth and centralize on cookie/localStorage + a hook to read it.

2) Fix transaction API usage
   - Replace calls to `/api/deposit/transactions/:accountId` with `/api/transactions/database` via the existing Next proxy (`src/app/api/transactions/database/route.ts`).

3) Remove mock admin stats route
   - Proxy to real backend once backend stats endpoints are corrected; otherwise feature-flag admin pages.

4) Adjust axios defaults
   - In `src/lib/axios.ts`, default to JSON and set `x-www-form-urlencoded` only for the handful of endpoints that use it.

5) Reduce logging
   - In Redux slices and API routes, wrap console logs behind `if (process.env.NODE_ENV !== 'production')` and redact sensitive fields.

Notable File References
- Auth gating (Redux): `zuperior-front/src/lib/withAuth.tsx:18`, `zuperior-front/src/app/terminal/layout.tsx:10`
- Login/Register flow: `zuperior-front/src/app/login/_components/auth-form.tsx:1`
- Legacy Redux auth slice: `zuperior-front/src/store/slices/authSlice.ts:1`
- Broken service path: `zuperior-front/src/services/api.service.ts:246`
- Mock admin stats: `zuperior-front/src/app/api/admin/stats/dashboard/route.ts:1`
- Axios defaults: `zuperior-front/src/lib/axios.ts:1`

