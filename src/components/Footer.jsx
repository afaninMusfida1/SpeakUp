import React from "react";
import { Shield, MapPin, Mail, Phone, Instagram, Twitter, Facebook, Linkedin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    // HAPUS mt-32, GANTI dengan pt-44 atau pt-48 agar konten turun ke bawah memberi ruang untuk CTA Card yang melayang
    <footer className="relative bg-slate-950 text-slate-300 pt-48 pb-12 font-sans">
      
      {/* === CTA CARD (FLOATING) === */}
      {/* Absolute positioning: top-0 minus setengah tinggi card untuk efek menumpuk */}
      <div className="absolute -top-24 left-0 w-full px-4 z-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-100 to-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden border border-white/10">
          
          {/* Dekorasi Background Card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-indigo-800 mb-3 tracking-tight">
              Edukasi Diri, Putus Rantai Kekerasan
            </h3>
            <p className="text-blue-700 text-lg max-w-lg leading-relaxed">
              Pengetahuan adalah perlindungan terbaik. Pelajari tentang <i>consent</i>, hak tubuh, dan cara mencegah kekerasan seksual sekarang.
            </p>
          </div>

          <div className="relative z-10">
            <button className="bg-blue-800 text-white hover:bg-blue-500 transition-all duration-300 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group">
              Mulai Sekarang
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* === MAIN FOOTER CONTENT === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* 1. BRAND COLUMN */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {/* <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20"> */}
                {/* Pastikan warna text-white agar icon terlihat jelas */}
                  <img src="https://res.cloudinary.com/dj2gwflqs/image/upload/v1764211938/Group_1_gryebt.png" alt="Logo Gugah" className="w-10 h-10 object-contain drop-shadow-sm" />
              {/* </div> */}
              <span className="text-3xl font-black text-white tracking-tighter">GUGAH</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              Platform ekosistem digital untuk pencegahan kekerasan seksual. Kami hadir sebagai ruang aman untuk bicara, belajar, dan mendapatkan dukungan profesional.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. LINKS: LAYANAN */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Layanan Utama
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['Konseling Online', 'Chat Satgas 24/7', 'Menfess Anonim', 'Peta Darurat', 'Edukasi Seksual'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 hover:pl-2 transition-all duration-300 inline-block text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. LINKS: TENTANG */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Tentang Kami
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-purple-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['Profil GUGAH', 'Tim Profesional', 'Blog & Artikel', 'Karir', 'Menjadi Partner'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-400 hover:text-purple-400 hover:pl-2 transition-all duration-300 inline-block text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. CONTACT INFO */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-900/50 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-slate-400 leading-relaxed">
                  Jl. Pemuda No. 123, Sekayu, <br/>Semarang Tengah, Jawa Tengah 50132
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-green-900/50 transition-colors">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <a href="tel:+6281234567890" className="text-slate-400 hover:text-white transition-colors font-medium">
                  +62 812 3456 7890
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-yellow-900/50 transition-colors">
                  <Mail className="w-5 h-5 text-yellow-400" />
                </div>
                <a href="mailto:halo@gugah.id" className="text-slate-400 hover:text-white transition-colors font-medium">
                  halo@gugah.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © 2025 GUGAH Indonesia. Dilindungi Undang-Undang.
          </p>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Privasi</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">FAQ</a>
          </div>
        </div>

      </div>
    </footer>
  );
}