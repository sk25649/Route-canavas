// Unit conversion utilities

/**
 * Convert meters to kilometers
 */
export function metersToKilometers(meters: number): number {
  return meters / 1000;
}

/**
 * Convert meters to miles
 */
export function metersToMiles(meters: number): number {
  return meters / 1609.34;
}

/**
 * Format distance based on unit preference
 */
export function formatDistance(meters: number, unit: "km" | "mi"): string {
  if (unit === "mi") {
    const miles = metersToMiles(meters);
    return `${miles.toFixed(2)} mi`;
  } else {
    const km = metersToKilometers(meters);
    return `${km.toFixed(2)} km`;
  }
}

/**
 * Stub for elevation gain calculation
 * Returns 0 for now but typed correctly for future implementation
 */
export function calculateElevationGain(coords: [number, number][]): number {
  // TODO: Integrate elevation API (e.g., Mapbox Terrain API)
  return 0;
}
