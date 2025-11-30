import React, { useState, useMemo, useEffect } from "react";
import { Menu, X, ArrowLeft, LogIn, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

// Ganti URL ini sesuai backend kamu
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Button = ({ children, variant = "default", className = "", ...props }) => {
  let baseStyle =
    "px-4 py-2 font-semibold rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] focus:ring-4 focus:ring-opacity-50";

  if (variant === "outline") {
    baseStyle +=
      " bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 focus:ring-blue-300";
  } else if (variant === "ghost") {
    baseStyle +=
      " bg-transparent text-gray-700 hover:bg-gray-100 shadow-none";
  } else if (variant === "red") {
    baseStyle +=
      " bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-red-200";
  } else {
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
  showMenu = true,
  backButton = false,
  title = "",
  rightElement = null, 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [activeRole, setActiveRole] = useState("guest");
  const [articleCategories, setArticleCategories] = useState([]);

  // --- 1. AUTO DETECT ROLE (PRIORITAS SATGAS) ---
  useEffect(() => {
    const checkRole = () => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        const directRole = localStorage.getItem("userRole"); // Key dari screenshotmu ("Satgas")

        if (token) {
            // Default ke user dulu
            let detectedRole = "user";

            // Cek 1: Langsung dari key 'userRole' (Prioritas Utama)
            if (directRole && directRole.toLowerCase() === "satgas") {
                detectedRole = "satgas";
            } 
            // Cek 2: Dari dalam object user (Backup)
            else if (userString) {
                try {
                    const user = JSON.parse(userString);
                    if (user.role && user.role.toLowerCase() === "satgas") {
                        detectedRole = "satgas";
                    }
                } catch (e) {
                    console.error("Error parsing user data", e);
                }
            }
            
            setActiveRole(detectedRole);
        } else {
            setActiveRole("guest");
        }
    };
    checkRole();
  }, []);

  // --- 2. FETCH KATEGORI (KHUSUS USER) ---
  useEffect(() => {
    const fetchCategories = async () => {
      // Satgas tidak butuh dropdown artikel di navbar
      if (activeRole === "user") {
        try {
          const response = await axios.get(`${API_BASE_URL}/article`);
          const result = response.data;
          let data = [];
          
          if (result.payload && Array.isArray(result.payload.datas)) {
            data = result.payload.datas;
          } else if (Array.isArray(result)) {
            data = result;
          }

          const categories = [...new Set(data.map(item => item.category?.name).filter(Boolean))];
          setArticleCategories(categories);
        } catch (error) {
          console.error("Gagal memuat kategori navbar:", error);
        }
      }
    };

    fetchCategories();
  }, [activeRole]);

  // --- 3. KONFIGURASI MENU DINAMIS ---
  const navLinks = useMemo(() => {
    const config = {
      guest: [
        { name: "Beranda", path: "/#hero" },
        { name: "Fitur", path: "/#fitur" },
        { name: "Tentang Kami", path: "/#about" },
        { name: "Kontak", path: "/#contact" },
      ],
      user: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Game", path: "/game" },
        { 
          name: "Artikel", 
          path: "/articles",
          dropdown: articleCategories.length > 0 
            ? articleCategories.map(cat => ({ 
                name: cat, 
                path: `/articles?category=${encodeURIComponent(cat)}`
              }))
            : [
                { name: "Semua Artikel", path: "/articles" }
              ]
        },
        { 
          name: "Layanan", 
          path: "#layanan",
          dropdown: [
            { name: "Chat Satgas", path: "/chat" },
            { name: "Menfess", path: "/menfess" },
            { name: "Peta Darurat", path: "/maps" },
          ]
        },
        { name: "Komunitas", path: "/community" },
      ],
      // Menu Khusus Satgas (Simple & To the Point)
      satgas: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Inbox Chat", path: "/chat" }, 
        { name: "Laporan Menfess", path: "/menfess" }, 
        { name: "Peta Monitoring", path: "/maps" }, 
      ]
    };

    return config[activeRole] || config.guest;
  }, [activeRole, articleCategories]);

  const handleDefaultLogout = () => {
    Swal.fire({
      title: 'Keluar?',
      text: "Sesi kamu akan berakhir.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
        window.location.reload(); 
      }
    });
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      if (element) element.scrollIntoView({ behavior: "smooth" });
      else navigate("/" + path);
    } else {
      navigate(path);
    }
  };

  const toggleMobileSubmenu = (name) => {
    setMobileSubmenu(mobileSubmenu === name ? null : name);
  };

  // --- RENDER ---
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">

          {/* === LEFT SIDE === */}
          <div className="flex items-center gap-4">
            {backButton ? (
               /* MODE MINIMALIS */
               <div className="flex items-center gap-4">
                  <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  {title && <span className="text-lg font-bold text-gray-800">{title}</span>}
               </div>
            ) : (
               /* MODE FULL */
               <div onClick={() => activeRole === 'guest' ? handleNavigation("/#hero") : handleNavigation("/dashboard")} className="flex items-center gap-2 cursor-pointer group">
                 <div className="transition-all duration-300 group-hover:scale-105">
                  <img src="https://res.cloudinary.com/dj2gwflqs/image/upload/v1764211938/Group_1_gryebt.png" alt="Logo Gugah" className="w-10 h-10 object-contain drop-shadow-sm" />
                </div>
                <span className="text-blue-900 font-extrabold text-3xl tracking-tight transition-colors group-hover:text-blue-700">Gugah</span>
                
                {/* Badge Satgas jika terdeteksi */}
                {activeRole === 'satgas' && (
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200">
                        SATGAS
                    </span>
                )}
              </div>
            )}
          </div>

          {/* === RIGHT SIDE === */}
          {!backButton ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1">
                  {showMenu && (
                    <>
                      <div className="flex items-center gap-1 mr-4">
                        {navLinks.map((link) => (
                          <div key={link.name} className="relative group">
                            <button onClick={() => !link.dropdown && handleNavigation(link.path)} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1">
                              {link.name}
                              {link.dropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300"/>}
                            </button>
                            {link.dropdown && (
                              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50 overflow-hidden">
                                <div className="p-1">
                                  {link.dropdown.map((subItem) => (
                                    <button key={subItem.name} onClick={() => handleNavigation(subItem.path)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                      {subItem.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {activeRole === 'guest' ? (
                        <Button variant="outline" onClick={() => navigate("/login")} className="mr-2 flex items-center gap-2">Masuk <LogIn size={16} /></Button>
                      ) : (
                          !rightElement && <Button variant="ghost" onClick={handleDefaultLogout} className="text-red-500 hover:bg-red-50"><LogOut size={18} /></Button>
                      )}
                    </>
                  )}
                </div>
                {rightElement && <div className="flex-shrink-0 ml-2">{rightElement}</div>}
                {showMenu && (
                  <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                )}
              </div>
          ) : (
              rightElement && <div className="flex-shrink-0 ml-2">{rightElement}</div>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {!backButton && isOpen && showMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-4 px-4 flex flex-col gap-2 h-[calc(100vh-64px)] overflow-y-auto">
           {navLinks.map((link) => (
                <div key={link.name}>
                    <button onClick={() => link.dropdown ? toggleMobileSubmenu(link.name) : handleNavigation(link.path)} className="w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl active:bg-blue-50 active:text-blue-600 transition-colors flex justify-between items-center">
                        {link.name}
                        {link.dropdown && <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubmenu === link.name ? 'rotate-180' : ''}`} />}
                    </button>
                    {link.dropdown && mobileSubmenu === link.name && (
                      <div className="pl-6 pr-2 py-1 space-y-1 bg-gray-50/50 rounded-lg mx-2">
                          {link.dropdown.map((subItem) => (
                           <button key={subItem.name} onClick={() => handleNavigation(subItem.path)} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">
                             {subItem.name}
                           </button>
                          ))}
                      </div>
                    )}
                </div>
           ))}
           <hr className="my-2 border-gray-100"/>
           {activeRole === 'guest' ? (
               <Button variant="outline" onClick={() => { navigate("/login"); setIsOpen(false); }} className="w-full justify-center gap-2"><LogIn size={18} /> Masuk</Button>
           ) : (
               <Button variant="ghost" onClick={() => { handleDefaultLogout(); setIsOpen(false); }} className="w-full justify-center gap-2 text-red-600 hover:bg-red-50"><LogOut size={18} /> Keluar</Button>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;