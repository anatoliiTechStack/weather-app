# REPOSITORY SPECIFICATION & AI ONBOARDING DIRECTIVE (CLAUDE.md)

## 1. System Environment & Commands

- **Node Runtime**: Node.js v20+ / npm
- **Framework**: Next.js 14 (App Router)
- **Local Dev**: `npm run dev` (Runs on `localhost:3000`)
- **Production Build**: `npm run build` -> `npm run start`
- **Database Migrations**: `npx prisma migrate dev`
- **Database Studio**: `npx prisma studio`

## 2. Architecture & Directory Graph

```text
src/
├── app/                  # Routing Layer & Server Components
│   ├── api/              # Secure Edge/Serverless Endpoints (Backend)
│   └── layout.tsx        # Global Hydration & Shell
├── components/           # UI Layer
│   ├── ui/               # Atom-level functional components (stateless)
│   └── weather/          # Feature-level components (composed logic)
├── lib/                  # Infrastructure Layer
│   ├── db.ts             # Prisma Client singleton
│   └── cache.ts          # Time-Based In-Memory Caching (TTL: 600s)
├── services/             # Core Business Logic Layer (Pure Server-Side)
│   └── weather.service.ts# OpenWeatherMap Integration & Timezone Calculators
└── store/                # Client State Layer (Zustand client-side state)
```
