import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ArrowLeft, Phone, MessageCircle, Navigation, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 

// Fix icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const mockLocations = [
  {
    id: 1,
    name: "Polsek Jakarta Selatan",
    type: "police",
    address: "Jl. TB Simatupang No.1, Jakarta Selatan",
    phone: "110",
    distance: "1.2 km",
    lat: -6.2844,
    lng: 106.8155
  },
  {
    id: 2,
    name: "P2TP2A Jakarta",
    type: "satgas",
    address: "Jl. Merdeka No.15, Jakarta Pusat",
    phone: "(021) 3846543",
    distance: "2.5 km",
    lat: -6.2088,
    lng: 106.8456
  },
  {
    id: 3,
    name: "RS Umum Fatmawati",
    type: "hospital",
    address: "Jl. RS Fatmawati, Cilandak, Jakarta Selatan",
    phone: "(021) 7501524",
    distance: "3.1 km",
    lat: -6.2950,
    lng: 106.7937
  },
  {
    id: 4,
    name: "Polres Metro Jakarta Pusat",
    type: "police",
    address: "Jl. Taman Sari No.58, Jakarta Pusat",
    phone: "110",
    distance: "4.3 km",
    lat: -6.1751,
    lng: 106.8256
  }
];

// UI Components
const PlainButton = ({ children, className, onClick, variant = 'default', ...props }) => {
  let baseStyle = "flex items-center justify-center font-medium transition-colors";
  if (variant === 'ghost') baseStyle += " text-gray-700 hover:bg-gray-100 p-2";
  else baseStyle += " text-white px-4 py-2 shadow-md";

  return (
    <button className={`${baseStyle} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const PlainCard = ({ children, className, onClick }) => (
  <div className={`bg-white border rounded-2xl shadow-sm ${className}`} onClick={onClick}>
    {children}
  </div>
);

const PlainBadge = ({ children, className }) => (
  <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </div>
);

export default function MapsPage({ onStartChat }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const getTypeIcon = (type) => ({
    police: "🚓",
    satgas: "🧑‍⚖️",
    hospital: "🏥",
  }[type] || "📍");

  const getTypeLabel = (type) => ({
    police: "Polisi",
    satgas: "Satgas P2TP2A",
    hospital: "Rumah Sakit",
  }[type] || "Lokasi");

  const getTypeColor = (type) => ({
    police: "bg-blue-100 text-blue-700",
    satgas: "bg-purple-100 text-purple-700",
    hospital: "bg-red-100 text-red-700",
  }[type] || "bg-gray-100 text-gray-700");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <PlainButton variant="ghost" onClick={handleBack} className="gap-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </PlainButton>
        </div>
      </div>

      {/* FLOATING BUTTONS */}
<div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[999]">

  {/* CHAT BUTTON */}
  <button
    onClick={onStartChat}
    className="bg-purple-600 hover:bg-purple-700 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-400/40 active:scale-95 transition"
  >
    <MessageCircle className="w-7 h-7" />
  </button>

  {/* CALL 110 BUTTON */}
  <button
    onClick={() => window.open('tel:110')}
    className="bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-red-400/40 active:scale-95 transition"
  >
    <Phone className="w-7 h-7" />
  </button>

</div>



      {/* MAP + SIDEBAR */}
      <div className="flex-1 grid lg:grid-cols-[1fr,400px]">

        {/* LEAFLET MAP */}
        <div className="relative">
          <MapContainer 
            center={[-6.2, 106.816]} 
            zoom={12} 
            className="w-full h-[400px] lg:h-full"
            scrollWheelZoom
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            />

            {mockLocations.map((loc) => (
              <Marker 
                key={loc.id}
                position={[loc.lat, loc.lng]}
                eventHandlers={{
                  click: () => setSelectedLocation(loc)
                }}
              >
                <Popup>
                  <b>{loc.name}</b><br />
                  {loc.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* SIDEBAR LIST */}
        <div className="bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b bg-white sticky top-0">
            <h3 className="text-lg font-semibold">Lokasi Bantuan Terdekat</h3>
            <p className="text-sm text-gray-600">{mockLocations.length} lokasi ditemukan</p>
          </div>

          <div className="p-4 space-y-3">
            {mockLocations.map((location) => (
              <PlainCard
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedLocation?.id === location.id
                    ? "border-2 border-blue-400 shadow-lg"
                    : "border-2 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">{getTypeIcon(location.type)}</span>
                  </div>

                  <div className="flex-1">
                    <PlainBadge className={`${getTypeColor(location.type)} mb-2`}>
                      {getTypeLabel(location.type)}
                    </PlainBadge>

                    <h4 className="text-base font-semibold">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.address}</p>

                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location.distance}
                      </span>

                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {location.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedLocation?.id === location.id && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <PlainButton 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2 h-10 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
                        );
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                      Navigasi
                    </PlainButton>

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
                  </div>
                )}
              </PlainCard>
            ))}
          </div>
        </div>
      </div>

      {/* FLOATING EMERGENCY BUTTON */}
      <div className="fixed bottom-6 right-6">
        <PlainButton 
          onClick={() => window.open('tel:110')}
          className="bg-red-600 hover:bg-red-700 w-16 h-16 rounded-full shadow-2xl p-0"
        >
          <Phone className="w-6 h-6" />
        </PlainButton>
      </div>
    </div>
  );
}
