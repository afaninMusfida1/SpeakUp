import React, { useState, useMemo, useEffect } from "react";
import axios from "axios"; 
import { ArrowLeft, BookText, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_URL; 

const getCategoryColor = (color) => {
    const map = {
        blue: "bg-blue-100 text-blue-700 border border-blue-200", 
        purple: "bg-purple-100 text-purple-700 border border-purple-200",
        pink: "bg-pink-100 text-pink-700 border border-pink-200",
        red: "bg-red-100 text-red-700 border border-red-200",
    };
    return map[color] || map.blue;
};

// Komponen Button 
const Button = ({ onClick, children, className = "", variant }) => {
    let base =
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-10 px-4 py-2";
    if (variant === "ghost") base = "hover:bg-gray-100 hover:text-gray-900";
    if (variant === "outline")
        base = "border border-gray-300 bg-white hover:bg-gray-100";
    if (variant === "default") base = "bg-purple-600 text-white hover:bg-purple-700";

    return (
        <button type="button" onClick={onClick} className={`${base} ${className}`}>
            {children}
        </button>
    );
};

// Komponen Card (TETAP SAMA)
const Card = ({ onClick, children, className = "" }) => (
    <div
        onClick={onClick}
        className={`bg-white shadow-lg rounded-2xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] ${className} ${
            onClick ? "cursor-pointer" : ""
        }`}
    >
        {children}
    </div>
);

const ImageWithFallback = ({ src, alt, className = "" }) => (
    <img src={src} alt={alt} className={className} loading="lazy" />
);

export default function ArticlePage() {
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    
    // State untuk data dari API
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

    // Fetch data dari API saat komponen dimuat
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/article`);
                
                const result = response.data;

                if (result.payload && Array.isArray(result.payload.datas)) {
                    setArticles(result.payload.datas);
                    setError(null);
                } else {
                    setError(result.payload?.message || "Struktur data dari server tidak valid.");
                    setArticles([]);
                }
            } catch (err) {
                console.error("Fetch Articles Error:", err);
                setError("Terjadi kesalahan jaringan saat memuat artikel.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Daftar kategori yang tersedia berdasarkan data yang dimuat dari API
    const ALL_CATEGORIES = useMemo(() => {
        const categories = articles.map(a => a.category.name); 
        return ["Semua Kategori", ...new Set(categories)];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (article.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === "Semua Kategori" || article.category.name === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [articles, searchTerm, selectedCategory]);

    const handleReadArticle = (id) => {
        navigate(`/article/${id}`); 
    };

    if (error) {
         return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar
                    leftElement={<Button onClick={handleBack} variant="ghost" className="rounded-none w-10 h-10 p-0 hover:bg-gray-200"><ArrowLeft className="w-5 h-5 text-gray-700" /></Button>}
                    showMenu={false}
                />
                <main className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Gagal Memuat</h2>
                    <p className="text-gray-600">{error}</p>
                    <Button onClick={handleBack} className="mt-6 bg-red-500 text-white rounded-md hover:bg-red-600" variant="default">Kembali</Button>
                </main>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-purple-50/70 to-pink-50/70">
            <Navbar
                leftElement={
                    <Button onClick={handleBack} variant="ghost" className="rounded-full w-10 h-10 p-0 hover:bg-gray-200">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </Button>
                }
                centerElement={
                    <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        <BookText className="w-6 h-6 text-purple-600" /> Pusat Artikel Edukasi
                    </h1>
                }
                showMenu={false}
            />

            <main className="max-w-6xl mx-auto px-4 py-10">
                
                {/* Header dan Filter */}
                <section className="mb-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Baca Artikel</h2>
                    <p className="text-gray-600 mb-6">Filter, cari, dan pelajari materi penting tentang consent dan hubungan sehat.</p>
                    
                    {/* Search Input */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari artikel (ex: consent, red flags)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-500"
                        />
                    </div>

                    {/* Category Filter Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {loading && articles.length === 0 ? (
                            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                        ) : (
                            ALL_CATEGORIES.map(category => (
                                <Button
                                    key={category.name}
                                    onClick={() => setSelectedCategory(category)}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                                        selectedCategory === category
                                            ? "bg-purple-600 text-white shadow-md hover:bg-purple-700"
                                            : "border-gray-300 text-gray-700 bg-gray-50 hover:bg-purple-50 hover:border-purple-300"
                                    }`}
                                >
                                    {category}
                                </Button>
                            ))
                        )}
                    </div>
                </section>
                
                <hr className="mb-8 border-t-2 border-purple-200/50"/>

                {/* Article List */}
                <section>
                    <h3 className="text-2xl font-bold mb-8 text-gray-800">
                        {loading ? 'Memuat Artikel...' : `Hasil (${filteredArticles.length} Artikel)`}
                    </h3>

                    {loading && articles.length === 0 ? (
                        <div className="text-center p-16">
                            <Loader2 className="w-8 h-8 mx-auto mb-4 text-purple-500 animate-spin" />
                            <p className="text-gray-600">Sedang memuat data artikel...</p>
                        </div>
                    ) : (
                        filteredArticles.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredArticles.map((a) => (
                                    <Card 
                                        key={a.id} 
                                        onClick={() => handleReadArticle(a.id)}
                                        className="overflow-hidden border border-gray-100 group"
                                    >
                                        <div className="aspect-video bg-gray-100 overflow-hidden">
                                            <ImageWithFallback 
                                                src={a.imageUrl} 
                                                alt={a.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" 
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getCategoryColor(a.color)}`}>
                                                    {a.category.name}
                                                </span>
                                                <span className="text-gray-500 text-sm flex items-center gap-1 font-medium">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                    {a.timeRead ? `${a.timeRead} menit` : '...'}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{a.title}</h4>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{a.summary}</p> 
                                            <div className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800">
                                                Baca Selengkapnya <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-16 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 bg-white/70">
                                <Search className="w-8 h-8 mx-auto mb-4 text-gray-400"/>
                                <p className="text-lg font-medium">Ops, tidak ada hasil yang ditemukan.</p>
                                <p className="text-sm">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
                            </div>
                        )
                    )}
                </section>
            </main>
        </div>
    );
}