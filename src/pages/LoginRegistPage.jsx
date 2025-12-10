import React, { useState, useEffect } from "react";
import { MapPin, Lock, User, ArrowLeft, Eye, EyeOff, Mail, ShieldCheck, Heart } from "lucide-react";
import Swal from "sweetalert2"; 
import useLoginRegister from "../hooks/useLoginRegister";

// --- CUSTOM BUTTON COMPONENT (Compact Version) ---
const CustomButton = React.forwardRef(({ className, variant, loading, children, ...props }, ref) => {
    const base = "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 h-10 px-6 rounded-xl active:scale-[0.98]"; // Ubah h-12 jadi h-10
    
    let style = "";
    if (props.type === "submit") {
        style = "w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 border border-transparent";
    } else if (variant === "outline") {
        style = "w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm";
    } else {
        style = "bg-gray-100 hover:bg-gray-200 text-gray-900";
    }

    return (
        <button ref={ref} className={`${base} ${style} ${className}`} disabled={loading || props.disabled} {...props}>
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                </div>
            ) : children}
        </button>
    );
});

// --- INPUT FIELD COMPONENT (Compact Version) ---
const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
            <Icon size={18} /> {/* Icon size 18 biar pas sama input kecil */}
        </div>
        <input 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium" // padding py-2.5
            {...props}
        />
    </div>
);

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

    // --- SWEETALERT HANDLER ---
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                confirmButtonText: 'Tutup',
                confirmButtonColor: '#2563eb',
                customClass: {
                    popup: 'rounded-2xl font-sans',
                    confirmButton: 'rounded-xl px-6 py-2',
                }
            });
        }
    }, [error]);

    return (
        <div className="min-h-screen h-screen flex w-full bg-white font-sans overflow-hidden">
            
            {/* === LEFT SIDE: BRANDING & VISUAL === */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-700 overflow-hidden items-center justify-center p-12">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-800"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Content Wrapper */}
                <div className="relative z-10 max-w-lg text-white">
                    <div className="mb-8 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <img src="https://res.cloudinary.com/dj2gwflqs/image/upload/v1764211938/Group_1_gryebt.png" alt="Logo" className="w-8 h-8 object-contain brightness-0 invert" />
                            </div>
                            <span className="text-xl font-bold tracking-wide text-white/90">GUGAH</span>
                        </div>
                        
                        {/* TEKS BARU: Lebih ke arah pencegahan/edukasi */}
                        <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
                            Satukan Langkah, <br/> 
                            <span className="text-blue-200">Cegah Kekerasan.</span>
                        </h1>
                        <p className="text-blue-100 text-base leading-relaxed opacity-90">
                            Akses edukasi, layanan dan dukungan pemulihan dalam satu genggaman. Identitasmu adalah prioritas kami.
                        </p>
                    </div>

                    {/* Features Card (Compact) */}
                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-100">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                            <ShieldCheck className="text-green-400 w-6 h-6 mb-2" />
                            <h3 className="font-bold text-sm">Privasi Terjaga</h3>
                            <p className="text-xs text-blue-200 mt-1">Terenkripsi & anonim.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                            <Heart className="text-pink-400 w-6 h-6 mb-2" />
                            <h3 className="font-bold text-sm">Pendampingan</h3>
                            <p className="text-xs text-blue-200 mt-1">Konseling & Satgas siap bantu.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* === RIGHT SIDE: FORM (COMPACT) === */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 relative bg-white h-full overflow-y-auto">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate("/")} 
                    className="absolute top-4 left-4 lg:top-8 lg:left-8 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-20"
                    title="Kembali ke Beranda"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="w-full max-w-sm space-y-5 my-auto"> {/* Ubah max-w-md jadi max-w-sm biar lebih ramping */}
                    
                    {/* Header Text */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {isRegister ? "Daftar Akun Baru" : "Selamat Datang"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {isRegister 
                                ? "Mulai langkah amanmu bersama Gugah." 
                                : "Masuk untuk melanjutkan."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5"> {/* Jarak antar input dirapatkan */}
                        
                        {isRegister && (
                            <>
                                <InputField 
                                    icon={User} 
                                    type="text" 
                                    placeholder="Nama Lengkap" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                                <InputField 
                                    icon={MapPin} 
                                    type="text" 
                                    placeholder="Alamat (Opsional)" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                />
                            </>
                        )}

                        <InputField 
                            icon={Mail} 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />

                        {/* Password Field */}
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium"
                                placeholder="Kata Sandi"
                                minLength={6}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {isRegister && (
                             <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showRetypePassword ? "text" : "password"} 
                                    value={retypePassword} 
                                    onChange={(e) => setRetypePassword(e.target.value)} 
                                    required 
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium"
                                    placeholder="Ulangi Kata Sandi"
                                    minLength={6}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                >
                                    {showRetypePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        )}

                        {/* Forgot Password Link */}
                        {!isRegister && (
                            <div className="flex justify-end -mt-1">
                                <button 
                                    type="button" 
                                    onClick={() => navigate("/forgot-password")} 
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Lupa Kata Sandi?
                                </button>
                            </div>
                        )}

                        <CustomButton type="submit" loading={loading} className="mt-2">
                            {isRegister ? "Daftar Sekarang" : "Masuk"}
                        </CustomButton>
                    </form>

                    {/* Divider Compact */}
                    <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-white px-2 text-gray-400 font-semibold tracking-wider">
                                Atau
                            </span>
                        </div>
                    </div>

                    {/* Google Button Compact */}
                    <div className="min-h-[40px]">
                        {showGoogleFallback ? (
                            <CustomButton variant="outline" onClick={handleManualGoogleSignIn} disabled={loading} className="gap-2 font-semibold text-gray-700 h-10">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </CustomButton>
                        ) : (
                            <div ref={googleButtonRef} className="w-full flex justify-center [&>iframe]:!w-full [&>div]:!w-full overflow-hidden rounded-xl scale-90 origin-center" />
                        )}
                    </div>

                    {/* Footer Switch */}
                    <div className="text-center text-sm text-gray-600">
                        {isRegister ? "Sudah ada akun?" : "Belum punya akun?"}{" "}
                        <button 
                            type="button" 
                            onClick={() => navigate(isRegister ? "/login" : "/register")} 
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                        >
                            {isRegister ? "Masuk" : "Daftar"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}