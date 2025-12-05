import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --- REUSABLE COMPONENTS ---
const CustomButton = ({ className, loading, children, ...props }) => (
    <button 
        className={`relative w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all duration-300 h-12 px-6 rounded-xl active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-70 disabled:cursor-not-allowed ${className}`} 
        disabled={loading} 
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

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Link Tidak Valid',
                text: 'Token reset password hilang atau rusak.',
                confirmButtonText: 'Kembali ke Login',
                customClass: { popup: 'rounded-2xl font-sans', confirmButton: 'rounded-xl px-6 py-2' }
            }).then(() => navigate('/login'));
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            Swal.fire({ icon: 'warning', text: 'Password tidak cocok.', customClass: { popup: 'rounded-2xl font-sans' }});
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                token, newPassword: password, repeatPassword
            });
            Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Password berhasil diperbarui.',
                confirmButtonText: 'Login Sekarang',
                allowOutsideClick: false,
                customClass: { popup: 'rounded-2xl font-sans', confirmButton: 'rounded-xl px-6 py-2' }
            }).then(() => navigate("/login"));
        } catch (error) {
            const msg = error.response?.data?.message || "Gagal mereset password.";
            Swal.fire({ icon: 'error', title: 'Gagal', text: msg, customClass: { popup: 'rounded-2xl font-sans' }});
        } finally {
            setLoading(false);
        }
    };

    if (!token) return null;

    return (
        <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
            
            {/* === LEFT SIDE: VISUAL === */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-800"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="relative z-10 max-w-md text-white text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20">
                        <Lock size={48} className="text-white drop-shadow-md" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Password Baru</h1>
                    <p className="text-blue-100 text-lg leading-relaxed opacity-90">
                        Buat password yang kuat dan unik untuk melindungi akun Anda dari akses yang tidak diinginkan.
                    </p>
                </div>
            </div>

            {/* === RIGHT SIDE: FORM === */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
                <div className="w-full max-w-sm space-y-8 my-auto">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Atur Ulang</h2>
                        <p className="text-gray-500 text-sm">Masukkan kata sandi baru di bawah ini.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"><Lock size={18} /></div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} onChange={(e) => setPassword(e.target.value)} required 
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium"
                                placeholder="Kata Sandi Baru" minLength={6}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"><CheckCircle2 size={18} /></div>
                            <input 
                                type={showRepeatPassword ? "text" : "password"} 
                                value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required 
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium"
                                placeholder="Ulangi Kata Sandi" minLength={6}
                            />
                            <button type="button" onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <CustomButton type="submit" loading={loading} className="mt-4">
                            Simpan Password Baru
                        </CustomButton>
                    </form>
                </div>
            </div>
        </div>
    );
}