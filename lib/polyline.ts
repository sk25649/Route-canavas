import polyline from "@mapbox/polyline";
import type { LngLat } from "./types";

/**
 * Encode coordinates to Google encoded polyline format
 * Note: Google polyline uses lat,lng order, so we need to flip our lng,lat coords
 */
export function encodePolyline(coords: LngLat[]): string {
  if (coords.length === 0) return "";

  // Convert [lng, lat] to [lat, lng] for polyline encoding
  const latLngCoords = coords.map(([lng, lat]) => [lat, lng]);
  return polyline.encode(latLngCoords);
}

/**
 * Decode Google encoded polyline to coordinates
 * Returns coords in [lng, lat] format
 */
export function decodePolyline(encoded: string): LngLat[] {
  if (!encoded) return [];

  try {
    // Polyline library returns [lat, lng], we need [lng, lat]
    const latLngCoords = polyline.decode(encoded);
    return latLngCoords.map(([lat, lng]) => [lng, lat]);
  } catch (error) {
    console.error("Failed to decode polyline:", error);
    return [];
  }
}

/**
 * Test if encoding and decoding is working correctly
 */
export function testPolylineRoundtrip(coords: LngLat[]): boolean {
  const encoded = encodePolyline(coords);
  const decoded = decodePolyline(encoded);

  if (coords.length !== decoded.length) return false;

  // Check if coordinates match within reasonable precision (6 decimal places)
  for (let i = 0; i < coords.length; i++) {
    const [lng1, lat1] = coords[i];
    const [lng2, lat2] = decoded[i];

    if (
      Math.abs(lng1 - lng2) > 0.000001 ||
      Math.abs(lat1 - lat2) > 0.000001
    ) {
      return false;
    }
  }

  return true;
}
