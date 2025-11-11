# RunCanvas

A production-ready web app for drawing running routes on a map with live distance tracking, road snapping, and GPX/TCX export.

## Features

- **Interactive Map Drawing**: Click to add waypoints, drag to adjust, delete with Backspace
- **Live Distance Tracking**: Real-time distance calculation in kilometers or miles
- **Road Snapping**: Optional snap-to-roads feature using Mapbox Map Matching API
- **Route Export**: Download routes as GPX or TCX files for Garmin/Strava
- **Shareable URLs**: Generate shareable links with encoded polylines
- **Auto-save**: Routes are automatically saved to browser localStorage
- **Closed Loop**: Toggle to connect the last point to the first
- **Responsive Design**: Clean layout with stats panel and full-screen map

## Tech Stack

- **Next.js 14** (App Router with Turbopack)
- **TypeScript**
- **React**
- **Bun** (fast runtime & package manager)
- **Turborepo** (build system with caching)
- **Mapbox GL JS** (vector maps)
- **Turf.js** (geospatial calculations)
- **Tailwind CSS** (styling)
- **Vitest** (testing)

## Prerequisites

Make sure you have [Bun](https://bun.sh) installed:

```bash
# macOS, Linux, WSL
curl -fsSL https://bun.sh/install | bash

# Or with npm
npm install -g bun

# Verify installation
bun --version
```

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

> **Note:** This project uses Bun for 2-3x faster installs compared to npm/pnpm.

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and add your Mapbox tokens:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.YOUR_PUBLIC_TOKEN_HERE
MAPBOX_SECRET_TOKEN=sk.YOUR_SECRET_TOKEN_HERE
```

**Get your tokens at**: https://account.mapbox.com/

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Public token for map display (starts with `pk.`)
- `MAPBOX_SECRET_TOKEN`: Secret token for Map Matching API (starts with `sk.`)

### 3. Run Development Server

```bash
bun run dev
```

This runs Next.js with Turbopack (faster dev server) orchestrated by Turborepo.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
bun run build
bun run start
```

> **Turborepo Benefits:** Cached builds, parallel execution, and optimized task orchestration.

## Usage

### Drawing a Route

1. Click on the map to add waypoints
2. Drag the red markers to adjust points
3. Press **Backspace** to delete the last point
4. Toggle **Closed loop** to connect the last point to the first

### Snapping to Roads

1. Draw at least 2 points
2. Toggle **Snap to roads** in the options panel
3. The route will adjust to follow walking paths

### Exporting to Strava

1. Click **Download GPX** to save your route
2. Click **Open Strava My Routes** to go to Strava
3. On Strava: **My Routes** → **Create New Route** → **Import GPX file**
4. Upload the downloaded GPX file

### Sharing Routes

1. Draw a route with at least 2 points
2. Click **Copy Share Link**
3. Share the URL with others to view your route

## API Endpoints

### POST /api/snap

Snap coordinates to roads using Mapbox Map Matching API.

**Request:**
```json
{
  "coords": [[lng, lat], [lng, lat], ...],
  "profile": "walking"
}
```

**Response:**
```json
{
  "coords": [[lng, lat], [lng, lat], ...],
  "warnings": ["optional warning messages"]
}
```

### POST /api/export-gpx

Export route as GPX file.

**Request:**
```json
{
  "name": "My Route",
  "coords": [[lng, lat], [lng, lat], ...]
}
```

**Response:** GPX XML file download

### POST /api/export-tcx

Export route as TCX file (Garmin format).

**Request:**
```json
{
  "name": "My Route",
  "coords": [[lng, lat], [lng, lat], ...]
}
```

**Response:** TCX XML file download

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with Turbopack (Turborepo orchestrated) |
| `bun run dev:next` | Start Next.js dev server directly (bypass Turborepo) |
| `bun run build` | Build for production with Turborepo caching |
| `bun run build:next` | Build Next.js directly (bypass Turborepo) |
| `bun run start` | Start production server |
| `bun run test` | Run all tests with Turborepo |
| `bun run test:run` | Run tests directly with Vitest |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Lint code with Turborepo caching |
| `bun run type-check` | Type-check TypeScript files |
| `bun run clean` | Clean build artifacts and caches |

## Testing

Run the test suite:

```bash
bun run test
```

Watch mode for development:

```bash
bun run test:watch
```

Type checking:

```bash
bun run type-check
```

## Project Structure

```
/app
  /api
    /snap/route.ts              # Road snapping API
    /export-gpx/route.ts        # GPX export API
    /export-tcx/route.ts        # TCX export API
  /route/[encoded]/page.tsx     # Shareable route viewer
  layout.tsx                    # Root layout
  page.tsx                      # Main editor
  globals.css                   # Global styles

/components
  MapCanvas.tsx                 # Mapbox map with drawing
  StatsPanel.tsx                # Stats and controls

/lib
  types.ts                      # TypeScript type definitions
  polyline.ts                   # Polyline encoding/decoding
  gpx.ts                        # GPX file builder
  tcx.ts                        # TCX file builder
  units.ts                      # Unit conversions
  /__tests__                    # Unit tests
```

## Type Definitions

### RouteDraft

```typescript
type LngLat = [number, number]; // [longitude, latitude]

type RouteDraft = {
  name?: string;
  coords: LngLat[];
  snapped?: LngLat[] | null;
  closedLoop: boolean;
  units: "mi" | "km";
};
```

## Why Bun + Turborepo?

### Bun
- **⚡ 2-3x faster** installs compared to npm/pnpm
- **🚀 Native TypeScript** support (no transpilation needed)
- **🔋 All-in-one** runtime, package manager, and bundler
- **📦 Drop-in replacement** for Node.js

### Turborepo
- **🔄 Smart caching** - Never rebuild the same thing twice
- **⚙️ Parallel execution** - Run tasks across multiple cores
- **📊 Task orchestration** - Optimal build pipeline
- **🎯 Incremental builds** - Only rebuild what changed

### Performance Comparison

| Operation | npm | Bun | Improvement |
|-----------|-----|-----|-------------|
| Install | ~30s | ~10s | **3x faster** |
| Test run | ~2s | ~0.5s | **4x faster** |
| Build (cached) | ~15s | ~5s | **3x faster** |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires ES2020+ support.

## Future Enhancements

- [ ] Elevation gain calculation using Mapbox Terrain API
- [ ] Route search/autocomplete for start location
- [ ] Multiple route layers
- [ ] Route statistics (pace, time estimates)
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please open an issue first to discuss proposed changes.

## License

MIT

## Acknowledgments

- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) for maps
- [Turf.js](https://turfjs.org/) for geospatial calculations
- [Next.js](https://nextjs.org/) for the React framework
- [Bun](https://bun.sh/) for blazing-fast runtime
- [Turborepo](https://turbo.build/) for build system optimization
