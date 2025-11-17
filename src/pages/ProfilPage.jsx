import React, { useEffect, useState } from "react";
import { ArrowLeft, User, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/user";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserProfile();
        setUser(data.user);    
      } catch (e) {
        console.error(e);
        alert("Gagal memuat profil");
      }
    };
    load();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-gray-100">
        
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold mt-4">{user.name || "Pengguna"}</h2>
          <p className="text-gray-500 text-sm">Akun SpeakUp</p>
        </div>

        {/* Info */}
        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <p className="text-gray-700">{user.email}</p>
          </div>

          {user.address && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <p className="text-gray-700">{user.address}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
