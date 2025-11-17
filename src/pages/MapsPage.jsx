import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Phone, MessageCircle, Navigation, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const PlainButton = ({ children, className = "", onClick, variant = "default", ...props }) => {
  let base = "flex items-center justify-center font-medium transition-colors";
  if (variant === "ghost") base += " text-gray-700 hover:bg-gray-100 p-2";
  else base += " text-white px-4 py-2 shadow-md";
  return (
    <button className={`${base} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const PlainCard = ({ children, className = "", onClick }) => (
  <div className={`bg-white border rounded-2xl shadow-sm ${className}`} onClick={onClick}>
    {children}
  </div>
);

const PlainBadge = ({ children, className = "" }) => (
  <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </div>
);

/* Util: Haversine distance (km)*/
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/* Main Page*/
export default function MapsPage({ onStartChat }) {
  const navigate = useNavigate();

  const [userPos, setUserPos] = useState(null); 
  const [showMap, setShowMap] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(true); 
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [locations, setLocations] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState(null);

  const BACKEND_NEARBY_URL = "/api/v1/nearby";

  // geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserPos(null);
      setShowMap(false);
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPos([lat, lng]);
        setShowMap(true);
        setLoadingLoc(false);
      },
      (err) => {
        console.warn("Geolocation error / denied:", err);
        setUserPos(null);
        setShowMap(false);
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (!userPos) return;

    let cancelled = false;
    setLoadingBackend(true);

    (async () => {
      try {
        const url = `${BACKEND_NEARBY_URL}?lat=${encodeURIComponent(userPos[0])}&lng=${encodeURIComponent(userPos[1])}`;
        const res = await fetch(url, { method: "GET" });

        if (!res.ok) throw new Error(`Backend returned ${res.status}`);

        const data = await res.json();

        // Backend bisa mengembalikan:
        // - array Feature (OSM-format) OR
        // - array plain records sesuai Prisma SatgasLocation
        // Kita deteksi dan konversi ke bentuk internal:
        const parsed = (Array.isArray(data) ? data : data.features || [])
          .map((item) => {
            // Jika OSM Feature format
            if (item?.type === "Feature" && item?.properties) {
              const props = item.properties;
              const coords = item.geometry?.coordinates || [];
              const lat = coords[1];
              const lng = coords[0];
              const name = props.name || props["alt_name"] || props["operator"] || "Tanpa Nama";
              const addressParts = [];
              if (props["addr:street"]) addressParts.push(props["addr:street"]);
              if (props["addr:housenumber"]) addressParts.push(props["addr:housenumber"]);
              if (props["addr:postcode"]) addressParts.push(props["addr:postcode"]);
              const address = addressParts.join(" ").trim() || props.operator || "";
              return {
                id: item.id || `${lat}-${lng}`,
                name,
                address,
                phone: props.phone || props.phone_number || null,
                category: props.amenity || props.type || null,
                latitude: lat,
                longitude: lng,
                // if backend supplied distance use it, else compute
                distance:
                  typeof props.distance !== "undefined" && props.distance !== null
                    ? props.distance
                    : (typeof lat === "number" && typeof lng === "number"
                        ? (Math.round(haversineKm(userPos[0], userPos[1], lat, lng) * 10) / 10) + " km"
                        : null),
              };
            }

            // Jika backend mengembalikan record seperti Prisma SatgasLocation
            // { id, nama_kantor, alamat, latitude, longitude, distance? }
            if (item && item.nama_kantor && typeof item.latitude === "number" && typeof item.longitude === "number") {
              const lat = item.latitude;
              const lng = item.longitude;
              return {
                id: item.id,
                name: item.nama_kantor,
                address: item.alamat || "",
                phone: item.phone || item.telp || null,
                category: item.category || null,
                latitude: lat,
                longitude: lng,
                distance:
                  typeof item.distance !== "undefined" && item.distance !== null
                    ? item.distance
                    : (Math.round(haversineKm(userPos[0], userPos[1], lat, lng) * 10) / 10) + " km",
              };
            }

            // Unknown format -> ignore by returning null
            return null;
          })
          .filter(Boolean);

        if (!cancelled) {
          setLocations(parsed);
        }
      } catch (err) {
        console.error("Gagal fetch lokasi terdekat:", err);
        if (!cancelled) setLocations([]);
      } finally {
        if (!cancelled) setLoadingBackend(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userPos]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar backButton={true} title="Peta Bantuan" />

      {/* FLOATING ACTIONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[999]">
        <button
          onClick={() => navigate('/chat')}
          className="bg-purple-600 hover:bg-purple-700 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-400/40 active:scale-95 transition"
        >
          <MessageCircle className="w-7 h-7" />
        </button>

        <button
          onClick={() => window.open("tel:110")}
          className="bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-red-400/40 active:scale-95 transition"
        >
          <Phone className="w-7 h-7" />
        </button>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr,400px]">
        <div className="relative">
          {/* When user denies or still loading geolocation */}
          {!showMap && !loadingLoc && (
            <div className="w-full h-[400px] lg:h-full flex items-center justify-center text-gray-500 text-sm">
              Lokasi tidak diizinkan — peta tidak dapat ditampilkan.
            </div>
          )}

          {loadingLoc && (
            <div className="w-full h-[400px] lg:h-full flex items-center justify-center text-gray-500 text-sm">
              Menentukan lokasi...
            </div>
          )}

          {/* Map shows only if allowed */}
          {showMap && userPos && (
            <MapContainer center={userPos} zoom={14} className="w-full h-[400px] lg:h-full" scrollWheelZoom>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* user marker */}
              <Marker position={userPos}>
                <Popup>Lokasi Anda</Popup>
              </Marker>

              {/* markers from backend */}
              {locations.map((loc) => (
                <Marker
                  key={String(loc.id)}
                  position={[loc.latitude, loc.longitude]}
                  eventHandlers={{ click: () => setSelectedLocation(loc) }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{loc.name}</strong>
                      {loc.address ? <div className="text-gray-600">{loc.address}</div> : null}
                      {loc.distance ? <div className="text-xs text-gray-500 mt-1">{loc.distance}</div> : null}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b bg-white sticky top-0">
            <h3 className="text-lg font-semibold">Lokasi Bantuan Terdekat</h3>

            {loadingLoc && <p className="text-sm text-gray-600">Menentukan lokasi...</p>}
            {!loadingLoc && showMap && loadingBackend && <p className="text-sm text-gray-600">Memuat lokasi...</p>}
            {!loadingLoc && !showMap && <p className="text-sm text-gray-600">Peta tidak tersedia</p>}
            {!loadingLoc && showMap && !loadingBackend && <p className="text-sm text-gray-600">{locations.length} lokasi ditemukan</p>}
          </div>

          <div className="p-4 space-y-3">
            {/* no data message */}
            {showMap && !loadingBackend && locations.length === 0 && (
              <p className="text-sm text-gray-500">Tidak ada lokasi bantuan ditemukan di sekitar Anda.</p>
            )}

            {locations.map((location) => (
              <PlainCard
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedLocation?.id === location.id ? "border-2 border-blue-400 shadow-lg" : "border-2 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">
                      {location.category === "police" ? "🚓" : location.category === "hospital" ? "🏥" : "📍"}
                    </span>
                  </div>

                  <div className="flex-1">
                    <PlainBadge className={`mb-2 ${location.category === "police" ? "bg-blue-100 text-blue-700" : location.category === "hospital" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                      {location.name}
                    </PlainBadge>

                    <h4 className="text-base font-semibold">{location.name}</h4>
                    {location.address ? <p className="text-sm text-gray-600">{location.address}</p> : null}

                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                      {location.distance ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {location.distance}
                        </span>
                      ) : null}

                      {location.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {location.phone}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {selectedLocation?.id === location.id && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <PlainButton
                      className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2 h-10 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const lat = location.latitude;
                        const lng = location.longitude;
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                      Navigasi
                    </PlainButton>

                    {location.phone ? (
                      <PlainButton
                        className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl gap-2 h-10 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${location.phone}`);
                        }}
                      >
                        <Phone className="w-4 h-4" />
                        Hubungi
                      </PlainButton>
                    ) : null}
                  </div>
                )}
              </PlainCard>
            ))}
          </div>
        </div>
      </div>

      {/* EMERGENCY BUTTON */}
      <div className="fixed bottom-6 right-6">
        <PlainButton onClick={() => window.open("tel:110")} className="bg-red-600 hover:bg-red-700 w-16 h-16 rounded-full shadow-2xl p-0">
          <Phone className="w-6 h-6" />
        </PlainButton>
      </div>
    </div>
  );
}
