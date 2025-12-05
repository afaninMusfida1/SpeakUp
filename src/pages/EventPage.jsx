import React from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Video, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Pastikan path import benar

// --- MOCK DATA EVENT ---
const events = [
    {
        id: 1,
        title: "Webinar: Mengenali Red Flag dalam Hubungan",
        date: "2025-12-15",
        time: "09:00 - 11:30 WIB",
        type: "Online (Zoom)",
        category: "Webinar",
        status: "upcoming", // upcoming, done
        image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800",
        link: "#"
    },
    {
        id: 2,
        title: "Workshop: Pertolongan Pertama Psikologis",
        date: "2025-12-20",
        time: "13:00 - 15:00 WIB",
        type: "Offline (Gd. Serba Guna)",
        category: "Workshop",
        status: "upcoming",
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
        link: "#"
    },
    {
        id: 3,
        title: "Diskusi Panel: Kampus Bebas KS",
        date: "2025-11-10",
        time: "10:00 - 12:00 WIB",
        type: "Online (Zoom)",
        category: "Diskusi",
        status: "done",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
        link: "#"
    }
];

export default function EventsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Pakai Navbar user (role akan auto-detect di dalam komponen Navbar) */}
            <Navbar backButton title="Agenda Kegiatan" />

            <main className="max-w-4xl mx-auto px-4 py-8">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Jadwal Terdekat</h1>
                    <p className="text-gray-500 mt-1">Ikuti kegiatan edukasi dan sosialisasi terbaru.</p>
                </div>

                {/* Event List */}
                <div className="space-y-6">
                    {events.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all group">
                            
                            {/* Date Badge (Mobile: Hidden, Desktop: Show) */}
                            <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl text-blue-700 flex-shrink-0">
                                <span className="text-sm font-bold uppercase">{new Date(item.date).toLocaleString('id-ID', { month: 'short' })}</span>
                                <span className="text-2xl font-black">{new Date(item.date).getDate()}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        item.status === 'upcoming' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {item.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">{item.category}</span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span>{item.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:col-span-2">
                                        {item.type.includes("Online") ? <Video size={16} className="text-gray-400" /> : <MapPin size={16} className="text-gray-400" />}
                                        <span>{item.type}</span>
                                    </div>
                                </div>

                                {item.status === 'upcoming' && (
                                    <button className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-blue-200 shadow-sm">
                                        Daftar Sekarang <ExternalLink size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Belum ada jadwal kegiatan baru.</p>
                    </div>
                )}

            </main>
        </div>
    );
}