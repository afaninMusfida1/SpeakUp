import React, { useState, useMemo, useEffect } from "react";
import axios from "axios"; 
import { Search, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Tambah useSearchParams
import Swal from "sweetalert2"; 
import Navbar from "../components/Navbar";

// Ambil URL API dari env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; 

// Helper warna kategori
const getCategoryColor = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("seksual")) return "bg-pink-100 text-pink-700 border border-pink-200";
    if (name.includes("mental")) return "bg-purple-100 text-purple-700 border border-purple-200";
    if (name.includes("hukum")) return "bg-blue-100 text-blue-700 border border-blue-200";
    if (name.includes("self") || name.includes("pengembangan")) return "bg-teal-100 text-teal-700 border border-teal-200";
    return "bg-gray-100 text-gray-700 border border-gray-200";
};

// Komponen Button Lokal
const Button = ({ onClick, children, className = "", variant }) => {
    let base = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-10 px-4 py-2 rounded-full";
    if (variant === "outline") base += " border border-gray-300 bg-white hover:bg-gray-100 text-gray-700";
    if (variant === "default") base += " bg-purple-600 text-white hover:bg-purple-700 shadow-md";
    return <button type="button" onClick={onClick} className={`${base} ${className}`}>{children}</button>;
};

// Komponen Card Lokal
const Card = ({ onClick, children, className = "" }) => (
    <div onClick={onClick} className={`bg-white shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className} ${onClick ? "cursor-pointer" : ""}`}>
        {children}
    </div>
);

const ImageWithFallback = ({ src, alt, className = "" }) => (
    <img src={src} alt={alt} className={className} loading="lazy" onError={(e) => (e.target.src = "https://via.placeholder.com/400x200?text=No+Image")} />
);

export default function ArticlePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Hook baca URL
    
    // State
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

    // --- EFFECT 1: BACA URL PARAM SAAT LOAD ---
    // Jika URL adalah /articles?category=Mental, maka selectedCategory jadi "Mental"
    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
            // Decode agar spasi terbaca benar (%20 -> spasi)
            setSelectedCategory(decodeURIComponent(categoryFromUrl));
        }
    }, [searchParams]);

    // --- EFFECT 2: FETCH DATA ARTIKEL ---
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/article`);
                const result = response.data;

                if (result.payload && Array.isArray(result.payload.datas)) {
                    setArticles(result.payload.datas);
                } else if (Array.isArray(result)) {
                    setArticles(result); 
                } else {
                    console.warn("Format data artikel tidak dikenali", result);
                    setArticles([]);
                }
            } catch (err) {
                console.error("Fetch Articles Error:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Memuat',
                    text: 'Gagal mengambil data artikel. Coba lagi nanti.',
                    confirmButtonColor: '#9333ea',
                    customClass: { popup: 'rounded-2xl font-sans' }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // 1. Ambil Kategori Unik dari Data Artikel (REAL DATA)
    const dynamicCategories = useMemo(() => {
        if (!articles.length) return ["Semua Kategori"];
        
        const categories = articles
            .map(a => a.category?.name)
            .filter(Boolean); 
            
        return ["Semua Kategori", ...new Set(categories)];
    }, [articles]);

    // 2. Filter Artikel
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (article.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === "Semua Kategori" || article.category?.name === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [articles, searchTerm, selectedCategory]);

    const handleReadArticle = (id) => {
        navigate(`/article/${id}`); 
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-purple-50/70 to-pink-50/70">
            
            {/* NAVBAR MINIMALIS */}
            <Navbar
                backButton={true}
                title="Pusat Artikel Edukasi"
                showMenu={false} 
            />

            <main className="max-w-6xl mx-auto px-4 py-10">
                
                {/* Header Filter Section */}
                <section className="mb-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Jelajahi Artikel</h2>
                    <p className="text-gray-600 mb-6">Temukan wawasan baru untuk hubungan yang lebih sehat.</p>
                    
                    {/* Search Input */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari judul atau topik..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-400"
                        />
                    </div>

                    {/* Dynamic Category Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {loading ? (
                            [1,2,3].map(i => <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse"/>)
                        ) : (
                            dynamicCategories.map(category => (
                                <Button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    className="transition-all duration-200"
                                >
                                    {category}
                                </Button>
                            ))
                        )}
                    </div>
                </section>
                
                {/* Article Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {loading ? 'Memuat...' : `Menampilkan ${filteredArticles.length} Artikel`}
                        </h3>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 className="w-10 h-10 mx-auto mb-4 text-purple-600 animate-spin" />
                            <p className="text-gray-500">Sedang mengambil data artikel terbaru...</p>
                        </div>
                    ) : filteredArticles.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((a) => (
                                <Card 
                                    key={a.id} 
                                    onClick={() => handleReadArticle(a.id)}
                                    className="overflow-hidden border border-gray-100 group flex flex-col h-full"
                                >
                                    <div className="aspect-video bg-gray-100 overflow-hidden relative">
                                        <ImageWithFallback 
                                            src={a.image || "https://via.placeholder.com/400x200?text=No+Image"} 
                                            alt={a.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getCategoryColor(a.category?.name)}`}>
                                                {a.category?.name || "Umum"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-3">
                                            <span>⏱️ {a.readTime || 5} menit baca</span>
                                        </div>
                                        <h4 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors">
                                            {a.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                            {a.description || a.summary || "Tidak ada deskripsi singkat."}
                                        </p> 
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-purple-600 font-bold text-sm">
                                            Baca Selengkapnya <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300"/>
                            <p className="text-lg font-medium text-gray-600">Tidak ada artikel yang cocok.</p>
                            <p className="text-sm text-gray-400">Coba kata kunci lain atau ganti kategori.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}