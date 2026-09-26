---
name: postman-frontend
description: Frontend guidelines, architecture patterns, and conventions for the Postman web client built with React 19, TypeScript, Tailwind CSS, and TanStack Query.
---

# Postman Frontend Skill

A cutting-edge, dark-themed, glassmorphic API development and testing client built with React 19, TypeScript, Tailwind CSS, and TanStack Query.

## Stack & Architecture

- **Framework**: React 19 + Vite + TypeScript (Strict mode)
- **Styling**: Tailwind CSS with custom glassmorphism utilities (`backdrop-blur-xl`, translucent slate/obsidian layers, glowing borders, neon HTTP method badges)
- **Server State**: `@tanstack/react-query` (v5) for asynchronous caching, data synchronization, and optimistic UI updates
- **Client State**: Context API for Auth and Environment Variable Interpolation
- **Icons**: `lucide-react`
- **HTTP Client**: Axios / Fetch wrapper configured with JWT Bearer authentication interceptor and active environment variable resolver

## Project Structure

```
src/
├── api/                  # Direct API integration matching APIs.md
│   ├── client.ts         # Base HTTP client with JWT interceptor & base URL
│   ├── auth.api.ts       # Auth (register, login, profile)
│   ├── collection.api.ts # Collection & Folder CRUD
│   ├── request.api.ts    # Request CRUD & Execution (saved & unsaved)
│   └── environment.api.ts# Environment variables CRUD
├── context/
│   ├── AuthContext.tsx   # User profile, JWT token persistence, login/logout
│   └── EnvContext.tsx    # Active environment, {{key}} variable interpolator
├── components/
│   ├── auth/             # Login & Register modal / screen
│   ├── layout/           # Navbar, Sidebar, Header controls
│   ├── request/          # Method selector, URL bar, Params/Headers/Auth/Body tabs, Save modal
│   ├── response/         # Status badges, latency, payload size, JSON & Headers viewers
│   └── environment/      # Environments modal & Key-Value editor
├── types/                # Core TypeScript schemas & API contracts
├── utils/                # Helper utilities (JSON formatting, classnames)
├── App.tsx               # Main layout & QueryClientProvider
└── main.tsx              # React DOM entry
```

## Core Design Principles

1. **Dark Glassmorphic Aesthetic**:
   - Deep obsidian background (`bg-slate-950` / `bg-[#090d16]`).
   - Frosted translucent card overlays (`backdrop-blur-xl bg-white/[0.04] border border-white/[0.08]`).
   - Method colors:
     - `GET`: Neon Emerald (`text-emerald-400 bg-emerald-500/10 border-emerald-500/30`)
     - `POST`: Neon Amber (`text-amber-400 bg-amber-500/10 border-amber-500/30`)
     - `PUT`: Neon Sky (`text-sky-400 bg-sky-500/10 border-sky-500/30`)
     - `PATCH`: Neon Purple (`text-purple-400 bg-purple-500/10 border-purple-500/30`)
     - `DELETE`: Neon Rose (`text-rose-400 bg-rose-500/10 border-rose-500/30`)

2. **TanStack Query Rules**:
   - Use `useQuery` with descriptive keys: `['collections']`, `['folders', collectionId]`, `['environments']`, `['requests', collectionId]`.
   - Use `useMutation` with `queryClient.invalidateQueries` for instant synchronization upon create, update, and delete actions.

3. **Environment Interpolation**:
   - Any string formatted as `{{variableName}}` in URLs, headers, or body should automatically be resolved using the active environment variables before sending.

4. **Error Handling**:
   - Graceful toasts/banners for network failures, unauthorized tokens (with prompt to re-login), and invalid JSON syntax.
