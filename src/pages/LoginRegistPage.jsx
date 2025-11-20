import React from "react";
import { Shield, Mail, MapPin, Lock, User, ArrowLeft } from "lucide-react";
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
    // Panggil Hooks di sini
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
                        <Shield className="w-16 h-16 text-blue-600 mb-4" />
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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isRegister ? "Daftar ke SpeakUp" : "Masuk ke SpeakUp"}
                        </h2>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded-xl flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">Lokasi:</span> {locationStatus}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl mb-4 text-sm font-medium">
                            {error}
                        </div>
                    )}

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
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 transition-colors" placeholder="Minimal 6 karakter" minLength={6} />
                            </div>
                        </div>

                        {isRegister && (
                            <div className="space-y-2">
                                <label className="text-gray-700 text-sm font-medium">Konfirmasi Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="password" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 transition-colors" placeholder="Ulangi password" minLength={6} />
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
                    
                    <div className="w-full mb-4">
                        {showGoogleFallback ? (
                            <CustomButton variant="outline" onClick={handleManualGoogleSignIn} disabled={loading} className="flex items-center justify-center gap-3">
                                Lanjutkan dengan Google (Manual)
                            </CustomButton>
                        ) : (
                            <div ref={googleButtonRef} className="w-full flex justify-center" />
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