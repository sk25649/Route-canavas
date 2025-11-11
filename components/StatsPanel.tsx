"use client";

import { formatDistance, calculateElevationGain } from "@/lib/units";
import type { LngLat } from "@/lib/types";

interface StatsPanelProps {
  coords: LngLat[];
  snappedCoords?: LngLat[] | null;
  distance: number;
  units: "km" | "mi";
  closedLoop: boolean;
  snapToRoads: boolean;
  onUnitsChange: (units: "km" | "mi") => void;
  onClosedLoopToggle: () => void;
  onSnapToRoadsToggle: () => void;
  onClear: () => void;
  onExportGPX: () => void;
  onExportTCX: () => void;
  isSnapping?: boolean;
}

export default function StatsPanel({
  coords,
  snappedCoords,
  distance,
  units,
  closedLoop,
  snapToRoads,
  onUnitsChange,
  onClosedLoopToggle,
  onSnapToRoadsToggle,
  onClear,
  onExportGPX,
  onExportTCX,
  isSnapping = false,
}: StatsPanelProps) {
  const elevationGain = calculateElevationGain(coords);
  const hasRoute = coords.length >= 2;

  return (
    <div className="bg-white p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">RunCanvas</h1>
        <p className="text-sm text-gray-600 mt-1">
          Draw your running route on the map
        </p>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900">Route Stats</h2>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Distance</span>
            <span className="font-semibold text-lg">
              {formatDistance(distance, units)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Elevation Gain</span>
            <span className="font-semibold">
              {units === "mi" ? `${elevationGain} ft` : `${elevationGain} m`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Waypoints</span>
            <span className="font-semibold">{coords.length}</span>
          </div>
        </div>
      </div>

      {/* Units Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Units
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onUnitsChange("km")}
            className={`flex-1 px-3 py-2 rounded ${
              units === "km"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Use kilometers"
          >
            Kilometers
          </button>
          <button
            onClick={() => onUnitsChange("mi")}
            className={`flex-1 px-3 py-2 rounded ${
              units === "mi"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Use miles"
          >
            Miles
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900">Options</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={closedLoop}
            onChange={onClosedLoopToggle}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label="Toggle closed loop"
          />
          <span className="text-sm text-gray-700">Closed loop</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={snapToRoads}
            onChange={onSnapToRoadsToggle}
            disabled={!hasRoute || isSnapping}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            aria-label="Toggle snap to roads"
          />
          <span className="text-sm text-gray-700">
            Snap to roads {isSnapping && "(snapping...)"}
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900">Export</h2>

        <button
          onClick={onExportGPX}
          disabled={!hasRoute}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Download GPX file"
        >
          Download GPX
        </button>

        <button
          onClick={onExportTCX}
          disabled={!hasRoute}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Download TCX file"
        >
          Download TCX
        </button>

        <a
          href="https://www.strava.com/routes"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-center"
          aria-label="Open Strava My Routes"
        >
          Open Strava My Routes
        </a>

        <div className="bg-blue-50 p-3 rounded text-xs text-gray-700">
          <strong>Tip:</strong> After downloading GPX, go to Strava → My Routes
          → Create New Route → Import GPX file.
        </div>
      </div>

      {/* Clear */}
      <div className="pt-4 border-t">
        <button
          onClick={onClear}
          disabled={coords.length === 0}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Clear route"
        >
          Clear Route
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Backspace to delete last point
        </p>
      </div>
    </div>
  );
}
