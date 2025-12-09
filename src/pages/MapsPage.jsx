import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Phone, MessageCircle, Navigation, MapPin, Crosshair,Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert

import Navbar from "../components/Navbar";
import useMaps from "../hooks/useMaps";
import { PinIcon } from "../lib/mapUtils";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- UI COMPONENTS ---
const PlainButton = ({ children, className = "", onClick, variant = "default", ...props }) => {
  let base = "flex items-center justify-center font-medium transition-all active:scale-95";
  if (variant === "ghost") base += " text-gray-600 hover:bg-gray-100 p-2 rounded-lg";
  else if (variant === "fab") base += " shadow-lg rounded-full";
  else base += " text-white px-4 py-2 shadow-sm rounded-xl";
  return (
    <button className={`${base} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const PlainCard = ({ children, className = "", onClick, isActive }) => (
  <div 
    className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
      isActive 
        ? "border-purple-500 ring-1 ring-purple-500 shadow-md bg-purple-50/30" 
        : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
    } ${className}`} 
    onClick={onClick}
  >
    {children}
  </div>
);

const PlainBadge = ({ children, className = "" }) => (
  <div className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${className}`}>
    {children}
  </div>
);

// --- MAP HELPER COMPONENTS ---

// Komponen untuk mengontrol pergerakan peta saat lokasi dipilih
const MapController = ({ center, selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 16, {
        animate: true,
        duration: 1.5
      });
    } else if (center) {
      // Optional: Jangan selalu recenter ke user kalau user sedang browsing, 
      // tapi ini bagus untuk inisialisasi
      // map.flyTo(center, 14); 
    }
  }, [center, selectedLocation, map]);

  return null;
};

// Marker khusus untuk User (Titik Biru Berdenyut)
const UserLocationMarker = ({ position }) => {
  const userIcon = L.divIcon({
    className: "css-icon",
    html: '<div class="gps_ring"></div>', // Butuh CSS tambahan (lihat bawah) atau ganti icon biasa
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  // Fallback jika tidak pakai CSS custom, pakai icon default bulat biru
  return (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <span className="font-bold text-gray-800">Lokasi Anda</span>
        </div>
      </Popup>
    </Marker>
  );
};

export default function MapsPage() {
  const navigate = useNavigate();
  
  const { 
    userPos, 
    showMap, 
    loadingLoc, 
    loadingBackend, 
    locations, 
    selectedLocation, 
    setSelectedLocation 
  } = useMaps();

  // --- SWEETALERT INTEGRATION ---
  
  // Alert untuk Permission Error
  useEffect(() => {
    if (!loadingLoc && !showMap && !userPos) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Lokasi Ditolak',
        text: 'Mohon izinkan akses lokasi di browser Anda agar kami dapat menampilkan peta bantuan terdekat.',
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Mengerti'
      });
    }
  }, [loadingLoc, showMap, userPos]);

  // Alert ketika navigasi dimulai (Opsional UX enhancement)
  const handleNavigate = (lat, lng) => {
    Swal.fire({
      title: 'Buka Google Maps?',
      text: "Anda akan diarahkan ke aplikasi Google Maps untuk navigasi.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Buka Navigasi',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Format URL Google Maps yang benar untuk Directions API
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
      }
    });
  };

  const handleCall = (phone) => {
    if (!phone) return;
    // Langsung buka dialer, tapi bisa juga di alert dulu
    window.open(`tel:${phone}`);
  };

  // Reset view ke lokasi user
  const handleRecenter = () => {
    if(userPos) {
      setSelectedLocation(null); // Hapus seleksi agar map controller bisa fokus ke user (opsional logic)
      // Karena map controller memantau state, kita perlu cara manual mengakses map instance
      // atau cukup biarkan user scroll manual. 
      // *Disini kita akan handle via state selectedLocation = null dan logic di MapController diperbaiki sedikit jika perlu*
      // Tapi cara termudah di react-leaflet tanpa ref rumit adalah memaksa re-render atau membiarkan user zoom manual.
      // Opsi: Kita set selectedLocation ke 'user' fake object sementara atau biarkan.
      
      // Simple hack: trigger re-render map center
      const map = document.querySelector('.leaflet-container')?._leaflet_map;
      if(map) map.flyTo(userPos, 15);
    } else {
      Swal.fire({
        icon: 'info',
        text: 'Sedang mencari lokasi Anda...',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      <Navbar backButton={true} title="Daftar Pusat Bantuan" />

      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* --- MAP AREA (Left/Top) --- */}
        <div className="relative flex-1 h-[50vh] lg:h-full order-1 lg:order-1 z-0">
          
          {/* Loading State Visual */}
          {loadingLoc && (
            <div className="absolute inset-0 bg-gray-50/90 z-50 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                 <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                 <div className="relative bg-white p-4 rounded-full shadow-xl shadow-blue-100 border border-blue-50">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                 </div>
              </div>
              <p className="text-gray-500 font-medium text-xs uppercase tracking-widest animate-pulse">
                Mencari Lokasi...
              </p>
            </div>
          )}

          {showMap && userPos ? (
            <MapContainer center={userPos} zoom={15} className="w-full h-full" zoomControl={false}>
              {/* 1. Menggunakan CartoDB Voyager (Lebih bersih & mudah dibaca dibanding OSM standar) */}
              <TileLayer 
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              <MapController center={userPos} selectedLocation={selectedLocation} />

              <UserLocationMarker position={userPos} />

              {locations.map((loc) => (
                <Marker
                  key={String(loc.id)}
                  position={[loc.latitude, loc.longitude]}
                  // Pastikan pinColor didefinisikan atau handle fallback
                  icon={PinIcon ? PinIcon(loc.category === 'police' ? '#2563eb' : '#dc2626', 35) : undefined}
                  eventHandlers={{ 
                    click: () => setSelectedLocation(loc) 
                  }}
                >
                  {/* Popup Minimalis */}
                  <Popup className="custom-popup"> 
                    <div className="text-sm font-sans">
                      <strong className="block text-gray-800 mb-1">{loc.name}</strong>
                      <span className="text-xs text-gray-500">{loc.distance}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            // Fallback jika map gagal load
            !loadingLoc && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                <MapPin className="w-12 h-12 mb-2 opacity-20" />
                <p>Peta tidak dapat dimuat</p>
              </div>
            )
          )}

          {/* FLOATING CONTROLS ON MAP */}
          <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-3">
             {/* Recenter Button */}
             <PlainButton 
              variant="fab" 
              className="bg-white text-gray-700 hover:bg-gray-50 w-12 h-12 shadow-xl border border-gray-100"
              onClick={handleRecenter}
              title="Lokasi Saya"
            >
              <Crosshair className="w-6 h-6 text-purple-600" />
            </PlainButton>
          </div>
        </div>

        {/* --- SIDEBAR LIST (Right/Bottom) --- */}
        <div className="w-full lg:w-[400px] h-[50vh] lg:h-full bg-white border-l border-gray-200 flex flex-col order-2 lg:order-2 shadow-2xl lg:shadow-none z-10 rounded-t-3xl lg:rounded-none mt-[-20px] lg:mt-0">
          
          {/* Header Sidebar */}
          <div className="p-5 border-b bg-white sticky top-0 z-20 rounded-t-3xl lg:rounded-none">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">Lokasi Terdekat</h3>
              <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                {locations.length} Ditemukan
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Pilih lokasi dari daftar untuk melihat detail di peta.
            </p>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar pb-24 lg:pb-4">
            {loadingBackend ? (
              <div className="text-center py-10 text-gray-400 text-sm">Memuat data bantuan...</div>
            ) : locations.length === 0 ? (
              <div className="text-center py-10 px-6">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm">Tidak ada lokasi bantuan ditemukan dalam radius Anda.</p>
              </div>
            ) : (
              locations.map((location) => (
                <PlainCard
                  key={location.id}
                  isActive={selectedLocation?.id === location.id}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon Category */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      location.category === "police" ? "bg-blue-50" : "bg-red-50"
                    }`}>
                      {location.category === "police" ? "🚓" : location.category === "hospital" ? "🏥" : "📍"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 truncate pr-2">{location.name}</h4>
                        {location.distance && (
                           <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                             {location.distance}
                           </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {location.address || "Alamat tidak tersedia"}
                      </p>

                      {/* Action Buttons (Only Visible when Active) */}
                      {selectedLocation?.id === location.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                          <PlainButton
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs h-9 rounded-lg gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate(location.latitude, location.longitude);
                            }}
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            Rute
                          </PlainButton>

                          {location.phone && (
                            <PlainButton
                              className="flex-1 bg-green-600 hover:bg-green-700 text-xs h-9 rounded-lg gap-1.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCall(location.phone);
                              }}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Telpon
                            </PlainButton>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </PlainCard>
              ))
            )}
          </div>
        </div>

        {/* EMERGENCY FLOATING BUTTONS (Fixed Position) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-8 lg:bottom-8 z-[999] flex lg:flex-col gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="bg-white text-purple-600 hover:bg-gray-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-purple-900/10 border border-purple-100 transition-transform active:scale-90"
            title="Chat Bantuan"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          <button
            onClick={() => window.open("tel:110")}
            className="bg-red-500 hover:bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 ring-4 ring-red-100 transition-transform active:scale-90 animate-pulse"
            title="Panggilan Darurat"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}