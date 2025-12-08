import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Video, ExternalLink } from "lucide-react"; // ExternalLink diimpor kembali
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 

// --- PENGATURAN API ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; 

// Fungsi untuk menentukan status
const getStatus = (eventDate) => {
    if (!eventDate) return 'done'; 
    
    const today = new Date();
    const dateOnly = new Date(eventDate.split('T')[0]); 
    today.setHours(0, 0, 0, 0);

    return dateOnly >= today ? 'upcoming' : 'done';
};

export default function EventsPage() {
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/event`);
                
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
                }

                const apiResponse = await response.json(); 
                const eventArray = apiResponse.payload && apiResponse.payload.datas
                                   ? apiResponse.payload.datas
                                   : []; 

                
                const formattedEvents = eventArray.map(item => {
                    const status = getStatus(item.eventDate);
                    const eventDateTime = item.eventDate ? new Date(item.eventDate) : null;

                    // Validasi parsing date
                    if (!eventDateTime || isNaN(eventDateTime)) {
                         return { id: item.id, title: item.title || "Judul Tidak Tersedia", status: 'done', fullDate: null, dateNumber: null, monthShort: null, timeDisplay: null, location: item.location, link: item.link, category: item.category };
                    }

                    return {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        speaker: item.speaker,
                        
                        // Data Tanggal dan Waktu (Aman dari NaN)
                        fullDate: eventDateTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                        dateNumber: eventDateTime.getDate(),
                        monthShort: eventDateTime.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
                        timeDisplay: eventDateTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) + ' WIB',
                        
                        // Lokasi dan Tipe
                        location: item.location,
                        type: (item.location && item.location.toLowerCase().includes('online')) || item.link ? 'Online' : 'Offline', 
                        
                        category: item.category,
                        status: status,
                        link: item.link, // Nilai ini bisa null
                    };
                });
                
                formattedEvents.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));


                setEvents(formattedEvents);
                setError(null);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Gagal memuat jadwal kegiatan. Pastikan URL dan struktur respons API sudah benar.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // --- LOGIKA TAMPILAN LOADING/ERROR (Tidak berubah) ---
    if (isLoading) {
         return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar backButton title="Agenda Kegiatan" />
                <main className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <p className="text-gray-600">Memuat jadwal kegiatan...</p>
                </main>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar backButton title="Agenda Kegiatan" />
                <main className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <p className="text-red-500 font-semibold">{error}</p>
                </main>
            </div>
        );
    }

    // --- TAMPILAN UTAMA ---
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar backButton title="Agenda Kegiatan" />

            <main className="max-w-4xl mx-auto px-4 py-8">
                
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Jadwal Terdekat</h1>
                    <p className="text-gray-500 mt-1">Ikuti kegiatan edukasi dan sosialisasi terbaru.</p>
                </div>

                <div className="space-y-6">
                    {events.length > 0 ? (
                        events.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={item.id ? () => navigate(`/event/${item.id}`) : undefined} 
                                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer"
                            >
                                
                                {/* Date Badge */}
                                {item.dateNumber && item.monthShort && (
                                    <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl text-blue-700 flex-shrink-0">
                                        <span className="text-sm font-bold uppercase">{item.monthShort}</span>
                                        <span className="text-2xl font-black">{item.dateNumber}</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            item.status === 'upcoming' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {item.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                                        </span>
                                        {/* Category */}
                                        {item.category && <span className="text-xs text-gray-400 font-medium">{item.category}</span>}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {item.title || "Judul Tidak Tersedia"}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                                        {/* Tanggal Penuh */}
                                        {item.fullDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span>{item.fullDate}</span>
                                            </div>
                                        )}
                                        {/* Waktu */}
                                        {item.timeDisplay && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-400" />
                                                <span>{item.timeDisplay}</span>
                                            </div>
                                        )}
                                        {/* Lokasi / Jenis */}
                                        {item.location && (
                                            <div className="flex items-center gap-2 sm:col-span-2">
                                                {item.type === "Online" ? <Video size={16} className="text-gray-400" /> : <MapPin size={16} className="text-gray-400" />}
                                                <span>{item.location}</span> 
                                            </div>
                                        )}
                                    </div>

                                    
                                    {/* Tombol HANYA akan tampil jika status 'upcoming' DAN item.link ada isinya (bukan null) */}
                                    {/* {item.status === 'upcoming' && item.link && (
                                        <a 
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()} // Penting: mencegah navigasi detail saat klik tombol
                                            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-blue-200 shadow-sm mt-3"
                                        >
                                            Daftar Sekarang <ExternalLink size={16} />
                                        </a>
                                    )} */}

                                </div>
                            </div>
                        ))
                    ) : (
                        // Tampilan jika tidak ada event
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Belum ada jadwal kegiatan baru.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}