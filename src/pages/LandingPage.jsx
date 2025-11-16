import React, { useState } from "react";
import { Heart, MessageCircle, MapPin, BookOpen, Shield, Users, Menu, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

const Button = ({ children, variant = "default", className = "", ...props }) => {
  let baseStyle = "px-4 py-2 font-semibold rounded-xl transition-all duration-200 shadow-lg active:scale-[0.98] focus:ring-4 focus:ring-opacity-50";

  if (variant === "outline") {
    // Styling outline
    baseStyle += " bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300";
  } else {
    // Styling default
    baseStyle += " bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  }

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  // Menggunakan placehold.co sebagai placeholder
  const placeholderUrl = `https://placehold.co/1080x720/6366f1/ffffff?text=${alt.replace(/\s/g, '+')}`;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(placeholderUrl)}
      loading="lazy"
    />
  );
};

// --- Main App 
const App = () => {
const navigate = useNavigate();
const [isOpen, setIsOpen] = useState(false);

  const onGetStarted = () => {
    navigate('/login');
  };
  const onLearnMore = () => {
      document.getElementById('edukasi')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const educationArticles = [
  {
    id: 1,
    title: "Pentingnya Consent dalam Hubungan",
    description: "Pelajari mengapa persetujuan adalah dasar dari setiap hubungan yang sehat.",
    image: "https://placehold.co/600x400/blue/white?text=Consent",
    category: "Consent",
    color: "blue",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Menjaga Batasan Diri dan Orang Lain",
    description: "Cara sehat untuk mengatakan tidak dan menghormati keputusan orang lain.",
    image: "https://placehold.co/600x400/pink/white?text=Boundaries",
    category: "Hubungan",
    color: "pink",
    readTime: "4 min",
  },
];

const getCategoryColor = (color) => {
  switch (color) {
    case "blue":
      return "bg-blue-100 text-blue-700";
    case "pink":
      return "bg-pink-100 text-pink-700";
    case "purple":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* Navbar */}
      <Navbar onGetStarted={onGetStarted} />

      {/* Hero Section */}
<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
  <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
    <div className="space-y-5">
      <div className="inline-block">
        <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium text-sm shadow-sm">
          🛡️ Ruang Aman
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
        Ruang Aman untuk Bicara, Belajar, dan Mendapatkan Dukungan
      </h1>
      <p className="text-base text-gray-600 leading-relaxed">
        SpeakUp adalah platform yang memberikan ruang aman untuk edukasi seksual, berbagi cerita secara anonim, dan mendapatkan bantuan darurat. Kamu nggak sendiri, kami di sini untuk mendengarkan.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-md px-7"
            >
              Masuk
            </Button>
        <Button 
          onClick={onLearnMore}
          variant="outline" 
          className="rounded-full px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-base shadow-sm"
        >
          📚 Pelajari Selengkapnya
        </Button>
      </div>
    </div>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-2xl -z-10"></div>
      <ImageWithFallback 
        src="img"
        alt="SpeakUp img"
        className="relative rounded-2xl shadow-xl w-full object-cover h-64 md:h-80 lg:h-96"
      />
    </div>
  </div>
</section>

      {/* Features Section */}
      <section id="fitur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fitur yang Kami Sediakan
          </h2>
          <p className="text-lg text-gray-600">
            Semua yang kamu butuhkan dalam satu platform aman dan terpercaya
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">💬 Chat Anonim dengan Satgas</h3>
            <p className="text-gray-600">
              Berbicara langsung dengan tenaga ahli secara anonim dan real-time
            </p>
          </Card>

          <Card className="p-6 border-2 border-gray-100 hover:border-purple-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🕊️ Menfess Aman</h3>
            <p className="text-gray-600">
              Berbagi cerita dan pengalaman tanpa identitas dalam komunitas yang suportif
            </p>
          </Card>

          <Card id="edukasi-content" className="p-6 border-2 border-gray-100 hover:border-pink-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🎓 Edukasi Seksual</h3>
            <p className="text-gray-600">
              Pelajari tentang consent, hubungan sehat, dan hak-hak kamu
            </p>
          </Card>

          <Card className="p-6 border-2 border-gray-100 hover:border-red-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">📍 Peta Lokasi Darurat</h3>
            <p className="text-gray-600">
              Temukan bantuan terdekat: polisi, satgas, dan rumah sakit
            </p>
          </Card>
        </div>
      </section>

{/* Article Section */}
        <section id="edukasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                📚 Edukasi & Artikel
              </h2>
              <p className="text-gray-600">
                Pelajari lebih dalam tentang consent, hubungan sehat, dan hak-hakmu
              </p>
            </div>
            <Button variant="outline" className="rounded-2xl">
              Lihat Semua
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {educationArticles.map((article) => (
              <Card 
                key={article.id}
                className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer group"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <ImageWithFallback 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.color)}`}>
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ⏱️ {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {article.description}
                  </p>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                    Baca Selengkapnya →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

      {/* Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Kamu Nggak Sendiri</h2>
            <p className="opacity-90 max-w-2xl mx-auto text-lg">
              Ribuan orang telah menemukan dukungan dan bantuan melalui SpeakUp. Cerita kamu penting, dan kami mendengarkan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl shadow-none">
              <p className="text-white/90 mb-4 italic">
                "Terima kasih SpeakUp, aku akhirnya berani bicara dan dapat bantuan yang aku butuhkan."
              </p>
              <p className="text-white/70 font-semibold">— Anonim #127</p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl shadow-none">
              <p className="text-white/90 mb-4 italic">
                "Platform ini sangat membantu untuk belajar tentang consent dan hak-hak kita."
              </p>
              <p className="text-white/70 font-semibold">— Anonim #352</p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl shadow-none">
              <p className="text-white/90 mb-4 italic">
                "Aku merasa lebih aman mengetahui ada tempat seperti ini untuk curhat tanpa takut dihakimi."
              </p>
              <p className="text-white/70 font-semibold">— Anonim #891</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Hotline Section */}
      <section id="bantuan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hotline Bantuan Darurat
          </h2>
          <p className="text-xl text-gray-600">
            Jika kamu dalam kondisi darurat, jangan ragu untuk menghubungi layanan berikut
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center border-2 border-blue-100 hover:border-blue-400 hover:shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              📞
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">SAPA 129</h3>
            <p className="text-gray-600 mb-3">Layanan Kesehatan Mental</p>
            <a href="tel:129" className="text-blue-600 font-semibold hover:underline">Hubungi: 129</a>
          </Card>

          <Card className="p-6 text-center border-2 border-red-100 hover:border-red-400 hover:shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🚓
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Polisi 110</h3>
            <p className="text-gray-600 mb-3">Kepolisian Darurat</p>
            <a href="tel:110" className="text-blue-600 font-semibold hover:underline">Hubungi: 110</a>
          </Card>

          <Card className="p-6 text-center border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🧑‍⚖️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">P2TP2A</h3>
            <p className="text-gray-600 mb-3">Perlindungan Perempuan & Anak</p>
            <p className="text-blue-600 font-semibold">Cek lokasi terdekat</p> 
          </Card>
        </div>
      </section>

      
        </div>
  );
};

export default App;