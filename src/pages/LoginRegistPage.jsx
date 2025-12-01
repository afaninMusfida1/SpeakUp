import React, { useState, useEffect } from "react";
import { Shield, Mail, MapPin, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2"; 
import useLoginRegister from "../hooks/useLoginRegister";

const CustomButton = React.forwardRef(({ className, variant, ...props }, ref) => {
    const base = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
    const style = props.type === "submit"
        ? "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl h-12 text-white shadow-md"
        : variant === "outline"
        ? "w-full rounded-2xl h-12 border border-gray-200 hover:bg-gray-50 text-gray-700"
        : "bg-gray-200 hover:bg-gray-300 rounded-md";
    return <button ref={ref} className={`${base} ${style} ${className}`} {...props} />;
});

export default function LoginRegisterPage({ onAuthSuccess = () => {} }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);

    const {
        name, setName,
        email, setEmail,
        password, setPassword,
        retypePassword, setRetypePassword,
        address, setAddress,
        locationStatus,
        error,
        loading,
        showGoogleFallback,
        isRegister,
        googleButtonRef,
        handleSubmit,
        handleManualGoogleSignIn,
        navigate
    } = useLoginRegister(onAuthSuccess);

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error,
                confirmButtonText: 'Coba Lagi',
                confirmButtonColor: '#ef4444', 
                customClass: {
                    popup: 'rounded-3xl font-sans',
                    confirmButton: 'rounded-xl px-6 py-2.5',
                }
            });
        }
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 font-sans relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center relative">
                {/* LEFT INFO */}
                <div className="hidden md:block space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-gray-100 shadow-xl">
                        <img src="https://res.cloudinary.com/dj2gwflqs/image/upload/v1764211938/Group_1_gryebt.png" alt="Logo Gugah" className="w-10 h-10 object-contain drop-shadow-sm" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Privasimu Terjaga 
                        </h2>
                        <p className="text-gray-600 mb-6">
                            SpeakUp tidak menyimpan identitas aslimu. Semua percakapan anonim.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">✓</div>
                                <div><p className="text-gray-700 font-medium">100% Anonim</p><p className="text-gray-500 text-sm">Identitas tidak tersimpan</p></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">✓</div>
                                <div><p className="text-gray-700 font-medium">Terenkripsi</p><p className="text-gray-500 text-sm">Data kamu aman</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORM */}
                <div className="p-8 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl relative">
                    <button onClick={() => navigate("/")} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                        <ArrowLeft size={16} /> Kembali
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16  rounded-2xl mb-4 ">
                            <img src="https://res.cloudinary.com/dj2gwflqs/image/upload/v1764211938/Group_1_gryebt.png" alt="Logo Gugah" className="w-10 h-10 object-contain drop-shadow-sm" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isRegister ? "Daftar ke SpeakUp" : "Masuk ke SpeakUp"}
                        </h2>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded-xl flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">Lokasi:</span> {locationStatus}
                    </div>

                    {/* Kita hapus div error merah disini karena sudah digantikan oleh SweetAlert di useEffect */}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-gray-700 text-sm font-medium">Nama Lengkap *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 transition-colors" placeholder="Masukkan nama lengkap" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-700 text-sm font-medium">Alamat</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 transition-colors" placeholder="Alamat (opsional)" />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-gray-700 text-sm font-medium">Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 transition-colors" placeholder="contoh@email.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700 text-sm font-medium">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    className="w-full pl-10 pr-12 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 transition-colors" 
                                    placeholder="Minimal 6 karakter" 
                                    minLength={6} 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link (Only visible on Login) */}
                        {!isRegister && (
                            <div className="flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => navigate("/forgot-password")} 
                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                                >
                                    Lupa Password?
                                </button>
                            </div>
                        )}

                        {isRegister && (
                            <div className="space-y-2">
                                <label className="text-gray-700 text-sm font-medium">Konfirmasi Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type={showRetypePassword ? "text" : "password"}
                                        value={retypePassword} 
                                        onChange={(e) => setRetypePassword(e.target.value)} 
                                        required 
                                        className="w-full pl-10 pr-12 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 transition-colors" 
                                        placeholder="Ulangi password" 
                                        minLength={6} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowRetypePassword(!showRetypePassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showRetypePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <CustomButton type="submit" disabled={loading} className={`transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {loading ? "Sedang memproses..." : isRegister ? "Daftar" : "Masuk"}
                        </CustomButton>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">ATAU</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    
                    {/* Google Button Area */}
                    <div className="w-full mb-4 min-h-[48px]">
                        {showGoogleFallback ? (
                            <CustomButton variant="outline" onClick={handleManualGoogleSignIn} disabled={loading} className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Lanjutkan dengan Google
                            </CustomButton>
                        ) : (
                            <div ref={googleButtonRef} className="w-full flex justify-center [&>iframe]:!w-full [&>div]:!w-full" />
                        )}
                    </div>

                    <div className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-100">
                        {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
                        <button type="button" onClick={() => navigate(isRegister ? "/login" : "/register")} className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                            {isRegister ? "Masuk di sini" : "Daftar di sini"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}