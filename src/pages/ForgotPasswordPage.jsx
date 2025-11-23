import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CustomButton = ({ className, disabled, children, ...props }) => (
    <button 
        disabled={disabled}
        className={`w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-12 rounded-2xl text-white shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`} 
        {...props}
    >
        {children}
    </button>
);

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false); 

    useEffect(() => {
        if (!window.Swal) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });

            setIsSent(true);
            
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'success',
                    title: 'Email Terkirim!',
                    text: 'Silakan cek kotak masuk (atau spam) email Anda untuk instruksi reset password.',
                    confirmButtonColor: '#9333ea',
                    customClass: { popup: 'rounded-3xl font-sans', confirmButton: 'rounded-xl' }
                });
            } else {
                alert("Email Terkirim! Silakan cek kotak masuk Anda.");
            }

        } catch (error) {
            console.error("Forgot Password Error:", error);
            const msg = error.response?.data?.message || "Gagal mengirim email. Pastikan email terdaftar atau coba lagi nanti.";
            
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: msg,
                    confirmButtonColor: '#ef4444',
                    customClass: { popup: 'rounded-3xl font-sans', confirmButton: 'rounded-xl' }
                });
            } else {
                alert(`Gagal: ${msg}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 font-sans relative">
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative">
                <button 
                    onClick={() => navigate("/login")} 
                    className="absolute -top-12 left-0 text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={18} /> Kembali ke Login
                </button>

                <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl">
                    
                    {/* Tampilan 1: Form Input Email */}
                    {!isSent ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-sm">
                                    <KeyRound size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Jangan khawatir. Masukkan email yang terdaftar akunmu, kami akan mengirimkan link untuk mereset password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-gray-700 text-sm font-medium">Email Terdaftar</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required 
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" 
                                            placeholder="nama@email.com" 
                                        />
                                    </div>
                                </div>

                                <CustomButton type="submit" disabled={loading || !email}>
                                    {loading ? "Mengirim Link..." : "Kirim Link Reset"}
                                </CustomButton>
                            </form>
                        </>
                    ) : (
                        // Tampilan 2: Sukses Terkirim
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mb-6 shadow-sm ring-4 ring-green-50/50">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cek Email Kamu</h2>
                            <p className="text-gray-500 text-sm mb-2">
                                Kami telah mengirimkan instruksi reset password ke:
                            </p>
                            <p className="text-gray-900 font-medium bg-gray-50 py-2 px-4 rounded-lg inline-block mb-6 border border-gray-100">
                                {email}
                            </p>
                            
                            <div className="space-y-3">
                                <p className="text-xs text-gray-400">
                                    Tidak menerima email? Cek folder spam atau <button onClick={handleSubmit} disabled={loading} className="text-blue-600 hover:underline font-medium">kirim ulang</button>
                                </p>
                                
                                <div className="pt-4 border-t border-gray-100">
                                    <button 
                                        onClick={() => navigate("/login")}
                                        className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                                    >
                                        Kembali ke Halaman Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}