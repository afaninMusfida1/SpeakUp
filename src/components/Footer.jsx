import React from "react";
import { Shield, MapPin, Mail, Phone, Heart, Instagram, Twitter, Facebook, Linkedin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-300 mt-32">
      
      {/* === CTA CARD (Gaya "Nilai Kami" / Highlight) === */}
      {/* Bagian ini dibuat floating (absolute) agar menumpuk di perbatasan section sebelumnya */}
      <div className="absolute -top-24 left-0 w-full px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative overflow-hidden">
          
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
              Siap untuk Pulih Bersama?
            </h3>
            <p className="text-blue-100 text-lg max-w-lg">
              Kamu tidak sendirian. Bergabunglah dengan komunitas kami dan temukan ruang amanmu hari ini.
            </p>
          </div>

          <div className="relative z-10">
            <button className="bg-white text-blue-700 hover:bg-blue-50 transition-colors px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 group">
              Mulai Sekarang
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* === MAIN FOOTER CONTENT === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">GUGAH</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform ekosistem digital untuk pencegahan kekerasan seksual. Kami hadir sebagai ruang aman untuk bicara, belajar, dan mendapatkan dukungan profesional.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Layanan Utama</h4>
            <ul className="space-y-4">
              {['Konseling Online', 'Chat Satgas 24/7', 'Menfess Anonim', 'Peta Darurat', 'Edukasi Seksual'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Tentang Kami</h4>
            <ul className="space-y-4">
              {['Profil GUGAH', 'Tim Profesional', 'Blog & Artikel', 'Karir', 'Menjadi Partner'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-400 hover:text-purple-400 hover:translate-x-1 transition-all duration-300 inline-block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">Jl. Pemuda No. 123, Sekayu, Semarang Tengah, Jawa Tengah 50132</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="tel:+6281234567890" className="text-slate-400 hover:text-white transition-colors">
                  +62 812 3456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="mailto:halo@gugah.id" className="text-slate-400 hover:text-white transition-colors">
                  halo@gugah.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 GUGAH Indonesia. Dilindungi Undang-Undang.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Privasi</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">FAQ</a>
          </div>
        </div>

      </div>
    </footer>
  );
}