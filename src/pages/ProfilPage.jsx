import React, { useEffect, useState } from "react";
import { Mail, MapPin, LogOut, Shield, CheckCircle2, Edit2, Save, X } from "lucide-react"; // Tambah icon baru
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserProfile, updateUserProfile } from "../api/user"; // Pastikan import updateUserProfile
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
  
  // State untuk Edit Alamat
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
            setTempAddress(userData.address || ""); // Set alamat awal
        } else {
            throw new Error("Data pengguna tidak ditemukan");
        }
      } catch (err) {
        if (err.response?.status === 401) {
           setError("Sesi habis. Silakan login kembali.");
           navigate("/login");
        } else {
           setError("Gagal memuat profil.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  // Fungsi untuk mendapatkan Inisial Nama
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Fungsi Logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: "Anda harus login ulang nanti.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-2xl font-sans', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  // Fungsi Simpan Alamat
  const handleSaveAddress = async () => {
    if (!tempAddress.trim()) {
        Swal.fire('Eits!', 'Alamat tidak boleh kosong ya.', 'warning');
        return;
    }

    try {
        setIsSaving(true);
        // Panggil API update
        await updateUserProfile({ address: tempAddress });
        
        // Update state lokal
        setUser(prev => ({ ...prev, address: tempAddress }));
        setIsEditingAddress(false);
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Alamatmu sudah diperbarui',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl font-sans' }
        });

    } catch (err) {
        Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan alamat.', 'error');
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
  );

  if (error) return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Login Ulang</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans">
      <Navbar backButton={true} title="Profil Saya" showMenu={false} />

      <div className="p-4 sm:p-6">
        <div className="max-w-xl mx-auto mt-4">
            <Card className="p-6 sm:p-8 relative overflow-hidden">
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-40 -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    
                    {/* AVATAR INISIAL */}
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 mb-4 shadow-xl transform transition hover:scale-105 duration-300">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-4xl font-extrabold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent select-none">
                                {getInitials(user?.name)}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                    <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-8 border border-green-100">
                        <CheckCircle2 size={12} />
                        Akun Terverifikasi
                    </div>

                    <div className="w-full space-y-3">
                        {/* Email (Read Only) */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <Mail size={20} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-gray-900 font-medium truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* ALAMAT (Editable) */}
                        <div className={`flex flex-col p-4 bg-gray-50 rounded-2xl border transition-colors ${isEditingAddress ? 'border-purple-300 bg-white ring-2 ring-purple-100' : 'border-gray-100 hover:border-purple-200'}`}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                
                                <div className="flex-grow text-left">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Alamat</p>
                                        
                                        {/* Tombol Edit / Cancel */}
                                        {!isEditingAddress ? (
                                            <button 
                                                onClick={() => {
                                                    setTempAddress(user?.address || "");
                                                    setIsEditingAddress(true);
                                                }}
                                                className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                                                title="Edit Alamat"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setIsEditingAddress(false)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Batal"
                                                disabled={isSaving}
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Tampilan Kondisional: Text vs Input */}
                                    {!isEditingAddress ? (
                                        <p className={`font-medium break-words ${user?.address ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                            {user?.address || "Belum diatur"}
                                        </p>
                                    ) : (
                                        <div className="mt-2 animate-in fade-in duration-200">
                                            <textarea
                                                value={tempAddress}
                                                onChange={(e) => setTempAddress(e.target.value)}
                                                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 bg-gray-50 resize-none"
                                                rows="2"
                                                placeholder="Masukkan alamat lengkap..."
                                            />
                                            <button 
                                                onClick={handleSaveAddress}
                                                disabled={isSaving}
                                                className="mt-2 flex items-center justify-center gap-2 w-full bg-purple-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                {isSaving ? "Menyimpan..." : (
                                                    <>
                                                        <Save size={14} /> Simpan Perubahan
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border-2 border-red-50 text-red-600 font-semibold hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
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