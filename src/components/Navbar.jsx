import React, { useState } from "react";
import { Shield, Menu, X, ArrowLeft, LogIn, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Button = ({ children, variant = "default", className = "", ...props }) => {
  let baseStyle =
    "px-4 py-2 font-semibold rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] focus:ring-4 focus:ring-opacity-50";

  if (variant === "outline") {
    // UPDATED: Hover effect biru
    baseStyle +=
      " bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 focus:ring-blue-300";
  } else if (variant === "ghost") {
    baseStyle +=
      " bg-transparent text-gray-700 hover:bg-gray-100 shadow-none";
  } else if (variant === "red") {
    baseStyle +=
      " bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-red-200";
  } else {
    // Default Blue
    baseStyle +=
      " bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-blue-200";
  }

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Navbar = ({
  showMenu = false,
  backButton = false,
  title = "",
  rightElement = null,
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null); // State untuk accordion mobile
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    if (path.startsWith("#")) {
      // Handle anchor links if on landing page
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/" + path);
      }
    } else {
      navigate(path);
    }
  };

  // Struktur Menu Baru
  const navLinks = [
    { name: "Game", path: "/game" },
    { 
      name: "Artikel", 
      path: "/articles",
      dropdown: [
        { name: "Edukasi Seksual", path: "/articles?cat=sex-ed" },
        { name: "Kesehatan Mental", path: "/articles?cat=mental-health" },
        { name: "Hukum & Legal", path: "/articles?cat=legal" },
        { name: "Self Development", path: "/articles?cat=self-dev" },
      ]
    },
    { 
      name: "Layanan", 
      path: "#layanan",
      dropdown: [
        { name: "Chat Satgas", path: "/chat" },
        { name: "Menfess", path: "/menfess" },
        { name: "Peta Darurat", path: "/maps" }, // Maps Urgent pindah ke sini
      ]
    },
    { name: "Komunitas", path: "/community" },
  ];

  const toggleMobileSubmenu = (name) => {
    setMobileSubmenu(mobileSubmenu === name ? null : name);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        
        <div className="flex items-center justify-between">

          {/* ============ LEFT SIDE (LOGO) ============ */}
          <div className="flex items-center gap-3">
            {backButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 px-2 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {!backButton && (
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <a href="/" className="group flex items-center gap-3">
                {/* Container Logo */}
                <div className=" transition-all duration-300 group-hover:scale-105">
                  <img 
                    src="https://res.cloudinary.com/dj2gwflqs/image/upload/v1764211938/Group_1_gryebt.png" 
                    alt="Logo Gugah"
                    className="w-10 h-10 object-contain drop-shadow-sm" 
                  />
                </div>

                {/* Teks Brand */}
                <span className="text-blue-900 font-extrabold text-3xl tracking-tight transition-colors group-hover:text-blue-700">
                  Gugah
                </span>
              </a>
              </div>
            )}

            {title && (
              <span className="text-lg font-semibold text-gray-800 ml-2 border-l pl-3 border-gray-300">{title}</span>
            )}
          </div>

          
          {/* ============ RIGHT SIDE (MENU) ============ */}
          <div className="flex items-center gap-3">
            
            {/* 1. DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-1">
              {showMenu && (
                <>
                  <div className="flex items-center gap-2 mr-4">
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative group">
                          {/* Main Link */}
                          <button
                              onClick={() => !link.dropdown && handleNavigation(link.path)}
                              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1"
                          >
                              {link.name}
                              {link.dropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300"/>}
                          </button>

                          {/* Dropdown Menu (Desktop) */}
                          {link.dropdown && (
                             <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50 overflow-hidden">
                                <div className="p-1">
                                  {link.dropdown.map((subItem) => (
                                    <button
                                      key={subItem.name}
                                      onClick={() => handleNavigation(subItem.path)}
                                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                    >
                                      {subItem.name}
                                    </button>
                                  ))}
                                </div>
                             </div>
                          )}
                        </div>
                    ))}
                  </div>

                  {/* Tombol Masuk */}
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/login")}
                    className="mr-2 flex items-center gap-2"
                  >
                    Masuk
                    <LogIn size={16} />
                  </Button>
                </>
              )}
            </div>

            {/* 2. USER ELEMENT (Profile/Dashboard) */}
            {rightElement && (
                <div className="flex-shrink-0 ml-2">
                    {rightElement}
                </div>
            )}

            {/* 3. MOBILE TOGGLE */}
            {showMenu && (
              <button
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ============ MOBILE DROPDOWN ============ */}
      {isOpen && showMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-4 px-4 flex flex-col gap-2 h-[calc(100vh-64px)] overflow-y-auto">
           {navLinks.map((link) => (
                <div key={link.name}>
                    <button
                        onClick={() => link.dropdown ? toggleMobileSubmenu(link.name) : handleNavigation(link.path)}
                        className="w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl active:bg-blue-50 active:text-blue-600 transition-colors flex justify-between items-center"
                    >
                        {link.name}
                        {link.dropdown && <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubmenu === link.name ? 'rotate-180' : ''}`} />}
                    </button>

                    {/* Mobile Submenu */}
                    {link.dropdown && mobileSubmenu === link.name && (
                      <div className="pl-6 pr-2 py-1 space-y-1 bg-gray-50/50 rounded-lg mx-2">
                         {link.dropdown.map((subItem) => (
                           <button
                             key={subItem.name}
                             onClick={() => handleNavigation(subItem.path)}
                             className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg"
                           >
                             {subItem.name}
                           </button>
                         ))}
                      </div>
                    )}
                </div>
            ))}
            
            <hr className="my-2 border-gray-100"/>

            <Button 
                variant="outline" 
                onClick={() => { navigate("/login"); setIsOpen(false); }}
                className="w-full justify-center gap-2"
            >
                <LogIn size={18} />
                Masuk
            </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;