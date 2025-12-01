import React, { useEffect, useState } from "react";
import { 
    MessageSquare, 
    HeartHandshake, 
    Shield, 
    MapPinCheck, 
    User, 
    Loader2, 
    Gamepad2, 
    Users, 
    Star, 
    ArrowRight,
    Inbox,
    FileText,
    Activity
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom"; 
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- IMPORT KOMPONEN & API ---
import Navbar from "../components/Navbar";
import useDashboardData from "../hooks/useDashboardData";
import { getUserProfile } from "../api/user"; 

// --- KOMPONEN HELPER ---

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
        {action && action}
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
        unreadChatCount,
        mapCenter,
        showMap,
        articles,          
        loadingArticles,   
        getCategoryColor,
        handleStartChat,
        handleGoToMenfess,
        handleGoToMaps,
        handleGoToAllArticles,
        handleArticleDetail,
        handleGoToProfile,
    } = useDashboardData();

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

                // 2. LOGIC XP (SINKRONISASI GAME)
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
                console.error("Gagal mengambil data user:", error);
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

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            
            <Navbar
                role={userRole} 
                showMenu={true}
                rightElement={
                    <div className="flex items-center gap-3">
                        {/* XP BADGE (Tanpa Level) */}
                        {!isSatgas && (
                            <div className="hidden sm:flex items-center gap-2 bg-white border border-yellow-200 px-3 py-1.5 rounded-full shadow-sm">
                                <div className="bg-yellow-100 p-1 rounded-full">
                                    <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                                </div>
                                <div className="flex items-center">
                                    <span className="text-xs font-bold text-gray-800">{currentXP} XP</span>
                                </div>
                            </div>
                        )}
                        
                        <button onClick={() => handleGoToProfile()} className="p-1 hover:bg-gray-100 rounded-full transition relative group">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 overflow-hidden">
                                <User className="w-5 h-5 text-blue-700" />
                            </div>
                        </button>
                    </div>
                }
            />

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
                
                {/* HEADER */}
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
                                    ? "Pantau laporan masuk dan berikan bantuan segera."
                                    : "Selamat datang kembali. Yuk, cek artikel terbaru atau mainkan game edukasi hari ini!"
                                }
                            </p>
                        </div>
                    </div>
                </section>

                {isSatgas ? (
                    /* === PANEL SATGAS === */
                    <section id="satgas-panel">
                        <SectionHeader 
                            icon={Activity}
                            title="Panel Kontrol" 
                            subtitle="Pusat kendali untuk memantau laporan dan memberikan respon cepat."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card onClick={handleStartChat} className="relative overflow-hidden group h-full flex flex-col justify-between p-0">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Inbox className="w-5 h-5" />
                                        </div>
                                        {unreadChatCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {unreadChatCount} Baru
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Kotak Masuk</h3>
                                    <p className="text-sm text-gray-500">
                                        {unreadChatCount > 0 
                                            ? `${unreadChatCount} pesan menunggu respon.` 
                                            : "Tidak ada pesan baru dari mahasiswa."}
                                    </p>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                    <div className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Buka Inbox <ArrowRight size={16}/>
                                    </div>
                                </div>
                            </Card>

                            <Card onClick={handleGoToMenfess} className="relative overflow-hidden group h-full flex flex-col justify-between p-0">
                                <div className="p-6">
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Laporan Masuk</h3>
                                    <p className="text-sm text-gray-500">
                                        Validasi cerita masuk dan tinjau laporan kekerasan terbaru untuk ditindaklanjuti.
                                    </p>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                    <div className="text-purple-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Tinjau Laporan <ArrowRight size={16}/>
                                    </div>
                                </div>
                            </Card>

                            <div className="md:col-span-2">
                                <Card className="p-0 overflow-hidden border border-gray-200 h-[400px] flex flex-col">
                                    <div className="p-5 border-b border-gray-100 bg-white z-10 relative flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <MapPinCheck className="w-5 h-5 text-red-600" />
                                                Live Monitoring Area
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Pantau persebaran titik laporan dan lokasi posko bantuan secara real-time.
                                            </p>
                                        </div>
                                        <Button onClick={handleGoToMaps} variant="outline" className="hidden sm:flex text-xs h-8">
                                            Buka Peta Penuh
                                        </Button>
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
                                        
                                        <div className="absolute bottom-4 right-4 z-[400] sm:hidden">
                                            <Button onClick={handleGoToMaps} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-lg text-xs h-9">
                                                Buka Peta
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </section>
                ) : (
                    /* === PANEL USER === */
                    <>
                        {/* ARTIKEL */}
                        <section id="artikel">
                            <SectionHeader 
                                title="Bacaan Pilihan" 
                                subtitle="Wawasan baru hari ini."
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

                        {/* GAME */}
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

                        {/* LAYANAN USER */}
                        <section id="layanan">
                            <SectionHeader 
                                icon={Shield}
                                title="Layanan Bantuan" 
                                subtitle="Kami siap membantu."
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 1. CHAT SATGAS - Deskripsi Diperjelas */}
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

                                {/* 2. MENFESS - Deskripsi Diperjelas */}
                                <Card onClick={handleGoToMenfess} className="p-6 hover:border-purple-400 group h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                                            <HeartHandshake className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Menfess</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Ingin bercerita tapi malu? Tulis pesan anonim di sini, identitasmu tetap rahasia.
                                        </p>
                                    </div>
                                    <span className="text-purple-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Kirim Menfess <ArrowRight size={16}/>
                                    </span>
                                </Card>

                                {/* 3. PETA - Deskripsi Diperjelas */}
                                <div className="md:col-span-2">
                                    <Card className="p-0 overflow-hidden border border-gray-200 h-[250px] relative">
                                        <div className="p-4 border-b border-gray-100 bg-white z-10 relative flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                    <MapPinCheck className="w-5 h-5 text-red-600" />
                                                    Peta & Zona Aman
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Pantau lokasi rawan dan temukan posko bantuan terdekat secara real-time.
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
                                        </div>
                                        <div className="absolute bottom-4 right-4 z-[400] sm:hidden">
                                            <Button onClick={handleGoToMaps} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-lg text-xs h-9">
                                                Buka Peta
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </section>

                        {/* KOMUNITAS */}
                        <section id="komunitas">
                            <SectionHeader 
                                icon={Users}
                                title="Komunitas" 
                                subtitle="Diskusi & Dukungan."
                            />
                            
                            <div className="bg-white rounded-2xl border border-gray-200 p-1">
                                <div className="flex flex-col md:flex-row items-center">
                                    <div className="p-6 md:w-2/3">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Topik: "Etika Digital"</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Yuk, diskusi tentang menjaga sopan santun di dunia maya.
                                        </p>
                                        <div className="flex gap-3">
                                            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                                                Gabung
                                            </Button>
                                            <Button variant="outline">
                                                Lainnya
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 bg-teal-50 h-full min-h-[140px] rounded-xl flex flex-col items-center justify-center text-teal-300 p-4">
                                        <div className="flex -space-x-2 mb-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover"/>
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                                                +99
                                            </div>
                                        </div>
                                        <span className="text-teal-700 text-xs font-bold">450+ Bergabung</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}

            </main>
        </div>
    );
}