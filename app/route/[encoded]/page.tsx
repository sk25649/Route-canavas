"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as turf from "@turf/turf";
import { decodePolyline } from "@/lib/polyline";
import { formatDistance } from "@/lib/units";
import type { LngLat } from "@/lib/types";

const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <p>Loading map...</p>
    </div>
  ),
});

interface RouteViewProps {
  params: {
    encoded: string;
  };
}

export default function RouteView({ params }: RouteViewProps) {
  const [coords, setCoords] = useState<LngLat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const decoded = decodePolyline(params.encoded);
      if (decoded.length === 0) {
        setError("Invalid route data");
      } else {
        setCoords(decoded);
      }
    } catch (err) {
      console.error("Decode error:", err);
      setError("Failed to load route");
    }
  }, [params.encoded]);

  const distance = coords.length >= 2
    ? turf.length(turf.lineString(coords), { units: "meters" }) * 1000
    : 0;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Route
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RunCanvas Route</h1>
          <p className="text-sm text-gray-600 mt-1">
            Distance: {formatDistance(distance, "mi")} / {formatDistance(distance, "km")}
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Route
          </a>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapCanvas
          coords={coords}
          closedLoop={false}
          onChange={() => {}}
          isReadOnly={true}
        />
      </div>
    </div>
  );
}
