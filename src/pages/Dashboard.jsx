import {MessageSquare, HeartHandshake, Shield, MapPinCheck, User, Loader2} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar";
import useDashboardData from "../hooks/useDashboardData";

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
    let base = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-10 px-4 py-2";
    if (variant === "ghost") base = "hover:bg-gray-100 hover:text-gray-900";
    if (variant === "outline") base = "border border-gray-300 bg-white hover:bg-gray-100";
    return <button type="button" onClick={onClick} className={`${base} ${className}`}>{children}</button>;
};

const Card = ({ onClick, children, className = "" }) => (
    <div onClick={onClick} className={`bg-white shadow-sm rounded-2xl ${className} ${onClick ? "cursor-pointer" : ""}`}>{children}</div>
);

const ImageWithFallback = ({ src, alt, className = "" }) => (
    <img src={src} alt={alt} className={className} loading="lazy" onError={(e) => (e.target.src = "https://via.placeholder.com/400x200?text=No+Image")} />
);

// MAIN COMPONENT
export default function Dashboard() {
    const navigate = (path) => window.location.href = path; 
    
    // Panggil Hook
    const {
        isSatgas,
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
        chatButtonText
    } = useDashboardData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Navbar
                rightElement={
                    <button onClick={() => handleGoToProfile()} className="p-2 hover:bg-white/40 rounded-full transition">
                        <User className="w-6 h-6 text-gray-700" />
                    </button>
                }
                showMenu={false}
            />

            <main className="max-w-6xl mx-auto px-4 py-10">
                {/* Greeting & Header Section (TETAP SAMA) */}
                <section className="mb-6 px-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Halo, kamu aman di sini</h1>
                            <p className="text-sm text-gray-600 mt-1">Ruang aman untuk belajar dan mendapatkan dukungan.</p>
                        </div>
                        <div className="hidden sm:block opacity-80">
                            <Shield className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                </section>

                {/* Action Cards (Chat & Menfess) - TETAP SAMA */}
                <section className="grid md:grid-cols-2 gap-6 mb-10">
                    <Card onClick={handleStartChat} className="p-6 border hover:border-blue-300 hover:shadow-lg transition relative overflow-hidden">
                         <div className="absolute -top-6 -right-6 w-40 h-40 bg-blue-100 rounded-full opacity-70" />
                         <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 mb-3 relative">
                                <MessageSquare className="w-6 h-6" />
                                {isSatgas && unreadChatCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-md">{unreadChatCount}</span>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{isSatgas && unreadChatCount > 0 ? "Sesi Baru Masuk" : chatButtonText}</h3>
                            <p className="text-gray-600 text-sm mb-4">{isSatgas ? `Ada ${unreadChatCount} sesi baru.` : 'Bantuan real-time & anonim.'}</p>
                            <div className="inline-flex items-center gap-2 text-blue-600 font-medium">Buka Sesi Chat <span aria-hidden>→</span></div>
                        </div>
                    </Card>

                    <Card onClick={handleGoToMenfess} className="p-6 border hover:border-purple-300 hover:shadow-lg transition relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-40 h-40 bg-purple-100 rounded-full opacity-70" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 mb-3">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Menfess Aman</h3>
                            <p className="text-gray-600 text-sm mb-4">Kirim cerita atau laporan secara anonim.</p>
                            <div className="inline-flex items-center gap-2 text-purple-600 font-medium">Kirim Menfess <span aria-hidden>→</span></div>
                        </div>
                    </Card>
                </section>

                {/* MAP SECTION (TETAP SAMA) */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold flex items-center gap-2"><MapPinCheck className="w-5 h-5 text-red-500" /> Lokasi Darurat Terdekat</h2>
                        <Button onClick={handleGoToMaps} variant="ghost" className="text-sm">Lihat Selengkapnya →</Button>
                    </div>
                    <div className="w-full h-[240px] overflow-hidden shadow-md border rounded-xl bg-gray-100">
                        {showMap && mapCenter ? (
                            <MapContainer center={mapCenter} zoom={16} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={mapCenter} icon={PinIcon("#ef4444", 36)} />
                            </MapContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Memuat peta atau lokasi tidak diizinkan...</div>
                        )}
                    </div>
                </section>

                {/* ARTICLES SECTION (UPDATED) */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-semibold">📚 Edukasi & Artikel</h3>
                            <p className="text-gray-600 text-sm">Artikel terbaru untukmu</p>
                        </div>
                        <Button onClick={handleGoToAllArticles} variant="ghost">Lihat Semua →</Button>
                    </div>

                    {/* LOGIC TAMPILAN ARTIKEL */}
                    {loadingArticles ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {articles.map((a) => (
                                <Card key={a.id} className="overflow-hidden hover:shadow-md transition">
                                    <div className="aspect-video bg-gray-100 overflow-hidden">
                                        <ImageWithFallback src={a.image} alt={a.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(a.category.name)}`}>
                                                {a.category.name}
                                            </span>
                                            <span className="text-gray-500 text-sm">⏱️ {a.readTime}</span>
                                            <span className="text-gray-500 text-sm">⭐ {a.requiredXp} xp</span>
                                        </div>
                                        <h4 className="text-lg font-semibold mb-2 line-clamp-2">{a.title}</h4>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{a.description}</p>
                                        <Button 
                                            onClick={() => handleArticleDetail(a.id)} 
                                            variant="ghost" 
                                            className="text-blue-600 p-0 h-auto"
                                        >
                                            Baca Selengkapnya →
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Belum ada artikel yang tersedia.</p>
                        </div>
                    )}
                </section>

                {/* BOTTOM CTA (TETAP SAMA) */}
                <section>
                    <Card className="p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                        <div className="max-w-2xl mx-auto text-center">
                            <Shield className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Butuh Bantuan Sekarang?</h3>
                            <p className="opacity-90 mb-6">Tim Satgas siap membantu 24/7.</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={handleStartChat} className="bg-white text-blue-600 rounded-2xl px-6">
                                    <MessageSquare className="w-4 h-4 mr-2" /> Chat dengan Satgas
                                </Button>
                                <Button 
                                    onClick={handleGoToMaps} 
                                    className="rounded-2xl px-6 border border-white bg-transparent text-white hover:bg-white/20 flex items-center"
                                >
                                    <MapPinCheck className="w-4 h-4 mr-2" /> Cari Bantuan Terdekat
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </main>
        </div>
    );
}