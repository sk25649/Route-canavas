import { NextRequest, NextResponse } from "next/server";
import type { SnapRequest, SnapResponse, LngLat } from "@/lib/types";
import { encodePolyline } from "@/lib/polyline";

export async function POST(request: NextRequest) {
  try {
    const body: SnapRequest = await request.json();
    const { coords, profile = "walking" } = body;

    if (!coords || coords.length < 2) {
      return NextResponse.json(
        { error: "At least 2 coordinates required" },
        { status: 400 }
      );
    }

    const mapboxToken = process.env.MAPBOX_SECRET_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapboxToken) {
      console.error("Mapbox token not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Encode the coordinates for Mapbox Map Matching API
    // Mapbox expects coordinates as "lng,lat;lng,lat;..."
    const coordinatesString = coords.map(([lng, lat]) => `${lng},${lat}`).join(";");

    // Call Mapbox Map Matching API
    const matchingUrl = `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinatesString}?access_token=${mapboxToken}&geometries=geojson`;

    const response = await fetch(matchingUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mapbox API error:", errorText);

      // Return original coordinates with a warning
      const result: SnapResponse = {
        coords,
        warnings: ["Road snapping failed - using original route"],
      };
      return NextResponse.json(result);
    }

    const data = await response.json();

    // Check if we got a successful match
    if (!data.matchings || data.matchings.length === 0) {
      const result: SnapResponse = {
        coords,
        warnings: ["No road match found - using original route"],
      };
      return NextResponse.json(result);
    }

    // Extract the snapped coordinates from the first matching
    const matching = data.matchings[0];
    const snappedCoords: LngLat[] = matching.geometry.coordinates;

    // Build warnings based on confidence
    const warnings: string[] = [];
    if (matching.confidence < 0.5) {
      warnings.push("Low confidence road match");
    }

    const result: SnapResponse = {
      coords: snappedCoords,
      warnings: warnings.length > 0 ? warnings : undefined,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Snap API error:", error);
    return NextResponse.json(
      { error: "Failed to process snap request" },
      { status: 500 }
    );
  }
}
