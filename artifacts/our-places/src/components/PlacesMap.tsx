import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "wouter";

type MapPlace = {
  id: number;
  name: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  status: string;
  category: string;
  rating: number | null;
};

function createPin(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.27 21.73 0 14 0Z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

const visitedPin = createPin("#10b981");
const plannedPin = createPin("#f59e0b");

function AutoFitBounds({ places }: { places: MapPlace[] }) {
  const map = useMap();
  useEffect(() => {
    const valid = places.filter((p) => p.lat && p.lng);
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView([valid[0].lat!, valid[0].lng!], 12);
      return;
    }
    const bounds = L.latLngBounds(valid.map((p) => [p.lat!, p.lng!]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [places, map]);
  return null;
}

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restoran",
  cafe: "Kafe",
  park: "Park",
  museum: "Müze",
  beach: "Sahil",
  hotel: "Otel",
  bar: "Bar",
  attraction: "Gezilecek Yer",
  other: "Diğer",
};

export default function PlacesMap({ places }: { places: MapPlace[] }) {
  const placesWithCoords = places.filter((p) => p.lat && p.lng && (p.lat !== 0 || p.lng !== 0));

  if (placesWithCoords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-card/30 rounded-2xl border border-dashed border-border text-center px-6">
        <span className="text-5xl mb-4">🗺️</span>
        <p className="text-muted-foreground text-lg mb-2">Haritada gösterilecek konum yok</p>
        <p className="text-muted-foreground/60 text-sm">Anı eklerken koordinat bilgisi girersen burada görüntülenir.</p>
      </div>
    );
  }

  const center: [number, number] = [
    placesWithCoords[0].lat!,
    placesWithCoords[0].lng!,
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm" style={{ height: 520 }}>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AutoFitBounds places={placesWithCoords} />
        {placesWithCoords.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat!, place.lng!]}
            icon={place.status === "planned" ? plannedPin : visitedPin}
          >
            <Popup>
              <div className="text-sm min-w-[140px]">
                <p className="font-semibold text-base mb-0.5">{place.name}</p>
                <p className="text-muted-foreground text-xs mb-1.5">{place.city}, {place.country}</p>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    place.status === "planned"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {place.status === "planned" ? "🔖 Gelecek Planı" : "✅ Gezildi"}
                  </span>
                </div>
                {place.rating && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {"★".repeat(place.rating)}{"☆".repeat(5 - place.rating)}
                  </p>
                )}
                <a
                  href={`/places/${place.id}`}
                  className="block text-xs text-center py-1 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Detay
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="flex items-center gap-4 px-4 py-2.5 bg-card border-t border-border/40 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Gezildi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Gelecek Planı
        </span>
        <span className="ml-auto">{placesWithCoords.length} yer haritada gösteriliyor</span>
      </div>
    </div>
  );
}
