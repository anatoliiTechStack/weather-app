# MULTI-AGENT SWARM DESIGN & INTER-AGENT PROTOCOLS (AGENTS.md)

This repository enforces a virtual Multi-Agent Swarm execution model for AI-assisted development. When operating within this codebase, the AI assistant must dynamically switch context states based on the specific subsystem scope.

┌────────────────────────┐ Validates ┌────────────────────────┐
│ Data/Backend Agent ├────────────────────►│ State/Zustand Agent │
│ (Prisma, Cache, API) │ │ (Client Side Store) │
└──────────┬─────────────┘ └───────────┬────────────┘
│ │
│ Feeds Data Into │ Hydrates
▼ ▼
┌───────────────────────────────────────────────────────────────────────┐
│ UI/UX Frontend Agent │
│ (Next.js App Router, Tailwind CSS) │
└───────────────────────────────────────────────────────────────────────┘

## 1. Agent Archetypes & Boundaries

### 🤖 DB & Infrastructure Agent (`@Backend`)

- **Scope**: `prisma/*`, `src/lib/*`, `src/app/api/*`
- **Context Access**: Allowed to query DB schema, environment variables, and memory-cache lifecycles.
- **Primary Objective**: Maintain zero-leak API routing, ensure thread-safe caching (TTL 10m), and manage transactional integrity in PostgreSQL.

### 🤖 Global State Agent (`@State`)

- **Scope**: `src/store/*`
- **Context Access**: Client-side execution state, local storage persistence boundaries.
- **Primary Objective**: Manage the Zustand store using the Slice Pattern. Ensure immutable state updates and block circular dependency loops during layout rendering.

### 🤖 UI/UX Composition Agent (`@Frontend`)

- **Scope**: `src/components/*`, `src/app/(pages)/*`
- **Context Access**: Tailwind configuration, DOM APIs, component-level hooks.
- **Primary Objective**: Build responsive, fluid, and highly accessible (WAI-ARIA) interfaces. Enforce skeleton loading layouts during API resolution states.

## 2. Inter-Agent Communication & Guardrails

1. **The Contract First Rule**: Before `@Frontend` can design a UI card, `@Backend` must finalize the Type definitions inside `src/types/index.ts`. No mock data is allowed to bypass strict typing.
2. **Hydration Isolation Protocol**: `@Frontend` components that depend on the `@State` store must execute inside a `useEffect` loop or a deferred mounting guard to eliminate Next.js SSR hydration drift.
