import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { ArrowLeft, BookText, Shield, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_URL; 

const formatContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements = [];
    let currentList = null; 
    let listItems = [];

    const flushList = (type, items) => {
        if (items.length === 0) return;
        
        const listElement = type === 'ul' ? (
            <ul key={`list-${elements.length}`} className="list-disc ml-8 mb-4 space-y-2 text-gray-700">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        ) : (
            <ol key={`list-${elements.length}`} className="list-decimal ml-8 mb-4 space-y-2 text-gray-700">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
        );
        elements.push(listElement);
    };

    lines.forEach((line) => {
        const trimmedLine = line.trim();
        const formattedText = trimmedLine
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        if (trimmedLine.startsWith('### ')) {
            if (currentList) flushList(currentList, listItems);
            currentList = null;
            listItems = [];

            const heading = trimmedLine.substring(4);
            elements.push(<h3 key={`h3-${elements.length}`} className="text-2xl font-extrabold mt-8 mb-4 text-purple-700 border-b border-gray-100 pb-2">{heading}</h3>);
        } 
        else if (trimmedLine.startsWith('* ')) {
            if (currentList === 'ol') flushList(currentList, listItems);
            if (currentList !== 'ul') currentList = 'ul';
            listItems.push(formattedText.substring(2).trim());
        } 
        else if (trimmedLine.match(/^\d+\. /)) {
            if (currentList === 'ul') flushList(currentList, listItems);
            if (currentList !== 'ol') currentList = 'ol';
            listItems.push(formattedText.replace(/^\d+\. /, '').trim());
        } 
        else {
            if (currentList) flushList(currentList, listItems);
            currentList = null;
            listItems = [];

            if (trimmedLine.length > 0) {
                elements.push(<div key={`p-${elements.length}`} className="mb-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{__html: formattedText}}></div>);
            }
        }
    });

    if (currentList) flushList(currentList, listItems);

    return elements;
};

const getCategoryColor = (color) => {
    const map = {
        blue: "bg-blue-100 text-blue-700 border border-blue-200",
        purple: "bg-purple-100 text-purple-700 border border-purple-200",
        pink: "bg-pink-100 text-pink-700 border border-pink-200",
        red: "bg-red-100 text-red-700 border border-red-200",
    };
    return map[color] || "bg-gray-100 text-gray-700 border border-gray-200";
};

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

export default function ArticleDetail() {
    const { id } = useParams();
    const articleId = parseInt(id); 
    
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    
    const [articleData, setArticleData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        if (isNaN(articleId)) {
            setError("ID Artikel tidak valid.");
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            try {
                console.log(articleId)
                const response = await axios.get(`${API_BASE_URL}/article/${articleId}/content`);
                
                const result = response.data;
                console.log(articleId)
                console.log(result)

                if (result.code !== 200 || !result.data) {
                    setError(result.message || "Gagal memuat artikel atau artikel tidak ditemukan.");
                } else {
                    setArticleData({
                        ...result.data,
                        content: result.data.content && result.data.content.length > 0 
                                 ? result.data.content[0].content 
                                 : "Konten artikel belum tersedia."
                    });
                }
            } catch (err) {
                console.error("Fetch Article Error:", err);
                setError("Terjadi kesalahan jaringan saat memuat data.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    const categoryClass = articleData ? getCategoryColor(articleData.color) : "bg-gray-100 text-gray-700";
    const titleColor = articleData?.color === 'blue' ? 'text-blue-700' : 
                       articleData?.color === 'purple' ? 'text-purple-700' : 'text-gray-900';

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar
                    leftElement={<Button onClick={handleBack} variant="ghost" className="rounded-none w-10 h-10 p-0 hover:bg-gray-200"><ArrowLeft className="w-5 h-5 text-gray-700" /></Button>}
                    showMenu={false}
                />
                <main className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">404 Tidak Ditemukan</h2>
                    <p className="text-gray-600">{error}</p>
                    <Button onClick={handleBack} className="mt-6 bg-red-500 text-white rounded-md hover:bg-red-600" variant="default">Kembali</Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar
                leftElement={
                    <Button onClick={handleBack} variant="ghost" className="rounded-none w-10 h-10 p-0 hover:bg-gray-200">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </Button>
                }
                centerElement={
                    <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        <BookText className="w-6 h-6 text-purple-600" /> Baca Artikel
                    </h1>
                }
                showMenu={false}
            />

            <main className="max-w-7xl mx-auto">
                {loading || !articleData ? (
                    <div className="text-center p-20 flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                        <p className="text-gray-600">Memuat konten artikel...</p>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row shadow-lg bg-gray-50/50">
                        
                        {/* 1. Header Gambar */}
                        <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                            <img 
                                src={articleData.imageUrl || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"} 
                                alt={`Sampul ${articleData.title}`} 
                                className="w-full h-full object-cover shadow-xl transition-transform duration-500 hover:scale-[1.03]"
                                loading="lazy"
                            />
                        </div>
                        
                        {/* 2. Konten Utama */}
                        <div className="w-full md:w-1/2 bg-white p-8 lg:p-12 shadow-inner">
                            {/* Metadata */}
                            <header className="mb-8 border-b pb-4 border-gray-100">
                                <span className={`px-4 py-1 text-xs font-bold rounded-md ${categoryClass} inline-block mb-3`}>
                                    {articleData.category} 
                                </span>
                                
                                <h2 className={`text-3xl lg:text-4xl font-extrabold ${titleColor} mb-3 leading-tight`}>
                                    {articleData.title}
                                </h2>
                                
                                <div className="text-gray-500 text-sm flex items-center gap-4 mt-2">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        {articleData.timeRead ? `${articleData.timeRead} menit` : '...'} 
                                    </span>
                                </div>
                            </header>

                            {/* Konten Artikel */}
                            <div className="text-base lg:text-lg h-96 overflow-y-auto pr-4">
                                {formatContent(articleData.content)} 
                            </div>
                            
                            {/* CTA */}
                            <footer className="mt-8 pt-6 border-t border-gray-200">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md flex items-center justify-between border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-purple-600 flex-shrink-0" />
                                        <p className="text-sm font-medium text-gray-700">Butuh bantuan segera?</p>
                                    </div>
                                    <Button onClick={() => navigate("/chat")} className="bg-purple-600 text-white rounded-md px-4 py-2 hover:bg-purple-700 transition duration-300 shadow-md" variant="default">
                                        Chat Anonim
                                    </Button>
                                </div>
                            </footer>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}