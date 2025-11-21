import React from "react";
import { AlertCircle, MessageCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export function SituationPage({ onLogout }) {
  const navigate = useNavigate();

  // Modern Card
  const Card = ({ children, className = "", onClick }) => (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer p-6 ${className}`}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Navbar 
        backButton={true}
        title="Situasi Kamu"
        />


      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Bagaimana Kondisimu Hari Ini?
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-10">
          Pilih situasi yang paling sesuai. Kami akan mengarahkanmu ke bantuan yang paling tepat.
        </p>

        <div className="grid gap-6">

          {/* Emergency */}
          <Card onClick={() => navigate("/maps")}>
            <div className="flex items-center gap-5">
              <div className="bg-red-500 text-white p-4 rounded-xl shadow-md">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900">
                  Darurat – Butuh Bantuan Sekarang
                </h2>
                <p className="text-gray-600 mt-1">
                  Saya butuh pertolongan segera. Tampilkan peta lokasi darurat dan Satgas terdekat.
                </p>
              </div>
            </div>
          </Card>

          {/* Non Emergency */}
          <Card onClick={() => navigate("/chat")}>
            <div className="flex items-center gap-5">
              <div className="bg-yellow-500 text-white p-4 rounded-xl shadow-md">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900">
                  Ingin Bicara atau Curhat
                </h2>
                <p className="text-gray-600 mt-1">
                  Chat langsung dengan Satgas.
                </p>
              </div>
            </div>
          </Card>

          {/* Education */}
          <Card onClick={() => navigate("/login")}>
            <div className="flex items-center gap-5">
              <div className="bg-green-500 text-white p-4 rounded-xl shadow-md">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900">
                  Akses Edukasi & Informasi
                </h2>
                <p className="text-gray-600 mt-1">
                  Pelajari tentang consent, keamanan, dan materi edukatif lainnya.
                </p>
              </div>
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}
