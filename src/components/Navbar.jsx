import React, { useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Button = ({ children, variant = "default", className = "", ...props }) => {
  let baseStyle =
    "px-4 py-2 font-semibold rounded-xl transition-all duration-200 shadow-lg active:scale-[0.98] focus:ring-4 focus:ring-opacity-50";

  if (variant === "outline") {
    baseStyle +=
      " bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300";
  } else {
    baseStyle +=
      " bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  }

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const onGetStarted = () => {
    navigate('/situation');
  };
  const onLearnMore = () => {
      document.getElementById('edukasi')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-blue-900 font-extrabold text-xl">
              SpeakUp
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#fitur"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Fitur
            </a>
            <a
              href="#edukasi"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2 block"
            >
              Edukasi
            </a>
            <a
              href="#bantuan"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Bantuan
            </a>
            
            <Button 
            onClick={onGetStarted}
            className="bg-red-500 hover:bg-red-600 rounded-full px-6 py-3 gap-2 text-base shadow-lg shadow-red-300/40"
          >
            🚨 Urgent
        </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 border-t border-gray-100 py-4">
          <div className="flex flex-col gap-3 px-4 sm:px-6">
            <a
              href="#fitur"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2 block"
            >
              Fitur
            </a>
            <a
              href="#edukasi"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2 block"
            >
              Edukasi
            </a>
            <a
              href="#bantuan"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2 block"
            >
              Bantuan
            </a>
            <Button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 rounded-full w-full mt-2"
            >
              Masuk
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
