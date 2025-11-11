import type { LngLat } from "./types";

/**
 * Build TCX XML from route coordinates
 * Minimal TCX format compatible with Garmin devices
 */
export function buildTCX(name: string, coords: LngLat[]): string {
  const timestamp = new Date().toISOString();

  // Build track points with timestamps (spaced 1 second apart for simplicity)
  const trackPoints = coords
    .map(([lng, lat], index) => {
      const pointTime = new Date(Date.now() + index * 1000).toISOString();
      return `        <Trackpoint>
          <Time>${pointTime}</Time>
          <Position>
            <LatitudeDegrees>${lat}</LatitudeDegrees>
            <LongitudeDegrees>${lng}</LongitudeDegrees>
          </Position>
        </Trackpoint>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Courses>
    <Course>
      <Name>${escapeXml(name)}</Name>
      <Track>
${trackPoints}
      </Track>
    </Course>
  </Courses>
</TrainingCenterDatabase>`;
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
 * Validate that coordinates are suitable for TCX export
 */
export function validateTCXCoords(coords: LngLat[]): { valid: boolean; error?: string } {
  if (coords.length < 2) {
    return { valid: false, error: "At least 2 points required for TCX export" };
  }

  for (const [lng, lat] of coords) {
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { valid: false, error: "Invalid coordinates detected" };
    }
  }

  return { valid: true };
}
