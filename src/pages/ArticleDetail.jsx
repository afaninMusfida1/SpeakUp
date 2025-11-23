import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { ArrowLeft, BookOpen, Shield, Calendar, Clock, User, Share2, BookText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Utility function untuk menggabungkan classNames
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

const formatContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements = [];
    let currentList = null; 
    let listItems = [];

    const flushList = (type, items) => {
        if (items.length === 0) return;
        
        const listElement = type === 'ul' ? (
            <ul key={`list-${elements.length}`} className="list-disc ml-6 md:ml-8 mb-8 space-y-3 text-article-text text-[17px] md:text-[18px] leading-[1.8] marker:text-primary">
                {items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{__html: item}} />)}
            </ul>
        ) : (
            <ol key={`list-${elements.length}`} className="list-decimal ml-6 md:ml-8 mb-8 space-y-3 text-article-text text-[17px] md:text-[18px] leading-[1.8] marker:text-primary marker:font-semibold">
                {items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{__html: item}} />)}
            </ol>
        );
        elements.push(listElement);
    };

    lines.forEach((line) => {
        const trimmedLine = line.trim();
        const formattedText = trimmedLine
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-article-heading">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

        if (trimmedLine.startsWith('### ')) {
            if (currentList) flushList(currentList, listItems);
            currentList = null;
            listItems = [];

            const heading = trimmedLine.substring(4);
            elements.push(
                <h3 key={`h3-${elements.length}`} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-article-heading leading-tight tracking-tight">
                    {heading}
                </h3>
            );
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
                elements.push(
                    <p key={`p-${elements.length}`} 
                       className="mb-6 text-article-text text-[17px] md:text-[18px] leading-[1.8] tracking-wide" 
                       dangerouslySetInnerHTML={{__html: formattedText}}>
                    </p>
                );
            }
        }
    });

    if (currentList) flushList(currentList, listItems);

    return elements;
};

const getCategoryColor = (color) => {
    const map = {
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
        pink: "bg-pink-50 text-pink-700 border-pink-100",
        red: "bg-red-50 text-red-700 border-red-100",
    };
    return map[color] || "bg-secondary text-secondary-foreground border-border";
};

const Button = ({ onClick, children, className = "", variant = "default", size = "default", ...props }) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
    
    const variantClasses = {
        default: "bg-primary text-primary-foreground shadow-soft-md hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-soft-md hover:bg-destructive/90",
        outline: "border border-border bg-background shadow-soft hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        article: "bg-primary text-primary-foreground shadow-soft-lg hover:shadow-soft-xl hover:bg-primary/90 rounded-2xl",
    };

    const sizeClasses = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
    };

    return (
        <button 
            type="button" 
            onClick={onClick} 
            className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} 
            {...props}
        >
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
                const response = await axios.get(`${API_BASE_URL}/article/${articleId}/content`);
                const result = response.data?.payload?.datas;
                
                if (!result || !result.id) {
                    setError("Gagal memuat artikel atau artikel tidak ditemukan.");
                } else {
                    const joinedContent = result.contents && Array.isArray(result.contents)
                        ? result.contents.map(item => item.content).join('\n\n') 
                        : "Konten artikel belum tersedia.";

                    setArticleData({ ...result, content: joinedContent });
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

    const categoryClass = articleData ? getCategoryColor(articleData.color) : "";

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
                        <Button onClick={handleBack} variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> 
                            <span className="hidden sm:inline">Kembali</span>
                        </Button>
                    </div>
                </nav>
                <main className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                    <div className="bg-card p-8 rounded-3xl shadow-soft-xl max-w-md w-full border border-border">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Artikel Tidak Ditemukan</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button onClick={handleBack} variant="outline" className="w-full">
                            Kembali
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    if (loading || !articleData) {
        return (
            <div className="min-h-screen bg-background">
                <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
                        <Button onClick={handleBack} variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> 
                            <span className="hidden sm:inline">Kembali</span>
                        </Button>
                    </div>
                </nav>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-pulse">
                    <div className="h-8 bg-muted rounded-full w-1/4"></div>
                    <div className="h-12 bg-muted rounded-xl w-3/4"></div>
                    <div className="h-64 bg-muted rounded-3xl w-full"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-4/5"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-article-bg selection:bg-primary/10 selection:text-primary">
            <Navbar
                showMenu={false}
            />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-2 md:py-2 animate-fade-in">
                
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali</span>
                </button>

                {/* Article Header */}
                <header className="text-center max-w-3xl mx-auto mb-12">
                    <span className={cn(
                        "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border mb-6 transition-transform hover:scale-105 cursor-default uppercase tracking-wide",
                        categoryClass
                    )}>
                        {articleData.category?.name || "Edukasi"}
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-article-heading leading-[1.2] mb-8 tracking-tight text-balance">
                        {articleData.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-article-meta">
                        {/* <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                <User size={14} className="text-accent-foreground" />
                            </div>
                            <span className="font-medium">{articleData.author?.name || "Tim SpeakUp"}</span>
                        </div> */}
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-primary/60" />
                            <span>{articleData.timeRead ? `${articleData.timeRead} menit baca` : '3 menit baca'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary/60" />
                            <span>{new Date(articleData.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative w-full aspect-video md:aspect-[2.4/1] rounded-3xl overflow-hidden shadow-soft-xl mb-12 group border border-article-border">
                    <img 
                        src={articleData.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"} 
                        alt={articleData.title}
                        className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>

                {/* Article Content */}
                <article className="max-w-2xl mx-auto">
                    {articleData.summary && (
                        <div className="text-[19px] md:text-[21px] text-article-meta leading-[1.7] italic border-l-4 border-primary pl-6 md:pl-8 mb-12 py-2">
                            {articleData.summary}
                        </div>
                    )}

                    <div className="article-body space-y-6">
                        {formatContent(articleData.content)}
                    </div>
                </article>

                {/* CTA Section */}
                <div className="max-w-3xl mx-auto mt-20 pt-12 border-t border-article-border">
                    <div className="bg-gradient-to-br from-accent via-accent/50 to-background rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-article-border shadow-soft-lg">
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-2xl mb-2">
                                <BookOpen size={28} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-article-heading">Butuh Teman Cerita?</h3>
                            <p className="text-article-text text-[16px] leading-relaxed max-w-md">
                                Artikel ini hanya langkah awal. Jika kamu butuh bantuan atau sekadar ingin didengar, Satgas kami siap 24/7.
                            </p>
                        </div>
                        <Button 
                            onClick={() => navigate("/chat")} 
                            variant="article" 
                            size="lg"
                            className="w-full md:w-auto px-10 shadow-soft-xl hover:shadow-soft-xl text-white"
                        >
                            Mulai Chat Anonim
                        </Button>
                    </div>
                </div>

            </main>
        </div>
    );
}
