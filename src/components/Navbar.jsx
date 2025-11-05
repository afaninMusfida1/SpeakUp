import { Shield, Menu} from "lucide-react";

export default function Navbar() {

  const Navbar = ({ onGetStarted }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-blue-900 font-extrabold text-xl">SpeakUp</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#fitur" className="text-gray-700 hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#edukasi" className="text-gray-700 hover:text-blue-600 transition-colors">Edukasi</a>
            <a href="#bantuan" className="text-gray-700 hover:text-blue-600 transition-colors">Bantuan</a>
            <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-md">
              Masuk
            </Button>
          </div>
          {/* Mobile Menu Placeholder (hanya ikon) */}
          <button className="md:hidden p-2 text-gray-700">
              <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};
}
