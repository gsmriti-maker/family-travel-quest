"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Fit({ pointsKey, points }: { pointsKey: string; points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 16);
      return;
    }
    map.fitBounds(points, { padding: [32, 32] });
  }, [map, points, pointsKey]);
  return null;
}

function numberedIcon(n: number, active: boolean) {
  return L.divIcon({
    className: "pin-icon",
    html: `<div class="pin-num${active ? " on" : ""}">${n}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function WalkMap({
  stops,
  line,
  activeId,
  here,
  onSelect,
}: {
  stops: { id: string; lat: number; lng: number }[];
  line: [number, number][];
  activeId: string | null;
  here: { lat: number; lng: number } | null;
  onSelect: (id: string) => void;
}) {
  const positions = stops.map((stop) => [stop.lat, stop.lng] as [number, number]);
  const path = line.length > 1 ? line : positions;
  const center = positions[0] ?? ([35.0116, 135.7681] as [number, number]);
  const pointsKey = positions.map((point) => point.join(",")).join(";");

  return (
    <MapContainer center={center} zoom={14} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Fit pointsKey={pointsKey} points={positions} />
      {path.length > 1 && <Polyline positions={path} pathOptions={{ color: "#1d3c5a", weight: 4, opacity: 0.85 }} />}
      {stops.map((stop, index) => (
        <Marker
          key={stop.id}
          position={[stop.lat, stop.lng]}
          icon={numberedIcon(index + 1, stop.id === activeId)}
          eventHandlers={{ click: () => onSelect(stop.id) }}
        />
      ))}
      {here && (
        <CircleMarker
          center={[here.lat, here.lng]}
          radius={8}
          pathOptions={{ color: "#1d4e89", fillColor: "#3b82f6", fillOpacity: 0.95 }}
        />
      )}
    </MapContainer>
  );
}
