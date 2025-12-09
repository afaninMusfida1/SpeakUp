import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- REUSABLE INPUT COMPONENT ---
const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
            <Icon size={18} />
        </div>
        <input 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium"
            {...props}
        />
    </div>
);

// --- REUSABLE BUTTON COMPONENT ---
const CustomButton = ({ className, loading, children, ...props }) => (
    <button 
        className={`relative w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all duration-300 h-12 px-6 rounded-xl active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-70 disabled:cursor-not-allowed ${className}`} 
        disabled={loading || props.disabled} 
        {...props}
    >
        {loading ? (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
            </div>
        ) : children}
    </button>
);

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
            setIsSent(true);
        } catch (error) {
            const msg = error.response?.data?.message || "Gagal mengirim email. Coba lagi.";
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: msg,
                confirmButtonColor: '#ef4444',
                customClass: { popup: 'rounded-2xl font-sans', confirmButton: 'rounded-xl px-6 py-2' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
            
            {/* === LEFT SIDE: VISUAL === */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="relative z-10 max-w-md text-white text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20">
                        <KeyRound size={48} className="text-white drop-shadow-md" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Lupa Kata Sandi?</h1>
                    <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
                        Jangan panik. Cukup masukkan email terdaftar Anda, dan kami akan membantu mengamankan akun Anda kembali.
                    </p>
                </div>
            </div>

            {/* === RIGHT SIDE: FORM === */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
                
                <button 
                    onClick={() => navigate("/login")} 
                    className="absolute top-6 left-6 lg:top-10 lg:left-10 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors flex items-center gap-2 group z-20"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="w-full max-w-sm space-y-8 my-auto">
                    
                    {!isSent ? (
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Reset Akses</h2>
                                <p className="text-gray-500 text-sm">Masukkan email untuk menerima tautan reset.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <InputField 
                                    icon={Mail} 
                                    type="email" 
                                    placeholder="Masukkan email Anda" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                                <CustomButton type="submit" loading={loading} disabled={!email}>
                                    Kirim Tautan Reset
                                </CustomButton>
                            </form>
                        </>
                    ) : (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-6 shadow-sm ring-8 ring-green-50/50">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Terkirim!</h2>
                            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                                Kami telah mengirimkan instruksi ke <span className="font-bold text-gray-800">{email}</span>. Cek inbox atau spam Anda.
                            </p>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={() => navigate("/login")}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    Kembali ke Login
                                </button>
                                <button 
                                    onClick={() => { setIsSent(false); setLoading(false); }}
                                    className="text-sm text-gray-400 hover:text-blue-600 font-medium transition-colors"
                                >
                                    Kirim ulang email
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}