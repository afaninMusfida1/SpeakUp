import React, { useState } from "react";
import { Shield, Menu, X, ArrowLeft } from "lucide-react";
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


// =============================
//   FLEXIBLE + UNIVERSAL NAVBAR
// =============================
const Navbar = ({
  showMenu = false,     // Landing page
  showUrgent = false,   // Landing page
  backButton = false,   // Maps & Situation
  title = "",           // Optional title per page
  rightElement = null,  // Dashboard / Profile
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const onGetStarted = () => navigate("/situation");

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        <div className="flex items-center justify-between">

          {/* ============ LEFT SIDE ============ */}
          <div className="flex items-center gap-3">
            {/* BACK BUTTON (Maps / Situation Page) */}
            {backButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* LOGO (Landing / Dashboard) */}
            {!backButton && (
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-8 h-8 text-blue-600" />
                <span className="text-blue-900 font-extrabold text-xl">SpeakUp</span>
              </div>
            )}

            {/* PAGE TITLE (optional) */}
            {title && (
              <span className="text-lg font-semibold text-gray-800">{title}</span>
            )}
          </div>

          
          {/* ============ RIGHT SIDE (Desktop) ============ */}
          <div className="hidden md:flex items-center gap-6">

            {showMenu && (
              <>
                <a href="#fitur" className="text-gray-700 hover:text-blue-600 transition">Fitur</a>
                <a href="#edukasi" className="text-gray-700 hover:text-blue-600 transition">Edukasi</a>
                <a href="#bantuan" className="text-gray-700 hover:text-blue-600 transition">Bantuan</a>
              </>
            )}

            {showUrgent && (
              <Button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent border-2 border-red-500 text-red-500 text-base font-medium 
hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-100"

              >
                🚨 Urgent
              </Button>
            )}

            {rightElement}
          </div>

          {/* MOBILE MENU BUTTON – only if landing menu active */}
          {showMenu && (
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* ============ MOBILE DROPDOWN ============ */}
      {isOpen && showMenu && (
        <div className="md:hidden bg-white/95 border-t border-gray-100 py-4">
          <div className="flex flex-col gap-3 px-4 sm:px-6">
            <a href="#fitur" onClick={() => setIsOpen(false)} className="p-2">Fitur</a>
            <a href="#edukasi" onClick={() => setIsOpen(false)} className="p-2">Edukasi</a>
            <a href="#bantuan" onClick={() => setIsOpen(false)} className="p-2">Bantuan</a>
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
