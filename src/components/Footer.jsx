import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Sections - 4 Kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center sm:text-left">
          
          {/* 1. Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-extrabold">SpeakUp</span>
            </div>
            <p className="text-gray-400 text-sm">
              Ruang aman untuk bicara, belajar, dan mendapatkan dukungan.
            </p>
          </div>

          {/* 2. Fitur */}
          <div>
            <h4 className="mb-3 text-lg font-semibold">Fitur</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#fitur" className="hover:text-white transition">Chat Satgas</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Menfess</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Edukasi</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Peta Darurat</a></li>
            </ul>
          </div>

          {/* 3. Bantuan */}
          <div>
            <h4 className="mb-3 text-lg font-semibold">Bantuan</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#bantuan" className="hover:text-white transition">Hotline</a></li>
              <li><a href="#kontak" className="hover:text-white transition">Hubungi Kami</a></li>
            </ul>
          </div>

          {/* 4. Kontak */}
          <div>
            <h4 className="mb-3 text-lg font-semibold">Kontak</h4>
            <p className="text-gray-400 text-sm">
              diisi apa woi <br />
              Jl. jalan Semarang
            </p>
            <p className="text-gray-400 text-sm mt-2">+62 00 0000 0000</p>
            <p className="text-gray-400 text-sm">email@email.com</p>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm sm:text-base flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm">© 2025 SpeakUp. Privasimu terjaga. Identitasmu dilindungi.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition">Syarat Layanan</a>
            <a href="#" className="hover:text-white transition">Kebijakan Data</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
