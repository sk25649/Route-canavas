import type { LngLat } from "./types";

/**
 * Build GPX XML from route coordinates
 */
export function buildGPX(name: string, coords: LngLat[]): string {
  const timestamp = new Date().toISOString();

  // Build track points
  const trackPoints = coords
    .map(([lng, lat]) => `      <trkpt lat="${lat}" lon="${lng}"></trkpt>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RunCanvas" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(name)}</name>
    <time>${timestamp}</time>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Validate that coordinates are suitable for GPX export
 */
export function validateGPXCoords(coords: LngLat[]): { valid: boolean; error?: string } {
  if (coords.length < 2) {
    return { valid: false, error: "At least 2 points required for GPX export" };
  }

  for (const [lng, lat] of coords) {
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { valid: false, error: "Invalid coordinates detected" };
    }
  }

  return { valid: true };
}
