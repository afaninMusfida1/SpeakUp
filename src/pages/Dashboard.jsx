import { ArrowLeft, BookOpen, MessageCircle, MapPin, Heart, Shield, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 

const educationArticles = [
  {
    id: 1,
    title: "Apa Itu Consent?",
    description: "Memahami pentingnya persetujuan dalam hubungan dan interaksi sosial.",
    category: "Dasar",
    readTime: "5 menit",
    image: "https://images.unsplash.com/photo-1760840415479-438f61268bed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGNvbmNlcHR8ZW58MXx8fHwxNzYyMjcxNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "blue"
  },
  {
    id: 2,
    title: "Mengenali Tanda-Tanda Hubungan Tidak Sehat",
    description: "Pelajari red flags dalam hubungan dan cara mengatasinya.",
    category: "Hubungan",
    readTime: "7 menit",
    image: "https://images.unsplash.com/photo-1530043123514-c01b94ef483b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwaWxsdXN0cmFhdGlvbnxlbnwxfHx8fDE3NjIyNzE2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "purple"
  },
  {
    id: 3,
    title: "Hak-Hak Kamu sebagai Korban",
    description: "Ketahui hak-hak legal dan perlindungan yang tersedia untukmu.",
    category: "Legal",
    readTime: "6 menit",
    image: "https://images.unsplash.com/photo-1651493355781-20b4e12f3231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwZXJzb24lMjBob2xkaW5nJTIwcGhvbmUlMjBzYWZlJTIwc3BhY2V8ZW58MXx8fHwxNzYyMjcxNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "pink"
  },
  {
    id: 4,
    title: "Cara Melapor Kekerasan Seksual",
    description: "Panduan langkah demi langkah untuk melaporkan kasus.",
    category: "Bantuan",
    readTime: "8 menit",
    image: "https://images.unsplash.com/photo-1530043123514-c01b94ef483b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwaWxsdXN0cmFhdGlvbnxlbnwxfHx8fDE3NjIyNzE2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "red"
  }
];

const Button = ({ onClick, children, className, variant }) => {
  let baseClasses = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  if (variant === "ghost") {
    baseClasses = "hover:bg-gray-100 hover:text-accent-foreground";
  } else if (variant === "outline") {
    baseClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ onClick, children, className }) => (
  <div 
    onClick={onClick} 
    className={`bg-white shadow-sm rounded-lg ${className} ${onClick ? 'cursor-pointer' : ''}`}
  >
    {children}
  </div>
);

const ImageWithFallback = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} loading="lazy" />
);

export default function Dashboard({ 
  username, 
}) {
  const navigate = useNavigate();

  const handleGoToMaps = () => navigate('/maps'); 
  const handleStartChat = () => navigate('/chat'); 
  const handleGoToMenfess = () => navigate('/menfess'); 
  const handleBack = () => navigate(-1); 

  const getCategoryColor = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      pink: "bg-pink-100 text-pink-700",
      red: "bg-red-100 text-red-700"
    };
    return colors[color] || colors.blue; 
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              className="rounded-xl p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-gray-900">Dashboard</h2>
              <p className="text-gray-600">{username}</p>
            </div>
          </div>
          <a 
            className="text-red-600 hover:text-red-700"
          >
            🚨 Butuh bantuan
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Halo, siapapun kamu — kamu aman di sini 💙
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ini adalah ruang aman untukmu belajar, berbagi, dan mendapatkan dukungan. 
            Semua yang ada di sini untuk membantumu merasa lebih kuat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card 
            onClick={handleStartChat} 
            className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-0"
          >
            <MessageCircle className="w-12 h-12 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Chat dengan Satgas</h3>
            <p className="opacity-90 text-sm">
              Berbicara langsung dengan tenaga ahli yang siap mendengarkan
            </p>
          </Card>

          <Card 
            onClick={handleGoToMenfess} 
            className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-0"
          >
            <Heart className="w-12 h-12 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Menfess Aman</h3>
            <p className="opacity-90 text-sm">
              Berbagi cerita anonim dalam komunitas yang suportif
            </p>
          </Card>

          <Card 
            onClick={handleGoToMaps} 
            className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-0"
          >
            <MapPin className="w-12 h-12 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Lokasi Darurat</h3>
            <p className="opacity-90 text-sm">
              Temukan bantuan terdekat: polisi, satgas, dan rumah sakit
            </p>
          </Card>
        </div>

        {/* Education Articles */}
        <div className="mb-8">
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
        </div>

        {/* Resources Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border-2 border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Panduan Lengkap
                </h3>
                <p className="text-gray-600 mb-4">
                  Download panduan lengkap tentang pencegahan dan penanganan kekerasan seksual
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl">
                  Download PDF
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-pink-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Komunitas Support
                </h3>
                <p className="text-gray-600 mb-4">
                  Bergabung dengan komunitas survivor dan dapatkan support dari sesama
                </p>
                <Button className="bg-pink-600 hover:bg-pink-700 rounded-2xl">
                  Gabung Komunitas
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Help Banner */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl border-0">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-3">
              Butuh Bantuan Sekarang?
            </h2>
            <p className="mb-6 opacity-90">
              Jangan ragu untuk menghubungi kami kapanpun. Tim Satgas SpeakUp siap membantu 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleStartChat} // Menggunakan handler lokal
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-8 gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat dengan Satgas
              </Button>
              <Button 
                onClick={handleGoToMaps} 
                variant="outline"
                className="flex border-2 border-white text-white hover:bg-white/10 rounded-2xl px-8 gap-2 py-2"
              >
                <MapPin className="w-5 h-5" />
                Cari Bantuan Terdekat
              </Button>
            </div>
          </div>
        </Card>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            💙 Semua konten di SpeakUp dibuat oleh para ahli untuk memberdayakan dan melindungi kamu
          </p>
        </div>
      </div>
    </div>
  );
}