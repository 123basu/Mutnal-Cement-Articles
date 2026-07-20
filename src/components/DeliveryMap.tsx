"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Delivery } from "@/lib/types";
import { DeliveryPopup } from "./DeliveryPopup";

function markerIcon(isGovernment: boolean) {
  const color = isGovernment ? "#d4a017" : "#b5563b";
  return L.divIcon({
    className: "",
    html: `<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
  });
}

export default function DeliveryMap({ deliveries }: { deliveries: Delivery[] }) {
  const center: [number, number] = [13.0, 76.5];

  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {deliveries.map((d) => (
        <Marker
          key={d.id}
          position={[d.lat, d.lng]}
          icon={markerIcon(d.isGovernment)}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup>{<DeliveryPopup d={d} />}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
