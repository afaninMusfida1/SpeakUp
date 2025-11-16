// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react"; // <-- TAMBAHKAN useState dan useEffect
import {
  ArrowLeft,
  MessageSquare,
  MapPin,
  HeartHandshake,
  BookText,
  Shield,
  MapPinCheck,
  Siren
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ===========================
   Custom SVG divIcon (MapPinCheck)
   Keeps marker vector-based, sharp & consistent
   =========================== */

const createPinHtml = ({ color = "#ef4444", size = 32 } = {}) => {
  // simple pin shape with check mark, lucide-style stroke
  const stroke = "#ffffff";
  const strokeWidth = 2;
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" >
      <path d="M12 21s6-5.333 6-10a6 6 0 10-12 0c0 4.667 6 10 6 10z" fill="${color}" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
      <path d="M9 12l1.8 1.8L15 9.6" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);
  return `data:image/svg+xml;utf8,${svg}`;
};

const PinIcon = (color = "#ef4444", size = 36) =>
  L.divIcon({
    className: "custom-pin-icon",
    html: `<img src="${createPinHtml({ color, size })}" style="width:${size}px;height:${size}px;display:block;"/>`,
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size / 2],
  });

/* ===========================
   Data & small helpers
   =========================== */

const educationArticles = [
  {
    id: 1,
    title: "Apa Itu Consent?",
    description:
      "Memahami pentingnya persetujuan dalam hubungan dan interaksi sosial.",
    category: "Dasar",
    readTime: "5 menit",
    image:
      "https://images.unsplash.com/photo-1760840415479-438f61268bed?auto=format&fit=crop&w=1080&q=80",
    color: "blue",
  },
  {
    id: 2,
    title: "Mengenali Tanda-Tanda Hubungan Tidak Sehat",
    description: "Pelajari red flags dalam hubungan dan cara mengatasinya.",
    category: "Hubungan",
    readTime: "7 menit",
    image:
      "https://images.unsplash.com/photo-1530043123514-c01b94ef483b?auto=format&fit=crop&w=1080&q=80",
    color: "purple",
  },
  {
    id: 3,
    title: "Hak-Hak Kamu sebagai Korban",
    description:
      "Ketahui hak-hak legal dan perlindungan yang tersedia untukmu.",
    category: "Legal",
    readTime: "6 menit",
    image:
      "https://images.unsplash.com/photo-1651493355781-20b4e12f3231?auto=format&fit=crop&w=1080&q=80",
    color: "pink",
  },
  {
    id: 4,
    title: "Cara Melapor Kekerasan Seksual",
    description: "Panduan langkah demi langkah untuk melaporkan kasus.",
    category: "Bantuan",
    readTime: "8 menit",
    image:
      "https://images.unsplash.com/photo-1530043123514-c01b94ef483b?auto=format&fit=crop&w=1080&q=80",
    color: "red",
  },
];

const getCategoryColor = (color) => {
  const map = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
    red: "bg-red-100 text-red-700",
  };
  return map[color] || map.blue;
};

/* ===========================
   Small UI primitives (kevin-style)
   =========================== */

const Button = ({ onClick, children, className = "", variant }) => {
  let base =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-10 px-4 py-2";
  if (variant === "ghost") base = "hover:bg-gray-100 hover:text-gray-900";
  if (variant === "outline")
    base = "border border-gray-300 bg-white hover:bg-gray-100";

  return (
    <button onClick={onClick} className={`${base} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ onClick, children, className = "" }) => (
  <div
    onClick={onClick}
    className={`bg-white shadow-sm rounded-2xl ${className} ${
      onClick ? "cursor-pointer" : ""
    }`}
  >
    {children}
  </div>
);

const ImageWithFallback = ({ src, alt, className = "" }) => (
  <img src={src} alt={alt} className={className} loading="lazy" />
);

/* ===========================
   Dashboard Component
   =========================== */

export default function Dashboard({ username = "Pengguna" }) {
  const navigate = useNavigate();

  const handleStartChat = () => navigate("/chat");
  const handleGoToMenfess = () => navigate("/menfess");
  const handleGoToMaps = () => navigate("/maps");
  const handleBack = () => navigate(-1);

  // 1. Tentukan koordinat default dan inisialisasi state
  const defaultCenter = [-6.200000, 106.816666]; // Jakarta (default)
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLocationFound, setIsLocationFound] = useState(false);

  // 2. Gunakan useEffect untuk mendapatkan lokasi pengguna
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setIsLocationFound(true);
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi:", error);
          // Jika gagal, tetap menggunakan mapCenter default
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.warn("Geolocation tidak didukung oleh browser ini.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="rounded-lg p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <h2 className="text-gray-900 font-semibold">Dashboard</h2>
              <p className="text-gray-600 text-sm">{username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleGoToMaps}
              className="text-red-600 font-semibold text-lg"
            >
              🚨 Butuh bantuan
            </Button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Greeting */}
        <section className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Halo, kamu aman di sini
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Ruang aman untuk belajar, berbagi, dan mendapatkan dukungan.
          </p>
        </section>

        {/* ACTION CARDS */}
        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <Card
            onClick={handleStartChat}
            className="p-6 border hover:border-blue-300 hover:shadow-lg transition relative overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-blue-100 rounded-full opacity-70" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Chat dengan Satgas
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Bantuan real-time & anonim — mulai percakapan sekarang.
              </p>

              <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                Mulai Chat <span aria-hidden>→</span>
              </div>
            </div>
          </Card>

          <Card
            onClick={handleGoToMenfess}
            className="p-6 border hover:border-purple-300 hover:shadow-lg transition relative overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-purple-100 rounded-full opacity-70" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 mb-3">
                <HeartHandshake className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Menfess Aman
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Kirim cerita atau laporan secara anonim dan aman.
              </p>

              <div className="inline-flex items-center gap-2 text-purple-600 font-medium">
                Kirim Menfess <span aria-hidden>→</span>
              </div>
            </div>
          </Card>
        </section>

        {/* MAP (compact) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPinCheck className="w-5 h-5 text-red-500" />
              Lokasi Darurat Terdekat
            </h2>
            <Button
              onClick={() => navigate("/maps")}
              variant="ghost"
              className="text-sm"
            >
              Lihat Selengkapnya →
            </Button>
          </div>

          <div className="w-full h-[240px] rounded-2xl overflow-hidden shadow-md border">
            <MapContainer
              center={mapCenter} // Menggunakan state mapCenter (lokasi pengguna)
              zoom={isLocationFound ? 16 : 14} // Zoom lebih dekat jika lokasi sudah ditemukan
              scrollWheelZoom={false}
              key={mapCenter.toString()} // Key untuk me-reset map ketika center berubah
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* The first marker now points to the user's location */}
              <Marker position={mapCenter} icon={PinIcon("#ef4444", 36)} />
              <Marker position={[mapCenter[0] - 0.02, mapCenter[1] + 0.02]} icon={PinIcon("#f97316", 36)} />
              <Marker position={[mapCenter[0] + 0.015, mapCenter[1] - 0.015]} icon={PinIcon("#6366f1", 36)} />
            </MapContainer>
          </div>
        </section>

        {/* ARTICLES */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold">📚 Edukasi & Artikel</h3>
              <p className="text-gray-600 text-sm">Pelajari lebih dalam tentang consent & hubungan sehat</p>
            </div>

            <Button variant="outline" className="rounded-md">
              Lihat Semua
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {educationArticles.map((a) => (
              <Card key={a.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(a.color)}`}>
                      {a.category}
                    </span>
                    <span className="text-gray-500 text-sm">⏱️ {a.readTime}</span>
                  </div>

                  <h4 className="text-lg font-semibold mb-2">{a.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{a.description}</p>

                  <Button variant="ghost" className="text-blue-600 p-0">
                    Baca Selengkapnya →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section>
          <Card className="p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <div className="max-w-2xl mx-auto text-center">
              <Shield className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Butuh Bantuan Sekarang?</h3>
              <p className="opacity-90 mb-6">Tim Satgas siap membantu 24/7.</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleStartChat} className="bg-white text-blue-600 rounded-2xl px-6">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat dengan Satgas
                </Button>

                <Button onClick={handleGoToMaps} variant="outline" className="rounded-2xl px-6 border-white text-blue-600 flex items-center">
                  <MapPinCheck className="w-4 h-4 mr-2" />
                  Cari Bantuan Terdekat
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}