import { describe, it, expect } from "vitest";
import { encodePolyline, decodePolyline, testPolylineRoundtrip } from "../polyline";
import type { LngLat } from "../types";

describe("polyline", () => {
  describe("encodePolyline and decodePolyline", () => {
    it("should encode and decode a simple route", () => {
      const coords: LngLat[] = [
        [-122.4194, 37.7749], // San Francisco
        [-122.4084, 37.7849],
        [-122.4294, 37.7949],
      ];

      const encoded = encodePolyline(coords);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe("string");

      const decoded = decodePolyline(encoded);
      expect(decoded).toHaveLength(3);

      // Check coordinates match within reasonable precision
      for (let i = 0; i < coords.length; i++) {
        expect(decoded[i][0]).toBeCloseTo(coords[i][0], 5);
        expect(decoded[i][1]).toBeCloseTo(coords[i][1], 5);
      }
    });

    it("should handle empty coordinates", () => {
      const coords: LngLat[] = [];
      const encoded = encodePolyline(coords);
      expect(encoded).toBe("");

      const decoded = decodePolyline(encoded);
      expect(decoded).toHaveLength(0);
    });

    it("should handle single coordinate", () => {
      const coords: LngLat[] = [[-122.4194, 37.7749]];
      const encoded = encodePolyline(coords);
      const decoded = decodePolyline(encoded);

      expect(decoded).toHaveLength(1);
      expect(decoded[0][0]).toBeCloseTo(coords[0][0], 5);
      expect(decoded[0][1]).toBeCloseTo(coords[0][1], 5);
    });

    it("should handle a complex route with many points", () => {
      const coords: LngLat[] = Array.from({ length: 20 }, (_, i) => [
        -122.4 + i * 0.01,
        37.7 + i * 0.01,
      ]);

      const encoded = encodePolyline(coords);
      const decoded = decodePolyline(encoded);

      expect(decoded).toHaveLength(20);

      for (let i = 0; i < coords.length; i++) {
        expect(decoded[i][0]).toBeCloseTo(coords[i][0], 5);
        expect(decoded[i][1]).toBeCloseTo(coords[i][1], 5);
      }
    });

    it("should handle invalid encoded string gracefully", () => {
      const decoded = decodePolyline("invalid!!!@#$");
      expect(decoded).toEqual([]);
    });
  });

  describe("testPolylineRoundtrip", () => {
    it("should pass roundtrip test for valid coordinates", () => {
      const coords: LngLat[] = [
        [-122.4194, 37.7749],
        [-122.4084, 37.7849],
        [-122.4294, 37.7949],
      ];

      expect(testPolylineRoundtrip(coords)).toBe(true);
    });

    it("should pass roundtrip test for empty coordinates", () => {
      expect(testPolylineRoundtrip([])).toBe(true);
    });
  });
});
