import React, { useEffect, useState } from "react";
import { 
    MessageSquare, 
    Shield, 
    MapPinCheck, 
    User, 
    Loader2, 
    Gamepad2, 
    Star, 
    ArrowRight,
    Inbox,
    FileText,
    Activity,
    Send,
    Bot,
    Sparkles,
    Calendar,
    Download,
    ExternalLink
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom"; 
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- IMPORT KOMPONEN & API ---
import Navbar from "../components/Navbar";
import useDashboardData from "../hooks/useDashboardData";
import { getUserProfile } from "../api/user"; 

// --- KOMPONEN HELPER (TIDAK BERUBAH) ---
const createPinHtml = ({ color = "#ef4444", size = 32 } = {}) => {
    const stroke = "#ffffff";
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" >
        <path d="M12 21s6-5.333 6-10a6 6 0 10-12 0c0 4.667 6 10 6 10z" fill="${color}" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
        <path d="M9 12l1.8 1.8L15 9.6" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

const Button = ({ onClick, children, className = "", variant }) => {
    let base = "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all h-10 px-5 py-2 rounded-xl active:scale-95";
    
    if (variant === "ghost") base += " hover:bg-gray-100 hover:text-blue-600 text-gray-600";
    else if (variant === "outline") base += " border border-gray-300 bg-white text-gray-700 hover:bg-gray-50";
    else if (variant === "white") base += " bg-white text-blue-700 hover:bg-blue-50 shadow-md"; 
    else if (variant === "black") base += " bg-slate-900 text-white hover:bg-slate-800 shadow-lg"; 
    else base += " bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-sm"; 
    
    return <button type="button" onClick={onClick} className={`${base} ${className}`}>{children}</button>;
};

const Card = ({ onClick, children, className = "" }) => (
    <div onClick={onClick} className={`bg-white shadow-sm border border-gray-100 rounded-2xl ${className} ${onClick ? "cursor-pointer active:scale-[0.99] transition-all hover:border-blue-300 hover:shadow-md" : ""}`}>{children}</div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-4 px-1">
        <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">{subtitle}</p>
        </div>

        {action && (
            <div className="flex justify-end sm:justify-start">
                {action}
            </div>
        )}
    </div>
);

const ImageWithFallback = ({ src, alt, className = "" }) => (
    <img src={src} alt={alt} className={className} loading="lazy" onError={(e) => (e.target.src = "https://via.placeholder.com/400x200?text=No+Image")} />
);

// --- MAIN DASHBOARD ---

export default function Dashboard() {
    const navigate = useNavigate();
    
    const [realUser, setRealUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [currentXP, setCurrentXP] = useState(0);

    const {
        mapCenter,
        showMap,
        articles,          
        loadingArticles,   
        getCategoryColor,
        handleStartChat,
        handleGoToMaps,
        handleGoToAllArticles,
        handleArticleDetail,
        handleGoToProfile,
    } = useDashboardData();

    // --- FUNCTION HANDLE BARU ---
    const handleOpenPDF = () => {
        window.open("/Salinan-Permendikbudristek-Nomor-55-Tahun-2024-PPKPT (1).pdf", "_blank");
    };

    const handleOpenChatBot = () => {
        window.open('https://t.me/gugahassistant_bot', '_blank');
    };

    // --- EFFECT: FETCH DATA USER & XP ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 1. Ambil Data User
                const userData = await getUserProfile(); 
                let finalUser = null;

                if (userData) {
                    finalUser = userData;
                } else {
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                        finalUser = JSON.parse(storedUser);
                    }
                }
                setRealUser(finalUser);

                // 2. LOGIC XP
                const localGameXP = localStorage.getItem("userXp");
                
                if (localGameXP) {
                    setCurrentXP(parseInt(localGameXP));
                } else if (finalUser?.xp) {
                    setCurrentXP(finalUser.xp);
                    localStorage.setItem("userXp", finalUser.xp.toString());
                } else {
                    setCurrentXP(0);
                }

            } catch (error) {
                const errorCode = error.response?.status;
                if(errorCode === 401) {
                    navigate('/login');
                    return;
                }
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, []);

    const detectRole = () => {
        const roleFromState = realUser?.role;
        const roleFromStorageKey = localStorage.getItem("userRole");
        let roleFromUserObj = "";
        try {
            const userObj = JSON.parse(localStorage.getItem("user") || "{}");
            roleFromUserObj = userObj?.role;
        } catch(e) {}

        const allRoles = [roleFromState, roleFromStorageKey, roleFromUserObj];
        const isSatgasDetected = allRoles.some(r => r && r.toString().toLowerCase() === "satgas");

        return isSatgasDetected ? "satgas" : "user";
    };

    const userRole = detectRole();
    const isSatgas = userRole === "satgas"; 
    const userName = realUser?.name || "Pengguna";

    if (loadingUser) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const handleGoToEvents = () => navigate('/events');
    const handleGoToExternal = () => navigate('/partners');

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            
            <Navbar
                role={userRole} 
                showMenu={true}
                rightElement={
                    <div className="flex items-center gap-3">
                        {/* XP tetap ditampilkan untuk semua role agar terlihat gamificationnya */}
                         <div className="hidden sm:flex items-center gap-2 bg-white border border-yellow-200 px-3 py-1.5 rounded-full shadow-sm">
                            <div className="bg-yellow-100 p-1 rounded-full">
                                <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                            </div>
                            <div className="flex items-center">
                                <span className="text-xs font-bold text-gray-800">{currentXP} XP</span>
                            </div>
                        </div>
                        
                        <button onClick={() => handleGoToProfile()} className="p-1 hover:bg-gray-100 rounded-full transition relative group">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 overflow-hidden">
                                <User className="w-5 h-5 text-blue-700" />
                            </div>
                        </button>
                    </div>
                }
            />

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
                
                {/* HEADER DASHBOARD */}
                <section className={`rounded-3xl p-8 text-white shadow-lg relative overflow-hidden ${isSatgas ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold capitalize">
                                    {isSatgas ? `Siap Bertugas, ${userName}?` : `Halo, ${userName}! 👋`}
                                </h1>
                                {isSatgas && (
                                    <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded border border-white/20 font-bold uppercase tracking-wider">
                                        Satgas
                                    </span>
                                )}
                            </div>
                            <p className="text-white/90 text-lg max-w-xl">
                                {isSatgas 
                                    ? "Pantau laporan masuk dan akses materi edukasi terkini."
                                    : "Selamat datang kembali. Yuk, cek artikel terbaru atau mainkan game edukasi hari ini!"
                                }
                            </p>
                        </div>
                    </div>
                </section>

                {/* === KHUSUS SATGAS: PANEL KONTROL (TETAP ADA DI ATAS) === */}
                {isSatgas && (
                    <section id="satgas-panel">
                        <SectionHeader 
                            icon={Activity}
                            title="Panel Kontrol Satgas" 
                            subtitle="Pusat kendali untuk memantau laporan dan memberikan respon cepat."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* KOTAK MASUK */}
                            <Card onClick={handleStartChat} className="relative overflow-hidden group h-full flex flex-col justify-between p-0">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Inbox className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Kotak Masuk</h3>
                                    <p className="text-sm text-gray-500">
                                        Cek pesan masuk dan berikan bantuan segera.
                                    </p>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                    <div className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Buka Inbox <ArrowRight size={16}/>
                                    </div>
                                </div>
                            </Card>

                            {/* MONITORING AREA */}
                            <div className="md:col-span-1">
                                <Card className="p-0 overflow-hidden border border-gray-200 h-[250px] flex flex-col relative">
                                    <div className="p-4 border-b border-gray-100 bg-white z-10 relative flex justify-between items-center">
                                        <div>
                                            <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                                                <MapPinCheck className="w-4 h-4 text-red-600" />
                                                Live Monitoring
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex-1 relative w-full bg-gray-100">
                                        {showMap && mapCenter ? (
                                            <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={false} zoomControl={false} style={{ width: "100%", height: "100%" }}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker position={mapCenter} icon={PinIcon("#ef4444", 36)} />
                                            </MapContainer>
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400">Peta sedang dimuat...</div>
                                        )}
                                        
                                        <div className="absolute bottom-4 right-4 z-[400]">
                                            <Button onClick={handleGoToMaps} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-lg text-xs h-8 px-3">
                                                Buka Peta Penuh
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </section>
                )}

                {/* === BAGIAN KONTEN (SEKARANG TAMPIL UNTUK SEMUA ROLE) === */}
                
                {/* 1. ARTIKEL */}
                <section id="artikel">
                    <SectionHeader 
                        title="Bacaan Pilihan" 
                        subtitle="Wawasan baru hari ini."
                        className="justify-end"
                        action={<Button onClick={handleGoToAllArticles} variant="ghost">Lihat Semua →</Button>}
                    />

                    {loadingArticles ? (
                        <div className="flex justify-center py-12 bg-white rounded-2xl border border-dashed">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {articles.slice(0, 2).map((a) => (
                                <Card key={a.id} className="overflow-hidden hover:shadow-md transition group h-full flex flex-col">
                                    <div className="aspect-[2/1] bg-gray-100 overflow-hidden relative">
                                        <ImageWithFallback src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getCategoryColor(a.category.name)}`}>
                                            {a.category.name}
                                        </span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">{a.title}</h4>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{a.description}</p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">⏱️ {a.readTime} menit</span>
                                            <button onClick={() => handleArticleDetail(a.id)} className="text-sm font-semibold text-blue-600 hover:underline">Baca</button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Belum ada artikel.</p>
                        </div>
                    )}
                </section>

                {/* 2. GAME */}
                <section id="game">
                    <SectionHeader 
                        icon={Gamepad2}
                        title="Game Edukasi"
                        subtitle="Bermain sambil belajar."
                    />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden group hover:shadow-lg transition">
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="bg-white/20 w-fit p-2 rounded-lg mb-4 backdrop-blur-sm">
                                        <Gamepad2 className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">Red Flag vs Green Flag</h3>
                                    <p className="text-white/90 mb-6 text-sm">Seberapa peka kamu dalam hubungan?</p>
                                </div>
                                <Button 
                                    variant="white" 
                                    onClick={() => navigate('/game')} 
                                    className="w-full sm:w-auto font-bold border-0"
                                >
                                    Main Sekarang
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6 border-dashed border-2 border-gray-300 bg-gray-50 flex items-center justify-center relative min-h-[200px]">
                            <div className="text-center">
                                <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Loader2 className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-400">Game Baru Segera Hadir</p>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 3. LAYANAN & INFORMASI (Disesuaikan untuk Satgas) */}
                <section id="layanan">
                    <SectionHeader 
                        icon={Shield}
                        title="Layanan & Informasi" 
                        subtitle="Akses bantuan dan dokumen penting."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {!isSatgas && (
                            <Card onClick={handleStartChat} className="p-6 hover:border-blue-400 group h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Chat Satgas</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Butuh bantuan mendesak? Chat langsung dengan petugas kami secara privat dan aman.
                                    </p>
                                </div>
                                <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Mulai Chat <ArrowRight size={16}/>
                                </span>
                            </Card>
                        )}

                        {/* KARTU 2: PUSAT INFORMASI (UNTUK SEMUA) */}
                        <Card className="p-6 hover:border-indigo-400 group h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Pusat Informasi</h3>
                            </div>
                            
                            <div className="space-y-3 flex-1">
                                <div onClick={handleOpenPDF} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 cursor-pointer transition-colors border border-gray-100">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-red-500">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800">Permendikbud No. 30</p>
                                        <p className="text-xs text-gray-500">Unduh Dokumen PDF</p>
                                    </div>
                                    <Download size={14} className="text-gray-400" />
                                </div>

                                <div onClick={handleGoToEvents} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 cursor-pointer transition-colors border border-gray-100">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-orange-500">
                                        <Calendar size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800">Webinar & Event</p>
                                        <p className="text-xs text-gray-500">Cek jadwal terdekat</p>
                                    </div>
                                    <ArrowRight size={14} className="text-gray-400" />
                                </div>

                                <div onClick={handleGoToExternal} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 cursor-pointer transition-colors border border-gray-100">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-green-500">
                                        <ExternalLink size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800">Komunitas Eksternal</p>
                                        <p className="text-xs text-gray-500">Jejaring komunitas</p>
                                    </div>
                                    <ArrowRight size={14} className="text-gray-400" />
                                </div>
                            </div>
                        </Card>
                        
                        {!isSatgas && (
                            <div className="md:col-span-2">
                                <Card className="p-0 overflow-hidden border border-gray-200 h-[250px] relative">
                                    <div className="p-4 border-b border-gray-100 bg-white z-10 relative flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <MapPinCheck className="w-5 h-5 text-red-600" />
                                                Peta & Zona Aman
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Pantau lokasi rawan dan temukan posko bantuan terdekat.
                                            </p>
                                        </div>
                                        <Button onClick={handleGoToMaps} variant="outline" className="hidden sm:flex text-xs h-8">
                                            Buka Peta Penuh
                                        </Button>
                                    </div>

                                    <div className="w-full h-full relative">
                                        {showMap && mapCenter ? (
                                            <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={false} zoomControl={false} style={{ width: "100%", height: "100%" }}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker position={mapCenter} icon={PinIcon("#ef4444", 36)} />
                                            </MapContainer>
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400">Peta dimuat...</div>
                                        )}
                                        <div className="absolute bottom-4 right-4 z-[1000] sm:hidden">
                                            <Button onClick={handleGoToMaps} className="hover:bg-blue-100 border hover:text-blue-600 shadow-lg text-xs h-9">
                                                Buka Peta
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. AI ASSISTANT (UNTUK SEMUA) */}
                <section id="chatbot">
                    <SectionHeader 
                        icon={Bot}
                        title="Gugah AI Assistant" 
                        subtitle="Asisten virtual siap sedia 24 jam."
                    />
                    
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-1 shadow-lg overflow-hidden">
                        <div className="bg-white/5 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[20px]">
                            <div className="flex flex-col gap-4"> 
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Send className="w-8 h-8 text-white ml-1" />
                                </div>
                                
                                <div> 
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                        Butuh Teman Cerita?
                                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                                    </h3>
                                    <p className="text-slate-300 text-sm md:text-base max-w-md leading-relaxed">
                                        Jangan bingung sendirian. Tanyakan apa saja seputar edukasi seksual. Langsung dibalas oleh AI, kapan pun kamu butuh.
                                    </p>
                                </div>
                            </div>

                            {/* Tombol */}
                            <Button 
                                onClick={handleOpenChatBot} 
                                variant="white"
                                className="w-full md:w-auto px-8 py-6 text-base shadow-xl border-0 text-indigo-700 hover:bg-indigo-50 font-bold"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Chat di Telegram
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}