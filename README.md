# Weather App

Full-stack weather application built with Next.js. Search cities, view current conditions and a 3-day forecast, open detailed weather insights (UV, sunrise/sunset, clothing tips), and manage favorite cities. Data is fetched from OpenWeatherMap, persisted in PostgreSQL, and cached on the server to limit upstream API usage.

## Features

- **Home** (`/`) — city search, current weather summary, 3-day forecast, recent search history
- **Weather details** (`/weather/[city]`) — humidity, wind, UV index, local sunrise/sunset, outfit recommendations
- **Favorites** (`/favorites`) — saved cities with quick navigation to details
- Server-side API routes (no API keys exposed to the browser)
- In-memory cache with stale-while-revalidate (10-minute TTL)
- Zod validation for OpenWeatherMap payloads

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL + Prisma |
| Client state | Zustand |
| Styling | Tailwind CSS |
| External API | OpenWeatherMap |

## Prerequisites

- **Node.js** 20+
- **npm**
- **PostgreSQL** (local or hosted)
- [OpenWeatherMap API key](https://openweathermap.org/api)

> **UV index:** loaded via the One Call 2.5 endpoint (`/onecall`). Some free keys do not include One Call; if UV is unavailable, the UI shows `N/A` while other fields still work.

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd weather-app
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/weather_app` |
| `OPENWEATHERMAP_API_KEY` | API key from OpenWeatherMap |
| `OWM_BASE_URL` | *(optional)* defaults to `https://api.openweathermap.org/data/2.5` |

### 3. Database

Create the database, then apply migrations:

```bash
npm run db:migrate
```

For production-style apply (also used by `npm run dev`):

```bash
npx prisma migrate deploy
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` runs `prisma migrate deploy` before starting Next.js so the schema is up to date.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Migrate DB + start dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create/apply migrations (development) |
| `npm run db:studio` | Prisma Studio GUI |

## Why Zustand?

This project uses **Zustand** for client-side state instead of Redux, MobX, or React Context alone.

- **Small API** — a single store (`useWeatherStore`) holds weather data, favorites, search history, and loading/error flags without boilerplate.
- **No providers** — components import the hook directly; no wrapper tree around the app shell.
- **Async-friendly** — actions (`fetchWeather`, `loadFavorites`, etc.) map cleanly to `fetch` calls against Next.js API routes.
- **Selectors** — components subscribe only to the slices they need, which keeps re-renders predictable on pages that share the same store (home, details, favorites).
- **SSR-safe usage** — interactive screens are client components; data is loaded in `useEffect` or after user actions, avoiding hydration mismatches from server/client state divergence.

For a focused weather UI with a handful of related fields, Zustand is simpler than MobX/MST while remaining explicit and easy to test.

## Caching implementation

Weather responses are cached in **`src/lib/cache.ts`** (`MemoryCache`) and used from **`/api/weather`**.

### Behavior (stale-while-revalidate)

1. **Cache miss** — the route calls OpenWeatherMap (current + forecast + optional One Call for UV), stores the result, and returns it.
2. **Fresh hit** (within **10 minutes**, `CACHE_TTL_MS = 600_000`) — the cached JSON is returned immediately; OpenWeatherMap is not called.
3. **Stale hit** (after TTL) — the **stale** payload is still returned immediately; a **background** refresh updates the cache for the next request. Failed background refreshes keep serving stale data.

### Other details

- **Per-city keys** — `weather:city:{normalizedCityName}`.
- **In-flight deduplication** — concurrent requests for the same key share one upstream `Promise`.
- **Process lifetime** — in-memory `Map` on the Node.js server (suitable for a single instance; use Redis for multi-instance production if needed).

This matches the assignment goal: fewer redundant OpenWeatherMap calls while keeping responses fast after the first lookup.

## Project structure

```text
src/
├── app/                    # Routes (thin) + API handlers
│   ├── api/weather/        # GET weather by city
│   ├── api/favorites/      # Favorites CRUD
│   ├── api/search-history/
│   ├── page.tsx            # Home
│   ├── weather/[city]/     # Details
│   └── favorites/
├── components/
│   ├── screens/            # Page compositions (home, details, favorites)
│   └── …                   # Shared UI (SearchInput, WeatherMain, etc.)
├── services/               # OpenWeatherMap + business logic
├── store/                  # Zustand (useWeatherStore)
├── lib/                    # db, cache, helpers
└── types/                  # Shared DTOs
prisma/                     # Schema + migrations
```

See also **`AGENTS.md`** and **`CLAUDE.md`** for architecture notes used in AI-assisted development.

## API routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/weather?city=` | Current weather, 3-day forecast, UV, sunrise/sunset |
| `GET` | `/api/favorites` | List favorites |
| `POST` | `/api/favorites` | Add favorite (`{ "cityName": "london" }`) |
| `DELETE` | `/api/favorites/[id]` | Remove favorite |
| `GET` | `/api/search-history` | Recent searches |

## Database schema

- **`favorite_cities`** — `id`, `user_id`, `city_name`, timestamps (demo uses `user_default`)
- **`search_history`** — `id`, `user_id`, `city_name`, `created_at`

Migrations live under `prisma/migrations/`.

## Deployment (optional)

1. Provision PostgreSQL and set `DATABASE_URL` on the host (e.g. Vercel).
2. Set `OPENWEATHERMAP_API_KEY`.
3. Run `prisma migrate deploy` in the build step or release phase.
4. Deploy with `npm run build` && `npm run start`, or use the Vercel Next.js integration.

## License

Private / educational use unless otherwise specified.
