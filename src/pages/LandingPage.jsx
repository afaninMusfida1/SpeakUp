import React, { useEffect, useRef, useState } from "react"; 
import { AlertTriangle, Users, Home, Heart, MessageCircle, MapPin, Shield, Lock, ArrowRight, ArrowUp, Bot, Play, Gamepad2, Activity, CheckCircle, ArrowDown, BookOpen, Handshake, FileCheck, Award, CheckCheck, Sparkles } from "lucide-react";
import Swal from "sweetalert2"; 
import { HERO_IMAGE_URL } from '../lib/landingPageUtils'; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageWithFallback from "../components/common/ImageWithFallback"; 
import useLandingPageData from "../hooks/useLandingPageData";

const SimpleFadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100";
    if (direction === "up") return "translate-y-10 opacity-0";
    if (direction === "left") return "-translate-x-10 opacity-0";
    if (direction === "right") return "translate-x-10 opacity-0";
    return "opacity-0";
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// WAVE COMPONENTS 

const SectionTopWave = ({ color, className = "" }) => (
  <div className={`absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-[99%] z-10 pointer-events-none ${className}`}>
    <svg 
      className={`relative block w-full h-[60px] md:h-[100px] lg:h-[150px] ${color}`} 
      data-name="Layer 1" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none"
      style={{ transform: 'rotate(180deg)', shapeRendering: 'geometricPrecision' }} 
    >
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
    </svg>
  </div>
);

const SectionBottomWave = ({ color="fill-blue-600", className = "" }) => (
  <div className={`absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none ${className}`}>
    <svg 
      className={`relative block w-full h-[60px] md:h-[100px] lg:h-[150px] ${color}`} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={{ transform: 'translateY(1px)' }}
    >
      <path 
        fillOpacity="1" 
        d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,149.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </div>
);

const LandingPage = () => {
  const { handleLogin, navigate } = useLandingPageData();
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const handleMapNavigation = () => {
      Swal.fire({
          title: 'Mencari Lokasi Aman...',
          text: 'Mengalihkan ke peta perlindungan terdekat.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
          willClose: () => navigate('/maps'),
          customClass: { popup: 'rounded-3xl font-sans' }
      });
  };

  const handleArtikelNavigation = () => {
      navigate('/articles')
  };

  const handleGameNavigation = () => {
      navigate('/login')
  };

  const SkipToContent = () => (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-full focus:shadow-lg focus:ring-2 focus:ring-blue-600 focus:text-blue-600 font-semibold"
    >
      Langsung ke Konten Utama
    </a>
  );

  const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 overflow-x-hidden">
      <SkipToContent />
      <Navbar showMenu={true} showUrgent={true} className="bg-white" />

      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 items-center">
  
  {/* --- BUTTON AI (Dengan Logic isVisible & Animasi Ripple) --- */}
  <div className={`relative group transform transition-all duration-300 ${
      isVisible 
        ? 'opacity-100 translate-y-0 visible' 
        : 'opacity-0 translate-y-10 invisible'
    }`}>
    
    {/* Animasi Ping/Sinyal */}
    <span className="absolute -inset-0.5 rounded-full bg-purple-500 opacity-75 animate-ping"></span>
    
    {/* Tombol Link Telegram */}
    <a
      href="https://t.me/gugahassistant_bot" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Chat dengan AI di Telegram"
      className="animate-bounce flex items-center justify-center p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
>
      <Sparkles size={24} />
    </a>
  </div>

  {/* --- BUTTON UP (Logic isVisible Asli) --- */}
  <button
    onClick={scrollToTop}
    aria-label="Kembali ke atas"
    className={`p-3 bg-blue-600 text-white rounded-full shadow-lg transform transition-all duration-300 ${
      isVisible 
        ? 'opacity-100 translate-y-0 visible' 
        : 'opacity-0 translate-y-10 invisible'
    } hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
  >
    <ArrowUp size={24} />
  </button>

</div>

      {/* Progress bar */}
      {/* <div className="fixed top-0 left-0 right-0 h-1.5 bg-blue-300 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(100, (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)}%`
          }}
          role="progressbar"
          aria-valuenow={Math.min(100, Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100))}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div> */}

      {/* Main content */}
      <main id="main-content" tabIndex="-1">
     {/* ================= SECTION 1: HERO ================= */}
      <section id="home" className="relative overflow-hidden py-15 md:py-16 -mt-10">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" aria-hidden="true" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" aria-hidden="true" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" aria-hidden="true" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            
            <div className="space-y-5 mt-20 md:mt-0">
              <SimpleFadeIn delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                   </span>
                  <span className="flex text-sm font-medium text-blue-700">Pendidikan & Pencegahan</span>
                </div>
              </SimpleFadeIn>

              <SimpleFadeIn delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      GUGAH
                    </span>
                    <span> Kesadaran,</span> 
                    <br className="hidden lg:block" />
                    <span>
                      Cegah Kekerasan
                    </span>
                  </h1>
              </SimpleFadeIn>

              <SimpleFadeIn delay={200}>
                {/* --- TEKS BARU (Updated) --- */}
                <div className="space-y-4">
                    <p className="text-base text-gray-700 leading-relaxed font-medium">
                        Gugah adalah platform edukasi yang berfokus pada pendidikan komprehensif dan upaya pencegahan kekerasan.
                    </p>
                </div>
                {/* -------------------------------- */}
              </SimpleFadeIn>

              <SimpleFadeIn delay={300}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={handleLogin}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Masuk ke akun Anda"
                      >
                        Mulai Belajar <ArrowRight size={18} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => document.getElementById('layanan').scrollIntoView({ behavior: 'smooth' })}
                        className="px-6 py-3 bg-white/90 hover:bg-white text-blue-600 font-semibold text-sm rounded-full shadow-md shadow-blue-100 hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
                        aria-label="Pelajari layanan kami"
                      >
                        Layanan Kami <ArrowDown size={18} aria-hidden="true" />
                      </button>
                    </div>
                </div>
              </SimpleFadeIn>
            </div>

            <SimpleFadeIn direction="right" delay={400} className="relative">
              <div className="relative h-64 md:h-80 lg:h-96 w-full">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <ImageWithFallback 
                        src={HERO_IMAGE_URL} 
                        alt="Ilustrasi edukasi" 
                        className="w-full h-full object-cover bg-gray-100"
                        loading="eager" 
                        fetchPriority="high" 
                        width={600}
                        height={400}
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true"></div>
                </div>

                 <div 
                   className="absolute -bottom-4 -left-2 md:-bottom-4 md:-left-6 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 max-w-[150px] hidden sm:block animate-bounce"
                   style={{ animationDuration: '3s' }}
                   role="note"
                 >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                        <Shield size={16} />
                      </div>
                      <span className="font-bold text-gray-800 text-xs">Edukasi</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">Materi relevan.</p>
                 </div>

                 <div 
                   className="absolute top-4 -right-2 md:top-8 md:-right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/50 items-center gap-2 animate-pulse hidden sm:flex"
                   role="note"
                 >
                      <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                        <BookOpen size={14} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-800">Cegah Kekerasan</p>
                      </div>
                 </div>
              </div>
            </SimpleFadeIn>

          </div>
        </div>
      </section>

      {/* ============== SECTION DATA (REVISI WAVE) ================= */}
      <div className="relative z-10 h-16 md:h-24 lg:h-32"></div>
      <section
        id="data"
        className="relative py-20 md:py-32 bg-slate-900 text-white z-20" 
      >
        {/* ^^^ HAPUS 'overflow-hidden' DI ATAS SINI SUPAYA WAVE MUNCUL ^^^ */}

        {/* 1. WAVE ATAS: Sekarang akan terlihat karena overflow section sudah dibuka */}
        <SectionTopWave color="fill-slate-900" />

        {/* 2. BACKGROUND BLOBS: Kita bungkus 'overflow-hidden' di sini saja biar blobs ga bocor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-800/20 rounded-full blur-[120px]" />
        </div>

        {/* 3. KONTEN UTAMA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Kolom Kiri */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-medium animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Live Monitoring: Jawa Tengah (2025)
              </div>

              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Kami Tidak Menutup Mata Terhadap <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Realita.
                </span>
              </h2>
              
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                Kekerasan bukan sekadar statistik di atas kertas. Ini adalah panggilan darurat. 
                Data ini adalah alasan kenapa <strong className="text-white">GUGAH</strong> berdiri tegak di sini.
              </p>

              <div className="flex gap-4 pt-4">
              
              </div>
            </div>

            {/* Kolom Kanan: Grid Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Card 1 */}
              <div className="group relative bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-4 right-4 text-slate-600 group-hover:text-red-400 transition-colors">
                  <Activity size={24} />
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Laporan Masuk</p>
                <h3 className="text-4xl font-black text-white mb-2"><CountUp end={760} /></h3>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Darurat Penanganan</p>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-4 right-4 text-slate-600 group-hover:text-orange-400 transition-colors">
                  <Users size={24} />
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Korban Usia Anak</p>
                <h3 className="text-4xl font-black text-white mb-2"><CountUp end={249} /></h3>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[40%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                </div>
                <p className="text-xs text-orange-300 mt-2">Perlu atensi khusus</p>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-4 right-4 text-slate-600 group-hover:text-yellow-400 transition-colors">
                  <Home size={24} />
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Lokasi Kejadian</p>
                <h3 className="text-4xl font-black text-white mb-2">75%</h3>
                <p className="text-sm text-yellow-400 font-bold mb-2">Di Rumah Sendiri</p>
                <div className="flex gap-1 h-2">
                   <div className="bg-yellow-400 w-[75%] rounded-l-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                   <div className="bg-slate-600 w-[25%] rounded-r-full"></div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative bg-blue-900/40 backdrop-blur-md p-6 rounded-2xl border border-blue-500/30 hover:bg-blue-900/60 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-4 right-4 text-blue-400 group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <p className="text-blue-200 text-sm font-medium mb-1">Wilayah Tertinggi</p>
                <h3 className="text-3xl font-black text-white mt-1 mb-1">Semarang</h3>
                <p className="text-xs text-blue-300 mb-3">Pusat pelaporan terbanyak</p>
                <div className="flex items-center gap-2 text-xs font-mono bg-blue-950 p-2 rounded border border-blue-800">
                   <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                   Status: WASPADA
                </div>
              </div>
            <div className="relative z-10 h-16 md:h-24 lg:h-32"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: CORE VALUES (FIXED FINAL) ================= */}
{/* 1. PENYEBAB UTAMA: Gue apus 'overflow-hidden' dari class section ini biar Wavenya bisa nongol ke atas */}
<section className="relative py-20 md:py-28 lg:py-36 bg-slate-100 z-30">

  {/* 2. WAVE: Warna harus sama dengan SECTION INI (slate-100).
      Dia akan naik ke atas nutupin section hitam karena component SectionTopWave lu udah ada -translate-y nya. */}
  <SectionTopWave color="fill-slate-100" />

  {/* 3. BACKGROUND WRAPPER: Karena section utama ga boleh overflow-hidden (demi wave),
      kita bungkus Blobs & Grid di sini pakai overflow-hidden biar ga bocor ke mana-mana. */}
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Blob Biru Kiri */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      {/* Blob Ungu Kanan */}
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      {/* Grid Pattern Halus */}
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">

    {/* HEADER SECTION */}
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-center">
      <div className="relative">
        <SimpleFadeIn>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.15]">
            Kenapa Harus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">GUGAH?</span>
          </h2>
        </SimpleFadeIn>
      </div>

      <div className="relative">
        <SimpleFadeIn delay={100}>
          {/* Garis vertikal aksen biru */}
          <div className="hidden lg:block absolute -left-8 top-2 w-1.5 h-full max-h-32 bg-blue-500 rounded-full"></div>

          <p className="text-slate-700 text-base md:text-lg leading-relaxed font-semibold">
            Kami hadir untuk mengisi celah pengetahuan kritis yang seringkali tidak diajarkan baik di sekolah maupun dalam lingkungan masyarakat luas.
          </p>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Melalui Gugah, masyarakat dapat mempelajari tentang kesehatan reproduksi, <span className="text-blue-700 font-bold italic">consent</span> (persetujuan), hingga cara mengenali, mencegah, dan melaporkan tindakan kekerasan.
          </p>
        </SimpleFadeIn>
      </div>
    </div>

    {/* CARDS GRID */}
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
      {[
        {
          title: "100% Anonim",
          desc: "Identitasmu aman. Sistem kami mengenkripsi data sehingga kamu bisa bercerita tanpa takut dihakimi.",
          icon: Lock,
          bgIcon: "bg-blue-100",
          textIcon: "text-blue-600"
        },
        {
          title: "Profesional",
          desc: "Bukan sekadar bot. Kamu didukung oleh satgas yang terlatih.",
          icon: Heart,
          bgIcon: "bg-rose-100",
          textIcon: "text-rose-600"
        },
        {
          title: "Akses 24/7",
          desc: "Trauma tidak mengenal jam kerja. Fitur bantuan kami aktif kapanpun kamu butuh.",
          icon: Activity,
          bgIcon: "bg-indigo-100",
          textIcon: "text-indigo-600"
        },
      ].map((item, idx) => (
        <SimpleFadeIn key={idx} delay={idx * 150}>
          
          <div className="h-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
            
            <div className="flex flex-col items-start gap-5 mb-5">
              <div className={`w-14 h-14 rounded-2xl ${item.bgIcon} flex items-center justify-center ${item.textIcon} shadow-sm`}>
                <item.icon size={26} strokeWidth={2} />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                {item.title}
              </h3>
            </div>

            <div className="h-px w-full bg-slate-100 mb-5"></div>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 flex-grow">
              {item.desc}
            </p>

            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm cursor-pointer group hover:text-blue-600 transition-colors">
               <span>Pelajari Selengkapnya</span>
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>

          </div>
        </SimpleFadeIn>
      ))}
    </div>
  </div>
</section>

{/* ================= SECTION 3.5: PARTNERSHIP (MOBILE FIXED FINAL V3) ================= */}
      <section className="relative w-full h-[650px] md:h-[500px] overflow-hidden bg-white z-30 group">
         
         {/* 1. LAYER FOTO BACKGROUND */}
         <div className="absolute inset-0 w-full h-full">
            <ImageWithFallback 
                src={'https://res.cloudinary.com/dj2gwflqs/image/upload/v1764929630/WhatsApp_Image_2025-12-04_at_4.04.28_PM2_xxy9im.jpg'} 
                alt="Dokumentasi Satgas PPK Polines" 
                className="w-full h-full object-cover object-[10%_top] md:object-[-25%_center]" 
                fetchpriority="high"
            />
         </div>

         {/* 2. GRADIENT OVERLAY (Tetap seperti V2) */}
         <div className="absolute bottom-0 left-0 w-full h-[85%] md:h-full bg-gradient-to-t from-white from-40% via-white/80 to-transparent md:bg-gradient-to-l md:from-white md:via-white/50 md:to-transparent"></div>

          {/* 3. KONTEN UTAMA */}
         <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 h-full flex flex-col justify-end md:justify-center items-start md:items-end pb-24 md:pb-0">
            
            <div className="max-w-lg text-left md:text-right relative z-10">
               
               <SimpleFadeIn direction="up">
                  {/* Badge */}
                  <div className="inline-flex items-center justify-start md:justify-end gap-2 mb-4 w-full">
                     <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                     </span>
                     <span className="text-xs font-bold tracking-widest text-blue-700 uppercase">KOLABORASI RESMI</span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                     Didukung Penuh oleh <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Satgas PPK Polines
                     </span>
                  </h2>

                  {/* Deskripsi */}
                  <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-6 font-medium">
                     Seluruh materi edukasi dan alur pelaporan di aplikasi GUGAH telah ditinjau dan disetujui oleh Satgas PPK Polines. Kami menjamin standar keamanan yang sesuai prosedur.
                  </p>

                  {/* Signature */}
                  {/* mb-0 karena sudah di-handle oleh padding parent (pb-24) */}
                  <div className="flex items-center justify-start md:justify-end gap-3 border-t border-slate-200/60 pt-4 text-slate-500 font-medium text-xs md:text-sm mb-0 md:mb-20">
                     <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <CheckCheck size={16} />
                        <span>Terverifikasi</span>
                     </div>
                     <span>•</span>
                     <span>2025</span>
                  </div>
               </SimpleFadeIn>

            </div>
         </div>
      </section>

      {/* ================= SECTION 4: LAYANAN (DARK MODE - MOBILE OPTIMIZED) ================= */}
<section id="layanan" className="relative py-12 md:py-28 lg:py-36 bg-slate-900 z-40">

  {/* WAVE FIX */}
  <div className="absolute top-0 left-0 w-full -translate-y-[98%] z-10 leading-[0]">
    <SectionTopWave color="fill-slate-900" />
  </div>

  {/* Decorative Background */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-900/30"></div>
    <div className="absolute top-[20%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
    <div className="absolute bottom-[20%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-fuchsia-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
    
    <div className="absolute top-0 left-0 w-full h-full hidden md:block z-0 opacity-100">
      <svg className="w-full h-full" viewBox="0 0 1440 1600" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" /> 
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.15" /> 
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.15" /> 
          </linearGradient>
        </defs>
        <path d="M720 0 L720 150 C720 300 300 300 300 500 C300 700 1140 700 1140 900 C1140 1100 720 1100 720 1300 L720 1600" 
          stroke="url(#roadGrad)" strokeWidth="100" strokeLinecap="round" />
        <path d="M720 0 L720 150 C720 300 300 300 300 500 C300 700 1140 700 1140 900 C1140 1100 720 1100 720 1300 L720 1600" 
          stroke="white" strokeWidth="4" strokeDasharray="20 20" className="opacity-30" />
      </svg>
    </div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
    {/* Header */}
    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
      <SimpleFadeIn>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 tracking-tight">
          Eksplor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Fitur Kami</span>
        </h2>
        <p className="text-sm md:text-lg text-slate-400 font-medium max-w-2xl mx-auto">
          Dari simulasi interaktif, curhat anonim, hingga akses darurat, semua dirancang untuk keamananmu.
        </p>
      </SimpleFadeIn>
    </div>
    
    {/* Timeline Items Wrapper */}
    {/* PERBAIKAN: space-y-24 diganti jadi space-y-12 biar mobile lebih rapat */}
    <div className="space-y-12 md:space-y-0 relative mb-10">
    <div className="relative md:flex md:items-center md:justify-between group md:pt-12 mb-12 md:mb-0">
        
        {/* DESKRIPSI (Kiri - Hanya tampil di Desktop) */}
        <div className="md:w-[45%] order-1 pr-8 md:pr-16 text-right hidden md:block">
           <SimpleFadeIn delay={200} direction="right">
             <div className="flex items-center justify-end gap-2 mb-3">
               <span className="px-3 py-1 rounded-full bg-fuchsia-900/50 border border-fuchsia-500 text-fuchsia-300 text-xs font-bold tracking-wider uppercase animate-pulse">
                 New Feature
               </span>
               <h4 className="text-fuchsia-400 font-bold uppercase tracking-widest text-sm">Cerdas & Rahasia</h4>
             </div>
             <p className="text-2xl font-serif text-slate-300 leading-relaxed italic">
               "Bingung harus cerita ke siapa? AI kami siap mendengarkan tanpa menghakimi, 24 jam non-stop."
             </p>
           </SimpleFadeIn>
        </div>

        {/* DOT TENGAH (Special Glowing Effect) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-20">
            {/* Efek Ping Besar */}
            <div className="w-8 h-8 bg-fuchsia-500 rounded-full animate-ping absolute opacity-75"></div>
            {/* Dot Utama */}
            <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full border-4 border-slate-900 shadow-[0_0_20px_rgba(192,38,211,0.7)] relative flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
            </div>
        </div>
        
        {/* KARTU UTAMA (Kanan) */}
        <SimpleFadeIn direction="left" className="md:w-[45%] md:pl-16 order-2">
          {/* Tambahan Ring Border Glowing agar mencolok */}
          <div className="relative p-1 rounded-[2.1rem] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-2xl shadow-fuchsia-900/50 hover:shadow-fuchsia-600/50 transition-all duration-500 hover:-translate-y-2 group-hover:scale-[1.02]">
            
            {/* Background Inner Card */}
            <div className="p-6 md:p-8 bg-slate-900 rounded-[2rem] relative overflow-hidden h-full flex flex-col items-start text-left text-white">
                
                {/* Dekorasi Background Abstrak */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="w-full flex items-center justify-between mb-4 relative z-10">
                  <div className="inline-flex p-3 bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white rounded-xl shadow-lg border border-white/10">
                    <Bot size={28} className="md:w-[30px]" />
                  </div>
                  {/* Badge Live */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-fuchsia-950/50 border border-fuchsia-500/30 rounded-full backdrop-blur-md">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-fuchsia-200">ONLINE 24/7</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-4xl font-bold mb-2 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-100 to-purple-200">
                  Gugah <span className="text-fuchsia-500">AI</span>
                </h3>
                
                <p className="text-sm md:text-base text-slate-300 mb-6 md:mb-8 leading-relaxed font-medium relative z-10">
                  Asisten virtual cerdas yang siap membantu menjawab pertanyaan hukum, memberikan tips keamanan, atau sekadar teman curhat yang aman.
                </p>

                <a 
                   href="https://t.me/gugahassistant_bot" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="relative z-10 w-full md:w-auto bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-sm font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-fuchsia-500/40 transition-all flex items-center justify-center gap-2 group/btn hover:brightness-110"
                >
                  <Sparkles size={18} className="animate-pulse"/>
                  Mulai Chat Sekarang 
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                </a>
            </div>
          </div>
        </SimpleFadeIn>
      </div>

      {/* === ITEM 1: SATGAS === */}
      {/* PERBAIKAN: md:pt-24 untuk efek zigzag desktop */}
      <div className="relative md:flex md:items-center md:justify-between group md:pt-24">
        
        {/* PERBAIKAN: mb-4 agar jarak teks ke bawah tidak kejauhan di HP */}
        <SimpleFadeIn direction="right" className="md:w-[45%] md:pr-16 mb-4 md:mb-0 order-1">
          {/* PERBAIKAN: p-6 md:p-8 agar padding kartu pas di HP */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] shadow-xl shadow-indigo-900/30 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-end text-right text-white">
            <div className="inline-flex p-3 bg-white/20 backdrop-blur-md text-white rounded-xl mb-4 shadow-inner border border-white/20">
              <Shield size={24} className="md:w-[26px]" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold mb-2">Chat <span className="text-indigo-200">Satgas</span></h3>
            <p className="text-sm md:text-base text-indigo-50 mb-6 md:mb-8 leading-relaxed font-medium">
              Butuh bantuan hukum atau psikolog? Langsung chat Satgas PPKS di sini.
            </p>
            <button onClick={handleLogin} className="group/btn flex items-center gap-2 bg-white text-indigo-700 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all">
              Hubungi Kami <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
            </button>
          </div>
        </SimpleFadeIn>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-indigo-600 rounded-full border-4 border-slate-900 shadow-lg z-20"></div>
        
        <div className="md:w-[45%] order-2 pl-8 md:pl-16 hidden md:block">
           <SimpleFadeIn delay={200} direction="left">
             <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-3">Pendampingan</h4>
             <p className="text-2xl font-serif text-slate-300 leading-relaxed italic">
               "Kamu tidak sendirian. Tim profesional kami siap merangkul, melindungi, dan memulihkan."
             </p>
           </SimpleFadeIn>
        </div>
      </div>
      
      {/* === ITEM 2: MAPS === */}
      <div className="relative md:flex md:items-center md:justify-between group md:pt-24">
        
        <div className="md:w-[45%] order-1 pr-8 md:pr-16 text-right hidden md:block">
           <SimpleFadeIn delay={200} direction="right">
             <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-3">Respons Cepat</h4>
             <p className="text-2xl font-serif text-slate-300 leading-relaxed italic">
               "Dalam situasi darurat, setiap detik berharga. Temukan perlindungan terdekat dalam satu klik."
             </p>
           </SimpleFadeIn>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-orange-500 rounded-full border-4 border-slate-900 shadow-lg z-20 animate-ping"></div>
        
        <SimpleFadeIn direction="left" className="md:w-[45%] md:pl-16 order-2">
          <div className="p-6 md:p-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-[2rem] shadow-xl shadow-orange-900/30 hover:shadow-orange-600/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left text-white">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="inline-flex p-3 bg-white/20 backdrop-blur-md text-white rounded-xl shadow-inner border border-white/20">
                <MapPin size={24} className="md:w-[26px]" />
              </div>
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-red-600 text-[10px] md:text-xs font-bold rounded-full animate-pulse shadow-sm">DARURAT</span>
            </div>
            <h3 className="text-xl md:text-3xl font-bold mb-2">Zona <span className="text-orange-200">Aman</span></h3>
            <p className="text-sm md:text-base text-red-50 mb-6 md:mb-8 leading-relaxed font-medium">
              Cari Rumah Aman, Polisi, atau RS terdekat dalam satu kali klik.
            </p>
            <button onClick={handleMapNavigation} className="bg-white text-orange-600 text-sm font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all flex items-center gap-2">
              Cari Lokasi <ArrowRight size={16} />
            </button>
          </div>
        </SimpleFadeIn>
      </div>

{/* === ARTIKEL === */}
      <div className="relative md:flex md:items-center md:justify-between group md:pt-24">
        
        <SimpleFadeIn direction="right" className="md:w-[45%] md:pr-16 mb-4 md:mb-0 order-1">
          <div className="p-6 md:p-8 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-[2rem] shadow-xl shadow-teal-900/30 hover:shadow-teal-600/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-end text-right text-white">
            <div className="inline-flex p-3 bg-white/20 backdrop-blur-md text-white rounded-xl mb-4 shadow-inner border border-white/20">
              <BookOpen size={24} className="md:w-[26px]" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold mb-2">Artikel <span className="text-teal-200">Edukasi</span></h3>
            <p className="text-sm md:text-base text-teal-50 mb-6 md:mb-8 leading-relaxed font-medium">
              Akses library lengkap tentang materi kekerasan seksual, modul pencegahan, hingga regulasi hukum terbaru.
            </p>
            <button onClick={handleArtikelNavigation} className="group/btn flex items-center gap-2 bg-white text-teal-700 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all">
              Baca Artikel <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
            </button>
          </div>
        </SimpleFadeIn>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-teal-500 rounded-full border-4 border-slate-900 shadow-lg z-20"></div>
        
        <div className="md:w-[45%] order-2 pl-8 md:pl-16 text-left hidden md:block">
           <SimpleFadeIn delay={200} direction="left">
             <h4 className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-3">Literasi Digital</h4>
             <p className="text-2xl font-serif text-slate-300 leading-relaxed italic">
               "Pengetahuan adalah perisai pertama. Bekali dirimu dengan informasi yang valid dan terpercaya."
             </p>
           </SimpleFadeIn>
        </div>
      </div>

      {/* === ITEM 3: GAME === */}
      <div className="relative md:flex md:items-center md:justify-between group md:pt-24">
        
        <div className="md:w-[45%] order-1 pr-8 md:pr-16 text-right hidden md:block">
           <SimpleFadeIn delay={200} direction="right">
             <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-3">Belajar Seru</h4>
             <p className="text-2xl font-serif text-slate-300 leading-relaxed italic">
               "Pahami batasan dan hak tubuhmu lewat simulasi nyata. Karena teori saja tidak cukup."
             </p>
           </SimpleFadeIn>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-cyan-500 rounded-full border-4 border-slate-900 shadow-lg z-20"></div>
        
        <SimpleFadeIn direction="left" className="md:w-[45%] md:pl-16 order-2">
          <div className="p-6 md:p-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[2rem] shadow-xl shadow-cyan-900/30 hover:shadow-cyan-600/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left text-white">
            <div className="inline-flex p-3 bg-white/20 backdrop-blur-md text-white rounded-xl mb-4 shadow-inner border border-white/20">
              <Gamepad2 size={24} className="md:w-[26px]" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold mb-2">Game <span className="text-cyan-100">Edukasi</span></h3>
            <p className="text-sm md:text-base text-blue-50 mb-6 md:mb-8 leading-relaxed font-medium">
              Simulasi interaktif. Belajar soal <i>consent</i> & <i>red flag</i> dengan cara yang asik.
            </p>
            <button onClick={handleGameNavigation} className="group/btn flex items-center gap-2 bg-white text-cyan-700 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all">
              Main Game <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
            </button>
          </div>
        </SimpleFadeIn>
      </div>
      
    </div>
  </div>
</section>

      {/* ================= SECTION 5: VIDEO DEMO ================= */}
<section className="relative py-20 md:py-28 lg:pt-36 lg:pb-38 bg-blue-50 z-50">
  
  <div className="absolute top-0 left-0 w-full -translate-y-[98%] z-10 leading-[0]">
    <SectionTopWave color="fill-blue-50" />
  </div>

  {/* Decorative Wrapper */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-100 border border-blue-100 overflow-hidden relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* TEKS PENJELASAN DEMO */}
        <div>
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 block">
            Video Demo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            Intip Cara Kerja <br/>
            <span className="text-blue-600">Aplikasi GUGAH</span>
          </h2>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            Penasaran gimana cara curhat tanpa ketahuan atau main game simulasi? Simak video singkat ini untuk melihat antarmuka (UI) dan alur penggunaan fitur kami secara langsung.
          </p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 p-1 rounded-full text-blue-600">
                <CheckCircle size={16}/>
              </div>
              <span className="text-slate-700 font-medium">
                Tampilan simpel, navigasi mudah & cepat.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 p-1 rounded-full text-blue-600">
                <CheckCircle size={16}/>
              </div>
              <span className="text-slate-700 font-medium">
                Preview fitur Game Edukasi.
              </span>
            </li>
          </ul>
        </div>

        {/* Video Placeholder */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-4 border-slate-100">
          <a 
    href="https://youtu.be/q3sKxZGAr4g?si=emh05XSoFthFZt8b" 
    target="_blank" 
    rel="noopener noreferrer"
    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-4 border-slate-100"
>
    </a>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Tombol Play dengan efek Pulse */}
            <div className="relative">
               <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
               <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-md border border-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                 <Play className="w-6 h-6 md:w-8 md:h-8 text-blue-600 ml-1" fill="currentColor" />
               </div>
            </div>
          </div>
          
          {/* Label Durasi di Pojok */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
            04:25
          </div>
        </div>

      </div>
      
      {/* Decor inside card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-0"></div>
    </div>
  </div>
</section>

{/* ================= SECTION 6: SLOGAN & FOOTER CONNECTOR (FINAL) ================= */}
{/* Background dibuat gradient dari Blue-700 (atas) ke Slate-950 (bawah) biar nyambung mulus ke footer */}
<section className="relative py-20 md:py-24 lg:py-32 bg-gradient-to-b from-blue-700 to-slate-950 z-40 rounded-[2rem] ">

  <div className="max-w-4xl mx-auto px-6 relative z-30 text-center">
    <SimpleFadeIn>
      
      {/* Dekorasi Garis Kecil */}
      <div className="flex justify-center items-center gap-2 mb-6 opacity-60">
        <span className="h-px w-8 bg-blue-200"></span>
        <span className="text-blue-200 text-xs font-bold tracking-widest uppercase">Gugah</span>
        <span className="h-px w-8 bg-blue-200"></span>
      </div>

      {/* SLOGAN UTAMA (Ganti Quote Galau) */}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-lg">
        "Diam Bukan Pilihan. <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
          Saatnya Kita Bicara.
        </span>"
      </h2>

      <p className="text-lg md:text-xl text-blue-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
        Kekerasan bisa dihentikan jika kita berhenti memalingkan wajah. 
        Jadilah bagian dari perubahan, mulai dari dirimu sendiri.
      </p>

    </SimpleFadeIn>
  </div>

  {/* WAVE BAWAH: Warnanya fill-slate-950 biar nyatu sama Footer */}
  {/* Kita posisikan absolute bottom biar rapi */}
  <div className="absolute bottom-0 left-0 w-full z-20 leading-[0]">
    <SectionBottomWave color="fill-slate-950" />
  </div>

</section>

{/* Footer Wrapper */}
<div className="bg-slate-950 relative z-50">
  <Footer />
</div>
      </main>
    </div>
  );
};

export default LandingPage;