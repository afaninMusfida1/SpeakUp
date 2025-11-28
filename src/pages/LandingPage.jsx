import React, { useEffect, useRef, useState } from "react"; 
import { AlertTriangle, Users, Home, Heart, MessageCircle, MapPin, Shield, Lock, ArrowRight, ArrowUp, Play, Gamepad2, Activity, CheckCircle, ArrowDown } from "lucide-react";
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
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50">
      <SkipToContent />
      <Navbar showMenu={true} showUrgent={true} className="bg-white" />

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        className={`fixed bottom-8 right-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg transform transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <ArrowUp size={24} />
      </button>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-blue-300 z-50">
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
      </div>

      {/* Main content */}
      <main id="main-content" tabIndex="-1">
      <section id="home" className="relative overflow-hidden py-12 md:py-16 scroll-mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" aria-hidden="true" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" aria-hidden="true" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" aria-hidden="true" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            
            <div className="space-y-5">
              <SimpleFadeIn delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                   </span>
                  <span className="flex text-sm font-medium text-blue-700">Ruang Aman</span>
                </div>
              </SimpleFadeIn>

              <SimpleFadeIn delay={100}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
                    Ruang Aman untuk Bicara, Belajar, dan <br className="hidden lg:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    Mendapatkan Dukungan
                    </span>
                </h1>
              </SimpleFadeIn>

              <SimpleFadeIn delay={200}>
                <p className="text-base text-gray-600 leading-relaxed">
                    SpeakUp adalah sebuah platform yang berkomitmen dalam upaya pencegahan kekerasan seksual dengan menyediakan edukasi seksual yang inklusif. Selain itu, sebagai ruang berbagi cerita, memberikan akses bantuan, dan dukungan kepada setiap individu yang membutuhkan.
                </p>
              </SimpleFadeIn>

              <SimpleFadeIn delay={300}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={handleLogin}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Masuk ke akun Anda"
                      >
                        Masuk <ArrowRight size={18} aria-hidden="true" />
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
                        alt="Ilustrasi ruang aman untuk berbagi cerita" 
                        className="w-full h-full object-cover bg-gray-100"
                        loading="lazy"
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
                   aria-label="Keamanan data Anda terjamin dengan enkripsi end-to-end"
                 >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                        <Shield size={16} />
                      </div>
                      <span className="font-bold text-gray-800 text-xs">Privasi Dijamin</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">Enkripsi end-to-end.</p>
                 </div>

                 <div 
                   className="absolute top-4 -right-2 md:top-8 md:-right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/50 items-center gap-2 animate-pulse hidden sm:flex"
                   role="note"
                   aria-label="Setiap suara didengarkan"
                 >
                     <div className="bg-red-100 p-1.5 rounded-full text-red-600">
                        <Heart size={14} fill="currentColor" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-800">Didengar</p>
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
                Kekerasan seksual bukan sekadar statistik di atas kertas. Ini adalah panggilan darurat. 
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

      {/* ================= SECTION 3: CORE VALUES (LAYOUT & WARNA BARU) ================= */}
      <section className="relative py-20 md:py-28 lg:py-36 bg-slate-100 z-30">
        
        {/* WAVE TETAP SESUAI REQUEST (TIDAK DIUBAH) */}
        <SectionTopWave color="fill-slate-100" />
        
        {/* Tambahan Pattern Halus di Background supaya tidak 'sepi' */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          
          {/* Layout Header Baru: Kiri Teks, Kanan Kosong (Asimetris Modern) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
             <div className="max-w-2xl">
                <SimpleFadeIn>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-px w-8 bg-blue-600"></span>
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Value Kami</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                    Kenapa Harus <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">GUGAH?</span>
                  </h2>
                </SimpleFadeIn>
             </div>
             <div className="max-w-md">
               <SimpleFadeIn delay={100}>
                 <p className="text-slate-600 text-lg leading-relaxed">
                   Kami menggabungkan pendekatan psikologis yang empatik dengan teknologi keamanan tinggi.
                 </p>
               </SimpleFadeIn>
             </div>
          </div>

          {/* Grid Layout Baru */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                title: "100% Anonim", 
                desc: "Identitasmu aman. Sistem kami mengenkripsi data sehingga kamu bisa bercerita tanpa takut dihakimi.", 
                icon: Lock, 
                color: "blue",
                accent: "bg-blue-500"
              },
              { 
                title: "Profesional", 
                desc: "Bukan sekadar bot. Kamu didukung oleh psikolog klinis dan satgas yang terlatih menangani trauma.", 
                icon: Heart, 
                color: "pink",
                accent: "bg-pink-500"
              },
              { 
                title: "Akses 24/7", 
                desc: "Trauma tidak mengenal jam kerja. Fitur bantuan darurat dan Menfess kami aktif kapanpun kamu butuh.", 
                icon: Activity, 
                color: "indigo",
                accent: "bg-indigo-500"
              },
            ].map((item, idx) => (
              <SimpleFadeIn key={idx} delay={idx * 150}>
                {/* CARD DESIGN BARU: Minimalis dengan Accent Color di atas */}
                <div className="group h-full bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 border border-slate-200 relative overflow-hidden hover:-translate-y-2">
                  
                  {/* Garis Warna Aksen di Atas Card */}
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${item.accent} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                  
                  {/* Icon dengan Background Circle */}
                  <div className={`w-14 h-14 rounded-full bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 mb-6 group-hover:scale-110 group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-300`}>
                    <item.icon size={28} strokeWidth={2} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-500 leading-relaxed group-hover:text-slate-600">
                    {item.desc}
                  </p>

                  {/* Icon Panah Kecil di Bawah (Pemanis) */}
                  <div className="mt-6 flex items-center text-sm font-bold text-slate-300 group-hover:text-blue-600 transition-colors gap-2">
                    <span>Selengkapnya</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform"/>
                  </div>
                </div>
              </SimpleFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: LAYANAN ================= */}
      <section id="layanan" className="relative py-20 md:py-28 lg:py-36 bg-slate-50 z-40">
        <SectionTopWave color="fill-slate-50" />
        {/* Decorative Wrapper */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-blue-50/30"></div>
          <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-300/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[120px]"></div>
          <div className="absolute top-0 left-0 w-full h-full hidden md:block z-0 opacity-50">
            <svg className="w-full h-full" viewBox="0 0 1440 1600" fill="none" preserveAspectRatio="none">
              <path d="M720 0 L720 150 C720 300 300 300 300 500 C300 700 1140 700 1140 900 C1140 1100 720 1100 720 1300 L720 1600" 
                stroke="#F1F5F9" strokeWidth="80" strokeLinecap="round" />
              <path d="M720 0 L720 150 C720 300 300 300 300 500 C300 700 1140 700 1140 900 C1140 1100 720 1100 720 1300 L720 1600" 
                stroke="#CBD5E1" strokeWidth="2" strokeDasharray="12 12" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-24">
            <SimpleFadeIn>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Langkah <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pemulihanmu</span>
              </h2>
              <p className="text-xl text-slate-600">
                Kami menemani setiap langkah perjalananmu menuju rasa aman.
              </p>
            </SimpleFadeIn>
            <div className="flex justify-center mt-8 animate-bounce text-blue-300">
              <ArrowDown size={32} />
            </div>
          </div>
          {/* Timeline Items */}
          <div className="space-y-24 md:space-y-0 relative">
            {/* Items timeline code remains same... */}
            <div className="relative md:flex md:items-center md:justify-between group">
              <SimpleFadeIn direction="right" className="md:w-[45%] md:text-right md:pr-16 mb-8 md:mb-0 order-1">
                <div className="p-8 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-purple-100 shadow-xl shadow-purple-100/30 hover:shadow-purple-200/50 transition-all duration-300">
                  <div className="inline-flex p-3 bg-purple-100 text-purple-600 rounded-xl mb-4">
                    <MessageCircle size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-3">Suarakan <span className="text-purple-600">Isi Hati</span></h3>
                  <p className="text-lg text-slate-600 mb-6">Ruang aman untuk melepas beban tanpa identitas. Validasi perasaanmu adalah langkah awal.</p>
                  <button className="text-purple-600 font-bold hover:gap-3 transition-all flex items-center md:justify-end gap-2">
                    Mulai Menulis <ArrowRight size={18} />
                  </button>
                </div>
              </SimpleFadeIn>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-lg z-20"></div>
              <div className="md:w-[45%] order-2"></div>
            </div>
            {/* ITEM 2: GAME */}
            <div className="relative md:flex md:items-center md:justify-between group md:pt-32">
              <div className="md:w-[45%] order-1"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-20"></div>
              <SimpleFadeIn direction="left" className="md:w-[45%] md:pl-16 order-2">
                <div className="p-8 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-100/30 hover:shadow-blue-200/50 transition-all duration-300">
                  <div className="inline-flex p-3 bg-blue-300 text-blue-600 rounded-xl mb-4">
                    <Gamepad2 size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-3">Pahami <span className="text-blue-600">Batasanmu</span></h3>
                  <p className="text-lg text-slate-600 mb-6">Belajar tentang consent dan hak tubuh lewat simulasi interaktif yang tidak membosankan.</p>
                  <button className="text-blue-600 font-bold hover:gap-3 transition-all flex items-center gap-2">
                    Mainkan Game <ArrowRight size={18} />
                  </button>
                </div>
              </SimpleFadeIn>
            </div>
            {/* ITEM 3: SATGAS */}
            <div className="relative md:flex md:items-center md:justify-between group md:pt-32">
              <SimpleFadeIn direction="right" className="md:w-[45%] md:text-right md:pr-16 mb-8 md:mb-0 order-1">
                <div className="p-8 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-indigo-100 shadow-xl shadow-indigo-100/30 hover:shadow-indigo-200/50 transition-all duration-300">
                  <div className="inline-flex p-3 bg-indigo-100 text-indigo-600 rounded-xl mb-4">
                    <Shield size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-3">Dukungan <span className="text-indigo-600">Profesional</span></h3>
                  <p className="text-lg text-slate-600 mb-6">Satgas PPKS siap mendampingi, memberikan bantuan hukum, dan konseling psikologis.</p>
                  <button onClick={handleLogin} className="text-indigo-600 font-bold hover:gap-3 transition-all flex items-center md:justify-end gap-2">
                    Hubungi Satgas <ArrowRight size={18} />
                  </button>
                </div>
              </SimpleFadeIn>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow-lg z-20"></div>
              <div className="md:w-[45%] order-2"></div>
            </div>
            {/* ITEM 4: MAPS */}
            <div className="relative md:flex md:items-center md:justify-between group md:pt-32">
              <div className="md:w-[45%] order-1"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg z-20 animate-ping"></div>
              <SimpleFadeIn direction="left" className="md:w-[45%] md:pl-16 order-2">
                <div className="p-8 bg-red-50/70 backdrop-blur-xl rounded-[2rem] border border-red-100 shadow-xl shadow-red-100/30 hover:shadow-red-200/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-xl">
                      <MapPin size={28} />
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">URGENT</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-3">Zona <span className="text-red-500">Aman Darurat</span></h3>
                  <p className="text-lg text-slate-600 mb-6">Temukan Rumah Aman, Kantor Polisi, atau RS terdekat dengan satu klik dalam situasi bahaya.</p>
                  <button onClick={handleMapNavigation} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-2">
                    Cari Lokasi <ArrowRight size={18} />
                  </button>
                </div>
              </SimpleFadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: VIDEO / ABOUT ================= */}
      <section className="relative py-20 md:py-28 lg:pt-36 lg:pb-48 bg-blue-50 z-30">
        <SectionTopWave color="fill-blue-50" />
        {/* Decorative Wrapper */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-100 border border-blue-100 overflow-hidden relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 block">Tentang Kami</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6">Mengenal GUGAH Lebih Dekat</h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Kami percaya bahwa setiap orang berhak atas ruang yang aman. GUGAH hadir untuk memutus rantai kekerasan seksual melalui teknologi yang berempati.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16}/></div>
                    <span className="text-slate-700 font-medium">Kurikulum edukasi tervalidasi ahli.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16}/></div>
                    <span className="text-slate-700 font-medium">Sistem pelaporan terintegrasi & aman.</span>
                  </li>
                </ul>
              </div>

              {/* Video Placeholder */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <ImageWithFallback 
                  src={HERO_IMAGE_URL} 
                  alt="Video Thumbnail" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decor inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-0"></div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: QUOTE & FOOTER CONNECTOR ================= */}
      <section className="relative py-16 md:py-20 lg:py-24 bg-blue-700 z-40">
        
        <SectionTopWave color="fill-blue-700" />

        <div className="max-w-4xl mx-auto px-6 relative z-30 py-12 md:py-16 text-center">
          <SimpleFadeIn>
            <div className="mb-8 mx-auto w-20 h-1.5 bg-blue-400 rounded-full"></div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed mb-8 font-serif italic text-white opacity-95">
              "Lukamu valid, perasaanmu nyata. Masa depanmu masih suci dan layak diperjuangkan."
            </h2>
            <p className="font-bold tracking-[0.2em] text-blue-200">TIM GUGAH</p>
          </SimpleFadeIn>
         

        </div>
        {/* UPDATE: Taruh SectionBottomWave DISINI, bukan di dalam Footer component div */}
        {/* Gunakan warna fill-slate-950 (warna footer) agar menyatu */}
        <SectionBottomWave color="fill-slate-950" />
      </section>

      {/* Footer Component Wrapper */}
      <div className="bg-slate-800 relative z-50 -mt-36">
        <Footer className="bg-slate-800" />
      </div>
      </main>
    </div>
  );
};

export default LandingPage;