import React, { useState, useEffect } from "react";
import { ExternalLink, Globe, HeartHandshake, ShieldCheck, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_URL; 

// Helper function untuk Ikon (dibiarkan default)
const getIconByType = (type) => {
    return ExternalLink; 
};

// Helper function untuk Warna (dibiarkan default)
const getColorClassByType = (type) => {
    return { color: "text-blue-600", bgColor: "bg-blue-50" }; 
};


export default function ExternalPartnersPage() {
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPartners = async () => {
            // ... (Kode Try/Catch dan fetch tetap sama)
            try {
                const response = await fetch(`${API_BASE_URL}/community`);
                
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
                }

                const apiResponse = await response.json(); 
                const communityArray = apiResponse.payload && apiResponse.payload.datas 
                                       ? apiResponse.payload.datas 
                                       : [];

                // Mapping data
                const formattedData = communityArray.map(item => {
                    const communityType = item.type || "Komunitas"; 
                    
                    const { color, bgColor } = getColorClassByType(communityType);
                    const Icon = getIconByType(communityType);
                    
                    return {
                        id: item.id,
                        // ✅ Field name
                        name: item.name,
                        // ✅ Field description
                        desc: item.description, 
                        
                        type: communityType, 
                        color: color,
                        bgColor: bgColor,
                        icon: Icon,
                        
                        // ✅ Field logos (untuk ditampilkan sebagai gambar)
                        image: item.logos, 
                        // ✅ Field sosmed (untuk link tombol)
                        link: item.sosmed 
                    };
                });


                setPartners(formattedData);
                setError(null);
            } catch (err) {
                const errorCode = err.response?.status;
                if(errorCode === 401) {
                    navigate('/login');
                    return;
                }
                setError("Gagal memuat data Komunitas. Silakan coba lagi nanti.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartners();
    }, []);

    // --- Tampilan Loading dan Error (Dihilangkan untuk brevity, asumsikan tidak berubah) ---
    if (isLoading) { 
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-xl shadow-blue-100 border border-blue-50">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                </div>
                <p className="text-gray-500 font-medium text-sm uppercase tracking-widest animate-pulse">
                    Menghubungkan Komunitas...
                </p>
            </div>
        ); 
    }
    if (error) { /* ... */ return (<div>Error: {error}</div>); }

    // --- Tampilan Utama ---
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar backButton title="Komunitas Eksternal" />

            <main className="max-w-5xl mx-auto px-4 py-8">
                
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Komunitas</h1>
                    <p className="text-gray-500 mt-1">Tempat untuk kamu menambah pengetahuan dan mencari dukungan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partners.length > 0 ? (
                        partners.map((item) => {
                            const IconComponent = item.icon; 
                            
                            return (
                                <div 
                                    key={item.id} 
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col h-full"
                                >
                                    
                                    <div className="flex items-start justify-between mb-4">
                                        {/* Slot Logo: Menampilkan gambar dari 'logos' jika ada, jika tidak, ikon default */}
                                        <div className={`w-14 h-14 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center`}>
                                            {item.image ? (
                                                <img src={item.image} alt={`${item.name} logo`} className="w-full h-full object-contain p-1 rounded-2xl" />
                                            ) : (
                                                <IconComponent size={28} /> 
                                            )}
                                        </div>
                                        {/* Tipe Komunitas */}
                                        <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-wide text-gray-500 border border-gray-100">
                                            {item.type}
                                        </span>
                                    </div>

                                    {/* Nama (item.name) */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    
                                    {/* Deskripsi (item.description) */}
                                    {item.desc && (
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                                            {item.desc}
                                        </p>
                                    )}

                                    {/* Tombol Kunjungi  (item.sosmed) */}
                                    {item.link && (
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            Kunjungi Sosial Media
                                            <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="md:col-span-2 text-center text-gray-500">Tidak ada mitra yang tersedia saat ini.</p>
                    )}
                </div>

            </main>
        </div>
    );
}