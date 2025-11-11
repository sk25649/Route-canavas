import { describe, it, expect } from "vitest";
import {
  metersToKilometers,
  metersToMiles,
  formatDistance,
  calculateElevationGain,
} from "../units";

describe("units", () => {
  describe("metersToKilometers", () => {
    it("should convert meters to kilometers", () => {
      expect(metersToKilometers(1000)).toBe(1);
      expect(metersToKilometers(5000)).toBe(5);
      expect(metersToKilometers(500)).toBe(0.5);
      expect(metersToKilometers(0)).toBe(0);
    });
  });

  describe("metersToMiles", () => {
    it("should convert meters to miles", () => {
      expect(metersToMiles(1609.34)).toBeCloseTo(1, 2);
      expect(metersToMiles(3218.68)).toBeCloseTo(2, 2);
      expect(metersToMiles(804.67)).toBeCloseTo(0.5, 2);
      expect(metersToMiles(0)).toBe(0);
    });
  });

  describe("formatDistance", () => {
    it("should format distance in kilometers", () => {
      expect(formatDistance(1000, "km")).toBe("1.00 km");
      expect(formatDistance(5500, "km")).toBe("5.50 km");
      expect(formatDistance(250, "km")).toBe("0.25 km");
    });

    it("should format distance in miles", () => {
      expect(formatDistance(1609.34, "mi")).toBe("1.00 mi");
      expect(formatDistance(8046.7, "mi")).toContain("5.0");
      expect(formatDistance(804.67, "mi")).toContain("0.5");
    });

    it("should handle zero distance", () => {
      expect(formatDistance(0, "km")).toBe("0.00 km");
      expect(formatDistance(0, "mi")).toBe("0.00 mi");
    });
  });

  describe("calculateElevationGain", () => {
    it("should return 0 (stub implementation)", () => {
      const coords: [number, number][] = [
        [-122.4194, 37.7749],
        [-122.4084, 37.7849],
        [-122.4294, 37.7949],
      ];

      expect(calculateElevationGain(coords)).toBe(0);
    });

    it("should handle empty coordinates", () => {
      expect(calculateElevationGain([])).toBe(0);
    });
  });
});
