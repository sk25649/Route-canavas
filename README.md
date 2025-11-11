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

- **Next.js 14** (App Router)
- **TypeScript**
- **React**
- **Mapbox GL JS** (vector maps)
- **Turf.js** (geospatial calculations)
- **Tailwind CSS** (styling)
- **Vitest** (testing)

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

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

## Testing

Run the test suite:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
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
