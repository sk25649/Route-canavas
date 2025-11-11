"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import * as turf from "@turf/turf";
import StatsPanel from "@/components/StatsPanel";
import type { LngLat, RouteDraft, SnapResponse } from "@/lib/types";
import { encodePolyline } from "@/lib/polyline";

// Dynamic import to avoid SSR issues with Mapbox
const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <p>Loading map...</p>
    </div>
  ),
});

const STORAGE_KEY = "runcanvas_route";

export default function Home() {
  const [route, setRoute] = useState<RouteDraft>({
    coords: [],
    closedLoop: false,
    units: "mi",
  });
  const [isSnapping, setIsSnapping] = useState(false);
  const [snapToRoads, setSnapToRoads] = useState(false);

  // Load route from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRoute(parsed);
      }
    } catch (error) {
      console.error("Failed to load saved route:", error);
    }
  }, []);

  // Save route to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(route));
    } catch (error) {
      console.error("Failed to save route:", error);
    }
  }, [route]);

  // Calculate distance using Turf.js
  const calculateDistance = useCallback((coords: LngLat[], closed: boolean): number => {
    if (coords.length < 2) return 0;

    let lineCoords = [...coords];
    if (closed) {
      lineCoords = [...lineCoords, lineCoords[0]];
    }

    try {
      const line = turf.lineString(lineCoords);
      const distance = turf.length(line, { units: "meters" });
      return distance * 1000; // Convert to meters
    } catch (error) {
      console.error("Distance calculation error:", error);
      return 0;
    }
  }, []);

  const distance = calculateDistance(
    route.snapped || route.coords,
    route.closedLoop
  );

  // Handle snapping to roads
  useEffect(() => {
    if (!snapToRoads || route.coords.length < 2) {
      setRoute((prev) => ({ ...prev, snapped: null }));
      return;
    }

    const snapRoute = async () => {
      setIsSnapping(true);
      try {
        const response = await fetch("/api/snap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coords: route.coords,
            profile: "walking",
          }),
        });

        if (response.ok) {
          const data: SnapResponse = await response.json();
          setRoute((prev) => ({
            ...prev,
            snapped: data.coords,
          }));

          if (data.warnings && data.warnings.length > 0) {
            console.warn("Snap warnings:", data.warnings);
          }
        }
      } catch (error) {
        console.error("Snapping error:", error);
      } finally {
        setIsSnapping(false);
      }
    };

    snapRoute();
  }, [snapToRoads, route.coords]);

  const handleCoordsChange = (newCoords: LngLat[]) => {
    setRoute((prev) => ({
      ...prev,
      coords: newCoords,
      snapped: snapToRoads ? prev.snapped : null,
    }));
  };

  const handleClear = () => {
    setRoute({
      coords: [],
      closedLoop: false,
      units: route.units,
    });
    setSnapToRoads(false);
  };

  const handleExportGPX = async () => {
    try {
      const exportCoords = route.snapped || route.coords;
      const response = await fetch("/api/export-gpx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: route.name || "RunCanvas Route",
          coords: exportCoords,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "runcanvas-route.gpx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to export GPX");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export GPX");
    }
  };

  const handleExportTCX = async () => {
    try {
      const exportCoords = route.snapped || route.coords;
      const response = await fetch("/api/export-tcx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: route.name || "RunCanvas Route",
          coords: exportCoords,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "runcanvas-route.tcx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to export TCX");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export TCX");
    }
  };

  const handleShare = () => {
    if (route.coords.length < 2) return;

    const encoded = encodePolyline(route.coords);
    const shareUrl = `${window.location.origin}/route/${encoded}`;

    navigator.clipboard.writeText(shareUrl).then(
      () => alert("Share link copied to clipboard!"),
      () => alert("Failed to copy link")
    );
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-80 border-r border-gray-200 overflow-hidden flex flex-col">
        <StatsPanel
          coords={route.coords}
          snappedCoords={route.snapped}
          distance={distance}
          units={route.units}
          closedLoop={route.closedLoop}
          snapToRoads={snapToRoads}
          onUnitsChange={(units) => setRoute((prev) => ({ ...prev, units }))}
          onClosedLoopToggle={() =>
            setRoute((prev) => ({ ...prev, closedLoop: !prev.closedLoop }))
          }
          onSnapToRoadsToggle={() => setSnapToRoads(!snapToRoads)}
          onClear={handleClear}
          onExportGPX={handleExportGPX}
          onExportTCX={handleExportTCX}
          isSnapping={isSnapping}
        />

        {/* Share Button */}
        {route.coords.length >= 2 && (
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleShare}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              aria-label="Share route"
            >
              Copy Share Link
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapCanvas
          coords={route.coords}
          snappedCoords={route.snapped}
          closedLoop={route.closedLoop}
          onChange={handleCoordsChange}
        />
      </div>
    </div>
  );
}
