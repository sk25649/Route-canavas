"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { LngLat } from "@/lib/types";

interface MapCanvasProps {
  coords: LngLat[];
  snappedCoords?: LngLat[] | null;
  closedLoop: boolean;
  onChange: (coords: LngLat[]) => void;
  isReadOnly?: boolean;
}

export default function MapCanvas({
  coords,
  snappedCoords,
  closedLoop,
  onChange,
  isReadOnly = false,
}: MapCanvasProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error("Mapbox token not found");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add click handler for adding points
    if (!isReadOnly) {
      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        onChange([...coords, [lng, lat]]);
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update route line when coords change
  useEffect(() => {
    if (!map.current) return;

    const displayCoords = snappedCoords || coords;
    let lineCoords = [...displayCoords];

    // Add closing segment if closed loop
    if (closedLoop && lineCoords.length > 0) {
      lineCoords = [...lineCoords, lineCoords[0]];
    }

    // Update or create line source
    if (map.current.getSource("route")) {
      const source = map.current.getSource("route") as mapboxgl.GeoJSONSource;
      source.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: lineCoords,
        },
      });
    } else {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: lineCoords,
          },
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": snappedCoords ? "#4CAF50" : "#2196F3",
          "line-width": 4,
        },
      });
    }

    // Update line color based on snapped state
    if (map.current.getLayer("route")) {
      map.current.setPaintProperty(
        "route",
        "line-color",
        snappedCoords ? "#4CAF50" : "#2196F3"
      );
    }

    // Fit bounds if we have coords
    if (lineCoords.length > 0) {
      const bounds = lineCoords.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(lineCoords[0], lineCoords[0])
      );

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [coords, snappedCoords, closedLoop]);

  // Update markers
  useEffect(() => {
    if (!map.current || isReadOnly) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Create new markers for each coordinate
    coords.forEach((coord, index) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#FF5722";
      el.style.border = "2px solid white";
      el.style.cursor = "move";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      const marker = new mapboxgl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat(coord)
        .addTo(map.current!);

      // Handle drag
      marker.on("drag", () => {
        const lngLat = marker.getLngLat();
        const newCoords = [...coords];
        newCoords[index] = [lngLat.lng, lngLat.lat];
        onChange(newCoords);
      });

      markers.current.push(marker);
    });
  }, [coords, isReadOnly, onChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (isReadOnly) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Backspace to delete last point
      if (e.key === "Backspace" && coords.length > 0) {
        e.preventDefault();
        onChange(coords.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [coords, isReadOnly, onChange]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      {!isReadOnly && coords.length === 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow-lg text-sm text-gray-700">
          Click on the map to add waypoints
        </div>
      )}
    </div>
  );
}
