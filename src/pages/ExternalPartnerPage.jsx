import React from "react";
import { ExternalLink, Globe, HeartHandshake, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";

// --- MOCK DATA PARTNER ---
const partners = [
    {
        id: 1,
        name: "GenRe Indonesia",
        desc: "Pusat Informasi dan Konseling Remaja. Fokus pada kesehatan reproduksi dan penyiapan kehidupan berkeluarga.",
        type: "Pemerintah / BKKBN",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: HeartHandshake,
        link: "https://genreindonesia.com" // Contoh link
    },
    {
        id: 2,
        name: "Komnas Perempuan",
        desc: "Lembaga negara independen untuk penegakan hak asasi manusia perempuan Indonesia.",
        type: "Lembaga Negara",
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        icon: ShieldCheck,
        link: "https://komnasperempuan.go.id"
    },
    {
        id: 3,
        name: "LBH APIK",
        desc: "Lembaga Bantuan Hukum yang berfokus pada pembelaan perempuan dan anak korban kekerasan.",
        type: "NGO / Bantuan Hukum",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: Globe,
        link: "https://lbhapik.org"
    },
    {
        id: 4,
        name: "CARI Layanan (KemenPPPA)",
        desc: "Direktori layanan perlindungan perempuan dan anak dari Kementerian PPPA.",
        type: "Direktori Layanan",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: ExternalLink,
        link: "https://carilayanan.kemenpppa.go.id"
    }
];

export default function ExternalPartnersPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar backButton title="Jejaring Eksternal" />

            <main className="max-w-5xl mx-auto px-4 py-8">
                
                <div className="text-center mb-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Mitra & Organisasi</h1>
                    <p className="text-gray-500 leading-relaxed">
                        Kami terhubung dengan berbagai lembaga nasional dan komunitas untuk memastikan kamu mendapatkan dukungan yang tepat dan valid.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partners.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col h-full">
                            
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center`}>
                                    <item.icon size={28} />
                                </div>
                                <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-wide text-gray-500 border border-gray-100">
                                    {item.type}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {item.name}
                            </h3>
                            
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                                {item.desc}
                            </p>

                            <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                Kunjungi Website
                                <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}