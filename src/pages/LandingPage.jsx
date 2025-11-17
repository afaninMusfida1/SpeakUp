import React, { useState } from "react";
import { Heart, MessageCircle, MapPin, BookOpen, Shield, Users, ChevronDown, Lock, Phone } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Button Konsisten ---
const Button = ({ children, variant = "default", className = "", ...props }) => {
  let baseStyle = "font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50";

  switch (variant) {
    case "outline":
      baseStyle += " px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-200";
      break;
    case "ghost":
      baseStyle += " px-6 py-3 rounded-xl text-blue-600 hover:text-blue-700 bg-transparent shadow-none";
      break;
    default:
      baseStyle += " px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md focus:ring-blue-400";
      break;
  }

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Card ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>{children}</div>
);

// --- ImageWithFallback ---
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
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

// --- FAQItem ---
const FAQItem = ({ question, answer, icon: Icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`border rounded-xl shadow-md overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-400 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white px-6 py-4 font-semibold flex justify-between items-center transition-all duration-300"
      >
        <span className="flex items-center text-lg text-gray-900">
          {Icon && <Icon className={`w-5 h-5 mr-3 transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-500'}`} />}
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`} style={{ transitionProperty: 'max-height' }}>
        <div className="px-6 pb-4 pt-0 text-gray-600 border-t border-gray-100">
          {answer}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onLearnMore = () => {
    document.getElementById('edukasi')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const educationArticles = [
    { id: 1, title: "Pentingnya Consent dalam Hubungan", description: "Pelajari mengapa persetujuan adalah dasar dari setiap hubungan yang sehat.", image: "https://placehold.co/600x400/blue/white?text=Consent", category: "Consent", color: "blue", readTime: "5 min" },
    { id: 2, title: "Menjaga Batasan Diri dan Orang Lain", description: "Cara sehat untuk mengatakan tidak dan menghormati keputusan orang lain.", image: "https://placehold.co/600x400/pink/white?text=Boundaries", category: "Hubungan", color: "pink", readTime: "4 min" },
  ];

  const getCategoryColor = (color) => {
    switch (color) {
      case "blue": return "bg-blue-100 text-blue-700";
      case "pink": return "bg-pink-100 text-pink-700";
      case "purple": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar showMenu={true} showUrgent={true} />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium text-sm shadow-sm">🛡️ Ruang Aman</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
              Ruang Aman untuk Bicara, Belajar, dan Mendapatkan Dukungan
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              SpeakUp adalah platform yang memberikan ruang aman untuk edukasi seksual, berbagi cerita secara anonim, dan mendapatkan bantuan darurat. Kamu nggak sendiri, kami di sini untuk mendengarkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={handleLogin}>Masuk</Button>
              <Button variant="outline" onClick={onLearnMore}>📚 Pelajari Selengkapnya</Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-2xl -z-10"></div>
            <ImageWithFallback src="img" alt="SpeakUp img" className="relative rounded-2xl shadow-xl w-full object-cover h-64 md:h-80 lg:h-96" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur yang Kami Sediakan</h2>
          <p className="text-lg text-gray-600">Semua yang kamu butuhkan dalam satu platform aman dan terpercaya</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">💬 Chat Anonim dengan Satgas</h3>
            <p className="text-gray-600">Berbicara langsung dengan tenaga ahli secara anonim dan real-time</p>
          </Card>

          <Card className="p-6 border-2 border-gray-100 hover:border-purple-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🕊️ Menfess Aman</h3>
            <p className="text-gray-600">Berbagi cerita dan pengalaman tanpa identitas dalam komunitas yang suportif</p>
          </Card>

          <Card id="edukasi-content" className="p-6 border-2 border-gray-100 hover:border-pink-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🎓 Edukasi Seksual</h3>
            <p className="text-gray-600">Pelajari tentang consent, hubungan sehat, dan hak-hak kamu</p>
          </Card>

          <Card className="p-6 border-2 border-gray-100 hover:border-red-400 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">📍 Peta Lokasi Darurat</h3>
            <p className="text-gray-600">Temukan bantuan terdekat: polisi, satgas, dan rumah sakit</p>
          </Card>
        </div>
      </section>

      {/* Artikel Section */}
      <section id="edukasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">📚 Edukasi & Artikel</h2>
            <p className="text-gray-600">Pelajari lebih dalam tentang consent, hubungan sehat, dan hak-hakmu</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/login")} className="rounded-2xl">Lihat Semua</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {educationArticles.map((article) => (
            <Card key={article.id} className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer group">
              <div className="aspect-video overflow-hidden bg-gray-100">
                <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.color)}`}>
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">⏱️ {article.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                <Button variant="ghost">Baca Selengkapnya →</Button>
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
              <p className="text-white/90 mb-4 italic">"Terima kasih SpeakUp, aku akhirnya berani bicara dan dapat bantuan yang aku butuhkan."</p>
              <p className="text-white/70 font-semibold">— Anonim #127</p>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl shadow-none">
              <p className="text-white/90 mb-4 italic">"Platform ini sangat membantu untuk belajar tentang consent dan hak-hak kita."</p>
              <p className="text-white/70 font-semibold">— Anonim #352</p>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl shadow-none">
              <p className="text-white/90 mb-4 italic">"Aku merasa lebih aman mengetahui ada tempat seperti ini untuk curhat tanpa takut dihakimi."</p>
              <p className="text-white/70 font-semibold">— Anonim #891</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Hotline Section */}
      <section id="bantuan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Hotline Bantuan Darurat</h2>
          <p className="text-xl text-gray-600">
            Jika kamu dalam kondisi darurat, jangan ragu untuk menghubungi layanan berikut
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center border-2 border-blue-100 hover:border-blue-400 hover:shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📞</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">SAPA 129</h3>
            <p className="text-gray-600 mb-3">Layanan Kesehatan Mental</p>
            <a href="tel:129" className="text-blue-600 font-semibold hover:underline">Hubungi: 129</a>
          </Card>

          <Card className="p-6 text-center border-2 border-red-100 hover:border-red-400 hover:shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🚓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Polisi 110</h3>
            <p className="text-gray-600 mb-3">Kepolisian Darurat</p>
            <a href="tel:110" className="text-blue-600 font-semibold hover:underline">Hubungi: 110</a>
          </Card>

          <Card className="p-6 text-center border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🧑‍⚖️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">P2TP2A</h3>
            <p className="text-gray-600 mb-3">Perlindungan Perempuan & Anak</p>
            <p className="text-blue-600 font-semibold">Cek lokasi terdekat</p> 
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full mr-2">
              <Shield className="w-5 h-5 inline-block -mt-0.5" />
            </span>
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban cepat tentang anonimitas, penggunaan fitur, dan panduan keamanan di SpeakUp.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem question="Apakah SpeakUp benar-benar anonim?" answer="Ya! Semua interaksi di platform ini, terutama fitur Menfess dan Chat dengan Satgas, dirancang untuk menjaga anonimitas mutlak penggunanya. Identitasmu aman dan tidak akan dibagikan tanpa izin." icon={Lock} />
          <FAQItem question="Bagaimana cara menghubungi Satgas secara anonim?" answer="Kamu bisa menggunakan fitur Chat Anonim dengan Satgas yang tersedia di dashboard setelah login. Kamu akan terhubung dengan tenaga ahli tanpa perlu mengungkapkan nama atau identitas pribadimu." icon={MessageCircle} />
          <FAQItem question="Apakah ada batasan usia untuk menggunakan SpeakUp?" answer="Platform ini terbuka untuk semua usia yang mencari edukasi dan dukungan. Namun, untuk layanan konsultasi tertentu, bagi yang berusia di bawah 18 tahun, kami menyarankan adanya pendampingan orang dewasa." icon={Users} />
          <FAQItem question="Bagaimana jika saya berada dalam kondisi darurat?" answer="Jika kamu dalam bahaya langsung, segera hubungi Hotline Darurat yang tertera di bagian bawah halaman ini (Polisi 110 atau SAPA 129). Kamu juga bisa menggunakan fitur Peta Lokasi Darurat untuk menemukan bantuan terdekat." icon={Phone} defaultOpen={true} />
          <FAQItem question="Apa itu fitur Menfess Aman?" answer="Menfess Aman adalah fitur untuk berbagi cerita, pengalaman, atau pertanyaan secara anonim kepada komunitas. Fitur ini dimoderasi untuk memastikan lingkungan yang suportif dan bebas dari penghakiman." icon={Heart} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
