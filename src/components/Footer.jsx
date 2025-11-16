
import { Shield } from "lucide-react";

export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-extrabold">SpeakUp</span>
              </div>
              <p className="text-gray-400">
                Ruang aman untuk bicara, belajar, dan mendapatkan dukungan.
              </p>
            </div>
  
            <div>
              <h4 className="mb-4 text-lg font-semibold">Fitur</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#fitur" className="hover:text-white transition-colors">Chat Anonim</a></li>
                <li><a href="#fitur" className="hover:text-white transition-colors">Menfess</a></li>
                <li><a href="#fitur" className="hover:text-white transition-colors">Edukasi</a></li>
                <li><a href="#fitur" className="hover:text-white transition-colors">Peta Darurat</a></li>
              </ul>
            </div>
  
            <div>
              <h4 className="mb-4 text-lg font-semibold">Bantuan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#bantuan" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#bantuan" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                <li><a href="#bantuan" className="hover:text-white transition-colors">Hotline</a></li>
              </ul>
            </div>
  
            <div>
              <h4 className="mb-4 text-lg font-semibold">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
              </ul>
            </div>
          </div>
  
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 SpeakUp. Privasimu terjaga. Identitasmu dilindungi.</p>
          </div>
        </div>
      </footer>
    );
  };