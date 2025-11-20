import { Shield, MapPin, Mail, Phone, Heart } from "lucide-react"; 

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-24 border-t border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center sm:text-left">
          
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
              <Shield className="w-7 h-7 text-blue-500" /> 
              <span className="text-3xl font-extrabold text-white">SpeakUp</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mb-4">
              Ruang aman untuk bicara, belajar, dan mendapatkan dukungan.
            </p>
           
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white border-b-2 border-blue-600/50 inline-block pb-1">Fitur</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#fitur" className="hover:text-blue-400 transition">Chat Satgas 24/7</a></li>
              <li><a href="#fitur" className="hover:text-blue-400 transition">Menfess Aman</a></li>
              <li><a href="#edukasi" className="hover:text-blue-400 transition">Edukasi Seksual</a></li>
              <li><a href="#fitur" className="hover:text-blue-400 transition">Peta Darurat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white border-b-2 border-blue-600/50 inline-block pb-1">Bantuan</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#faq" className="hover:text-blue-400 transition">FAQ (Pertanyaan Umum)</a></li>
              <li><a href="#bantuan" className="hover:text-red-400 transition">Hotline Darurat</a></li>
              <li><a href="#kontak" className="hover:text-blue-400 transition">Hubungi Kami</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white border-b-2 border-blue-600/50 inline-block pb-1">Kontak</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                    Jl. Kebenaran No. 123, Semarang, Indonesia
                </li>
                <li className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-blue-400" />
                    <a href="tel:+6200000000000" className="hover:text-white transition">+62 00 0000 0000</a>
                </li>
                <li className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-400" />
                    <a href="mailto:email@email.com" className="hover:text-white transition">kontak@speakup.id</a>
                </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm">© 2025 SpeakUp. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4 text-xs sm:text-sm font-medium">
            <a href="#" className="hover:text-blue-400 transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-blue-400 transition">Syarat Layanan</a>
            <a href="#" className="hover:text-blue-400 transition">Kebijakan Data</a>
          </div>
        </div>

      </div>
    </footer>
  );
}