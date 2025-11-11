import { describe, it, expect } from "vitest";
import { buildGPX, validateGPXCoords } from "../gpx";
import type { LngLat } from "../types";

describe("gpx", () => {
  describe("buildGPX", () => {
    it("should build valid GPX XML", () => {
      const coords: LngLat[] = [
        [-122.4194, 37.7749],
        [-122.4084, 37.7849],
        [-122.4294, 37.7949],
      ];

      const gpx = buildGPX("Test Route", coords);

      // Check for GPX structure
      expect(gpx).toContain('<?xml version="1.0"');
      expect(gpx).toContain("<gpx");
      expect(gpx).toContain("<trk>");
      expect(gpx).toContain("<trkseg>");
      expect(gpx).toContain("<trkpt");
      expect(gpx).toContain("</gpx>");

      // Check for route name
      expect(gpx).toContain("<name>Test Route</name>");

      // Check for coordinates
      expect(gpx).toContain('lat="37.7749"');
      expect(gpx).toContain('lon="-122.4194"');
    });

    it("should escape XML special characters in name", () => {
      const coords: LngLat[] = [
        [-122.4194, 37.7749],
        [-122.4084, 37.7849],
      ];

      const gpx = buildGPX("Test & Route <name>", coords);

      expect(gpx).toContain("Test &amp; Route &lt;name&gt;");
      expect(gpx).not.toContain("Test & Route <name>");
    });

    it("should include metadata with timestamp", () => {
      const coords: LngLat[] = [
        [-122.4194, 37.7749],
        [-122.4084, 37.7849],
      ];

      const gpx = buildGPX("Test Route", coords);

      expect(gpx).toContain("<metadata>");
      expect(gpx).toContain("<time>");
      expect(gpx).toMatch(/<time>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe("validateGPXCoords", () => {
    it("should validate correct coordinates", () => {
      const coords: LngLat[] = [
        [-122.4194, 37.7749],
        [-122.4084, 37.7849],
      ];

      const result = validateGPXCoords(coords);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject single coordinate", () => {
      const coords: LngLat[] = [[-122.4194, 37.7749]];

      const result = validateGPXCoords(coords);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("At least 2 points");
    });

    it("should reject empty coordinates", () => {
      const coords: LngLat[] = [];

      const result = validateGPXCoords(coords);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("At least 2 points");
    });

    it("should reject invalid latitude", () => {
      const coords: LngLat[] = [
        [-122.4194, 91], // Invalid latitude
        [-122.4084, 37.7849],
      ];

      const result = validateGPXCoords(coords);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid coordinates");
    });

    it("should reject invalid longitude", () => {
      const coords: LngLat[] = [
        [-181, 37.7749], // Invalid longitude
        [-122.4084, 37.7849],
      ];

      const result = validateGPXCoords(coords);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid coordinates");
    });
  });
});
