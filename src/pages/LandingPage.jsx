import React from "react"; 
import { Heart, MessageCircle, MapPin, BookOpen, Shield, Users, Lock, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion"; 
import { HERO_IMAGE_URL, fadeInUp, staggerContainer, getCategoryColor } from '../lib/landingPageUtils';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/common/Button"; 
import Card from "../components/common/Card"; 
import ImageWithFallback from "../components/common/ImageWithFallback"; 
import FAQItem from "../components/common/FAQItem"; 
import useLandingPageData from "../hooks/useLandingPageData";


const LandingPage = () => {
  const { 
    educationArticles, 
    loadingArticles, 
    error, 
    onLearnMore, 
    handleLogin, 
    handleReadArticle, 
    navigate,
  } = useLandingPageData();
  
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar showMenu={true} showUrgent={true} />

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer} 
              className="space-y-5"
            >
              <motion.div variants={fadeInUp} className="inline-block">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                   </span>
                  <span className="flex text-sm font-medium text-blue-700">Ruang Aman</span>
                </div>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
                Ruang Aman untuk Bicara, Belajar, dan <br className="hidden lg:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Mendapatkan Dukungan
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-base text-gray-600 leading-relaxed">
                SpeakUp adalah sebuah platform yang berkomitmen dalam upaya pencegahan kekerasan seksual dengan menyediakan edukasi seksual yang inklusif. Selain itu, sebagai ruang berbagi cerita, memberikan akses bantuan, dan dukungan kepada setiap individu yang membutuhkan.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleLogin}
                  className="shadow-blue-200 shadow-lg hover:shadow-blue-300"
                >
                  Masuk
                </Button>
                
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-64 md:h-80 lg:h-96 w-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <ImageWithFallback 
                      src={HERO_IMAGE_URL} 
                      alt="SpeakUp img" 
                      className="w-full h-full object-cover bg-gray-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

                 {/* Floating Cards (Animated) */}
                 <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }}
                    className="absolute -bottom-4 -left-2 md:-bottom-4 md:-left-6 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 max-w-[150px] hidden sm:block"
                 >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                        <Shield size={16} />
                      </div>
                      <span className="font-bold text-gray-800 text-xs">Privasi Dijamin</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">Enkripsi end-to-end.</p>
                 </motion.div>

                 <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }}
                    className="absolute top-4 -right-2 md:top-8 md:-right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/50 items-center gap-2 animate-pulse hidden sm:flex"
                 >
                     <div className="bg-red-100 p-1.5 rounded-full text-red-600">
                        <Heart size={14} fill="currentColor" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-800">Didengar ❤️</p>
                     </div>
                 </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      
      {/* ... (Features Section) ... */}
      <section id="fitur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur yang Kami Sediakan</h2>
          <p className="text-lg text-gray-600">Semua yang kamu butuhkan dalam satu platform aman dan terpercaya</p>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1: Chat (Large) */}
          <motion.div variants={fadeInUp} className="md:col-span-2 bg-blue-50 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:bg-blue-100 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity" />
            <div className="flex-1 relative z-10">
              <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Chat Satgas 24/7</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Curhat langsung dengan konselor profesional atau Satgas tanpa takut dihakimi.
                Kami siap mendengarkan kapan saja.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-white p-4 rounded-3xl shadow-lg border border-blue-100 rotate-2 group-hover:rotate-0 transition-transform">
                {/* Fake Chat UI */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-600 w-3/4">Halo, aku butuh teman cerita...</div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">S</div>
                    <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-sm text-white w-3/4">Halo! Tenang ya, kamu aman di sini.</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Menfess (Tall) */}
          <motion.div variants={fadeInUp} className="bg-purple-50 rounded-[2.5rem] p-8 md:p-10 group cursor-pointer hover:bg-purple-100 transition-colors relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-white text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Menfess Aman</h3>
            <p className="text-gray-600 mb-6">
              Tulis surat anonim untuk komunitas. Saling menguatkan tanpa perlu membuka identitas.
            </p>
          </motion.div>

          {/* Feature 3: Edukasi */}
          <motion.div variants={fadeInUp} className="bg-pink-50 rounded-[2.5rem] p-8 md:p-10 group cursor-pointer hover:bg-pink-100 transition-colors">
            <div className="w-16 h-16 bg-white text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Edukasi Seksual</h3>
            <p className="text-gray-600">Library artikel tentang consent, boundaries, dan kesehatan reproduksi.</p>
          </motion.div>

          {/* Feature 4: Peta Darurat (Wide) */}
          <motion.div variants={fadeInUp} className="md:col-span-2 bg-red-50 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer hover:bg-red-100 transition-colors">
            <div className="flex-1">
              <div className="w-16 h-16 bg-white text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <MapPin size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Peta Lokasi Darurat</h3>
              <p className="text-gray-600">
                Temukan kantor polisi, rumah sakit, dan rumah aman terdekat dalam satu klik. Integrasi GPS real-time.
              </p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-md -rotate-2 group-hover:rotate-0 transition-transform">
              <div className="w-48 h-32 bg-gray-200 rounded-xl relative overflow-hidden">
                {/* Mock Map */}
                <div className="absolute inset-0 bg-red-100 opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="text-red-600 animate-bounce" size={32} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>      
      </section>

      {/* Artikel Section*/}
      <section id="edukasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex items-center justify-between mb-6"
          >
              <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">📚 Edukasi & Artikel</h2>
                  <p className="text-gray-600">Pelajari lebih dalam tentang consent, hubungan sehat, dan hak-hakmu</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/articles")} className="rounded-2xl">Lihat Semua</Button> 
          </motion.div>

          <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="grid md:grid-cols-2 gap-6"
          >
              {loadingArticles ? (
                  <div className="md:col-span-2 text-center p-8 bg-gray-100 rounded-xl">
                      <svg className="w-6 h-6 mx-auto mb-2 text-purple-500 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/></svg>
                      <p className="text-gray-600">Memuat artikel edukasi...</p>
                  </div>
              ) : error ? (
                  <div className="md:col-span-2 text-center p-8 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 font-medium">⚠️ {error}</p>
                      <p className="text-sm text-red-500">Silakan periksa koneksi Anda.</p>
                  </div>
              ) : educationArticles.length === 0 ? (
                  <div className="md:col-span-2 text-center p-8 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-yellow-700 font-medium">Tidak ada artikel yang ditemukan.</p>
                  </div>
              ) : (
                  educationArticles.map((article) => (
                      <motion.div 
                          key={article.id} 
                          variants={fadeInUp}
                          onClick={() => handleReadArticle(article.id)} 
                      >
                          <Card className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer group h-full">
                              <div className="aspect-video overflow-hidden bg-gray-100">
                                  <ImageWithFallback 
                                      src={article.imageUrl} 
                                      alt={article.title} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                  />
                              </div>
                              <div className="p-6">
                                  <div className="flex items-center gap-3 mb-3">
                                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.color)}`}>
                                          {article.category}
                                      </span>
                                      <span className="text-gray-500 text-sm">⏱️ {article.timeRead ? `${article.timeRead} menit` : '...'}</span> 
                                  </div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p> 
                                  <Button variant="ghost" className="pl-0 hover:bg-transparent">Baca Selengkapnya →</Button>
                              </div>
                          </Card>
                      </motion.div>
                  ))
              )}
          </motion.div>
      </section>

      {/* --- Testimonial Section --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
        >
          <div className="text-center mb-12">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Kamu Nggak Sendiri</h2>
            <p className="opacity-90 max-w-2xl mx-auto text-lg">
              Ribuan orang telah menemukan dukungan dan bantuan melalui SpeakUp. Cerita kamu penting, dan kami mendengarkan.
            </p>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {[
              { text: "Terima kasih SpeakUp, aku akhirnya berani bicara dan dapat bantuan yang aku butuhkan.", author: "Anonim #127" },
              { text: "Platform ini sangat membantu untuk belajar tentang consent dan hak-hak kita.", author: "Anonim #352" },
              { text: "Aku merasa lebih aman mengetahui ada tempat seperti ini untuk curhat tanpa takut dihakimi.", author: "Anonim #891" }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl shadow-none h-full">
                  <p className="text-white/90 mb-4 italic">"{item.text}"</p>
                  <p className="text-white/70 font-semibold">— {item.author}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* --- Hotline Section --- */}
      <section id="bantuan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Hotline Bantuan Darurat</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jika kamu dalam kondisi darurat, jangan ragu untuk menghubungi layanan berikut
          </p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp}>
            <Card className="p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors h-full rounded-[2rem] shadow-lg group">
              <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Phone size={30} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">SAPA 129</h3>
              <p className="text-gray-600 mb-5">Layanan Kesehatan Mental & Kekerasan Perempuan/Anak</p>
              <a href="tel:129" className="inline-flex items-center justify-center w-full">
                <Button 
                    variant="outline" 
                    className="w-full text-sm border-blue-600 text-blue-600 hover:bg-blue-100 focus:ring-blue-200 flex justify-center items-center" 
                    onClick={(e) => e.stopPropagation()}
                >
                    Hubungi Sekarang: 129
                </Button>
              </a>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-8 text-center bg-red-50 hover:bg-red-100 transition-colors h-full rounded-[2rem] shadow-lg group">
              <div className="w-16 h-16 bg-white text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md animate-pulse">
                <Shield size={30} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Polisi 110</h3>
              <p className="text-gray-600 mb-5">Kepolisian Darurat & Laporan Tindak Kriminal</p>
              <a href="tel:110" className="inline-flex items-center justify-center w-full">
                <Button 
                    variant="red-outline"
                    className="w-full text-sm border-red-600 text-red-600 hover:bg-red-100 focus:ring-red-200 flex justify-center items-center" 
                    onClick={(e) => e.stopPropagation()}
                >
                    Hubungi Sekarang: 110
                </Button>
              </a>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-8 text-center bg-purple-50 hover:bg-purple-100 transition-colors h-full rounded-[2rem] shadow-lg group">
              <div className="w-16 h-16 bg-white text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <MapPin size={30} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">P2TP2A / Rumah Aman</h3>
              <p className="text-gray-600 mb-5">Pusat Perlindungan Perempuan & Anak Terdekat</p>
              
              <Button 
                variant="purple-outline" 
                className="flex items-center justify-center w-full text-sm border-purple-600 text-purple-600 hover:bg-purple-100 focus:ring-purple-200"
                onClick={() => { navigate('/maps'); }}
              >
                Cek Lokasi Terdekat <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </section>


      {/* --- FAQ Section --- */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            
            <Shield className="w-10 h-10 mx-auto mb-4 text-blue-600" /> 

            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Temukan jawaban cepat tentang anonimitas, penggunaan fitur, dan panduan keamanan di SpeakUp.
            </p>
        </motion.div>

        <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
        >
            <FAQItem question="Apakah SpeakUp benar-benar anonim?" answer="Ya! Semua interaksi di platform ini, terutama fitur Menfess dan Chat dengan Satgas, dirancang untuk menjaga anonimitas mutlak penggunanya. Identitasmu aman dan tidak akan dibagikan tanpa izin." icon={Lock} />
            <FAQItem question="Bagaimana cara menghubungi Satgas secara anonim?" answer="Kamu bisa menggunakan fitur Chat Anonim dengan Satgas yang tersedia di dashboard setelah login. Kamu akan terhubung dengan tenaga ahli tanpa perlu mengungkapkan nama atau identitas pribadimu." icon={MessageCircle} />
            <FAQItem question="Apakah ada batasan usia untuk menggunakan SpeakUp?" answer="Platform ini terbuka untuk semua usia yang mencari edukasi dan dukungan. Namun, untuk layanan konsultasi tertentu, bagi yang berusia di bawah 18 tahun, kami menyarankan adanya pendampingan orang dewasa." icon={Users} />
            <FAQItem question="Bagaimana jika saya berada dalam kondisi darurat?" answer="Jika kamu dalam bahaya langsung, segera hubungi Hotline Darurat yang tertera di bagian bawah halaman ini (Polisi 110 atau SAPA 129). Kamu juga bisa menggunakan fitur Peta Lokasi Darurat untuk menemukan bantuan terdekat." icon={Phone} defaultOpen={true} />
            <FAQItem question="Apa itu fitur Menfess Aman?" answer="Menfess Aman adalah fitur untuk berbagi cerita, pengalaman, atau pertanyaan secara anonim kepada komunitas. Fitur ini dimoderasi untuk memastikan lingkungan yang suportif dan bebas dari penghakiman." icon={Heart} />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;