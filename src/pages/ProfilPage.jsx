import React, { useEffect, useState } from "react";
import { User, Mail, MapPin, LogOut, Shield, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/user"; 
import Navbar from "../components/Navbar"; 

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-sm rounded-2xl border border-white/50 ${className}`}>
    {children}
  </div>
);

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await getUserProfile();
        
        if (userData) {
            setUser(userData);    
        } else {
            throw new Error("Data pengguna tidak ditemukan");
        }

      } catch (err) {
        console.error("Profile load error:", err);
        if (err.response?.status === 401) {
           setError("Sesi habis. Silakan login kembali.");
        } else {
           setError("Gagal memuat profil. Cek koneksi internetmu.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    if(window.confirm("Yakin ingin keluar?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        navigate("/login");
    }
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  // === ERROR STATE ===
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        {/* Tetap tampilkan Navbar walau error agar bisa kembali */}
        <Navbar backButton={true} title="Error" showMenu={false} />
        
        <div className="flex-1 flex items-center justify-center p-6">
            <Card className="p-8 text-center max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={24} />
            </div>
            <p className="text-gray-800 font-medium mb-4">{error}</p>
            <button 
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
                Login Ulang
            </button>
            </Card>
        </div>
      </div>
    );
  }

  // === MAIN CONTENT ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans">
      
      {/* 2. Gunakan Navbar dengan prop backButton */}
      <Navbar 
        backButton={true} 
        title="Profil Saya" 
        showMenu={false} 
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-xl mx-auto mt-4">
            <Card className="p-6 sm:p-8 relative overflow-hidden">
                {/* Elemen Dekoratif Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-40 -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    
                    {/* Avatar Section */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 mb-4 shadow-lg">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                    </div>

                    {/* Nama & Status */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {user?.name || "Pengguna"}
                    </h2>
                    <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-8 border border-green-100">
                        <CheckCircle2 size={12} />
                        Akun Terverifikasi
                    </div>

                    {/* Info Section */}
                    <div className="w-full space-y-3">
                        
                        {/* Email */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Mail size={20} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-gray-900 font-medium truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <MapPin size={20} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Alamat</p>
                                <p className={`font-medium truncate ${user?.address ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                    {user?.address || "Belum diatur"}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border-2 border-red-50 text-red-600 font-semibold hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                    >
                        <LogOut size={18} />
                        Keluar Akun
                    </button>

                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}