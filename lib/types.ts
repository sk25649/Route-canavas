// Core type definitions

export type LngLat = [number, number]; // [longitude, latitude]

export type RouteDraft = {
  name?: string;
  coords: LngLat[];
  snapped?: LngLat[] | null;
  closedLoop: boolean;
  units: "mi" | "km";
};

export type SnapRequest = {
  coords: LngLat[];
  profile?: "walking" | "cycling" | "driving";
};

export type SnapResponse = {
  coords: LngLat[];
  warnings?: string[];
};

export type ExportGPXRequest = {
  name: string;
  coords: LngLat[];
};

export type ExportTCXRequest = {
  name: string;
  coords: LngLat[];
};
