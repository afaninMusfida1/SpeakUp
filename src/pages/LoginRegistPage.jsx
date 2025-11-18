import React, { useState, useEffect, useRef } from "react";
import { Shield, Mail, MapPin, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// ====================================================================
// KONFIGURASI API & SERVICE (SUDAH DIPERBAIKI - REAL API)
// ====================================================================

// Ganti URL ini sesuai dengan alamat Back-End kamu
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthService = {
    // Helper untuk melakukan request
    request: async (endpoint, method, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Parsing response
            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || result.error || `Terjadi kesalahan (${response.status})`);
            }

            return result;
        } catch (error) {
            throw error;
        }
    },

    loginUser: async (payload) => {
        // Asumsi endpoint login adalah /auth/login
        return await AuthService.request('/auth/login', 'POST', {
            email: payload.email,
            password: payload.password
        });
    },

    registerUser: async (payload) => {
        // Sesuai cURL: name, email, password, address
        return await AuthService.request('/auth/register', 'POST', {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            address: payload.address
            // location: payload.location (Opsional: kirim jika BE sudah support)
        });
    },

    loginUserWithGoogle: async (payload) => {
        // Asumsi endpoint login google
        return await AuthService.request('/auth/google-login', 'POST', {
            email: payload.email,
            name: payload.name
        });
    },

    registerUserWithGoogle: async (payload) => {
        // Sesuai cURL: name, email
        return await AuthService.request('/auth/google-register', 'POST', {
            name: payload.name,
            email: payload.email
        });
    }
};

// Decoder JWT untuk Front-End (Hanya untuk membaca data user di sisi klien)
const jwtDecode = (token) => {
    try {
        const parts = token.split('.');
        const payloadPart = parts.length === 3 ? parts[1] : parts.length > 1 ? parts[1] : '';
        if (!payloadPart) throw new Error('Invalid JWT format');

        const base64Url = payloadPart;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return { email: '', name: '' };
    }
};

// ====================================================================
// KOMPONEN UI
// ====================================================================

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
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isRegister = pathname === "/register";

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [locationStatus, setLocationStatus] = useState("Mendapatkan lokasi...");
    const [locationData, setLocationData] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [showGoogleFallback, setShowGoogleFallback] = useState(false);

    const debounceRef = useRef(false);
    const googleButtonRef = useRef(null);
    const googleInitialized = useRef(false);

    // Client ID
    const GOOGLE_CLIENT_ID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || "848372084731-3lqj9eof64595qvdjm176kg47j91b89k.apps.googleusercontent.com";

    // 1. Load Google Script
    useEffect(() => {
        if (window.google) {
            setGoogleLoaded(true);
            return;
        }
        const existingScript = document.querySelector('script[src*="accounts.google.com"]');
        if (existingScript) {
            existingScript.onload = () => setGoogleLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleLoaded(true);
        script.onerror = () => setShowGoogleFallback(true);
        document.head.appendChild(script);

        const timeoutId = setTimeout(() => {
            if (!window.google) setShowGoogleFallback(true);
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, []);

    // 2. Geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                    setLocationData(coords);
                    setLocationStatus(`Lokasi berhasil didapatkan`);
                },
                (err) => {
                    setLocationData("N/A");
                    setLocationStatus("Gagal mendapatkan lokasi");
                },
                { timeout: 10000, enableHighAccuracy: false }
            );
        } else {
            setLocationData("N/A");
            setLocationStatus("Geolocation tidak didukung");
        }
    }, []);

    // 3. Initialize Google Sign-In
    useEffect(() => {
        if (!googleLoaded || !window.google || googleInitialized.current) return;

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                ux_mode: "popup"
            });

            if (googleButtonRef.current) {
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: "outline", size: "large", type: "standard", shape: "rectangular", text: isRegister ? "signup_with" : "signin_with", width: "100%" }
                );
                if (!isRegister) {
                    window.google.accounts.id.prompt((notification) => {});
                }
            }
            googleInitialized.current = true;
        } catch (err) {
            console.error("Google Init Error:", err);
            setShowGoogleFallback(true);
        }
    }, [googleLoaded, isRegister, GOOGLE_CLIENT_ID]);

    // 4. Process Auth Response
    const processAuthResponse = (response) => {
        // WARNING: Pastikan Back-End mengembalikan token dalam JSON body, misal: { token: "..." }
        // Jika response kosong (seperti contoh curl), kita tidak bisa auto-login.
        const token = response?.payload?.datas?.token || 
                      response?.data?.token || 
                      response?.token;

        if (!token) {
            if (isRegister && !token) {
                alert("Registrasi berhasil! Silakan login.");
                navigate("/login");
            } else {
                setError("Login sukses, tapi format token tidak dikenali frontend.");
            }
            setLoading(false);
            return;
        }

        try {
            // 1. Simpan Token
            localStorage.setItem("token", token);

            // 2. Simpan Data User (Opsional tapi berguna)
            // Karena backend mengirim data user lengkap, kita simpan juga
            const userData = response?.payload?.datas?.user;
            if (userData) {
                localStorage.setItem("user", JSON.stringify(userData));
                // Ambil role langsung dari data user
                localStorage.setItem("userRole", userData.role || "user");
            } else {
                // Fallback: Decode token jika data user tidak ada di response
                const decodedPayload = jwtDecode(token);
                localStorage.setItem("userRole", decodedPayload.role || "user");
            }

            // 3. Beritahu Parent Component & Redirect
            onAuthSuccess();
            
            setTimeout(() => {
                navigate("/dashboard");
            }, 100);
            
        } catch (err) {
            console.error("Error processing token:", err);
            setError("Gagal memproses sesi login.");
        } finally {
            setLoading(false);
        }
    };

    // 5. Handle Manual Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (debounceRef.current || loading) return;
        debounceRef.current = true;
        setTimeout(() => (debounceRef.current = false), 800);
        setLoading(true);

        try {
            // Validasi
            if (isRegister) {
                if (!name.trim() || !email.trim() || !password || !retypePassword) throw new Error("Semua kolom wajib diisi.");
                if (password !== retypePassword) throw new Error("Password tidak sama!");
                if (password.length < 6) throw new Error("Password minimal 6 karakter.");
            } else {
                if (!email.trim() || !password) throw new Error("Email dan Password wajib diisi.");
            }

            const payload = { 
                name: name.trim(), 
                email: email.trim(), 
                password, 
                address: address.trim(), 
                location: locationData 
            };
            
            const res = isRegister
                ? await AuthService.registerUser(payload)
                : await AuthService.loginUser(payload);

            processAuthResponse(res);

        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.message || 'Terjadi kesalahan server.');
            setLoading(false);
        }
    };

    // 6. Handle Google Credential Response
    const handleGoogleCredentialResponse = async (response) => {
        setError(null);
        
        if (!response?.credential) {
            setError("Google Auth gagal.");
            return;
        }

        setLoading(true);
        try {
            const googleCredential = response.credential;
            const decoded = jwtDecode(googleCredential); // Decode token Google
            const googleEmail = decoded.email;
            const googleName = decoded.name || "";

            if (!googleEmail) throw new Error("Email tidak ditemukan dari Google.");

            let payload = { 
                email: googleEmail,
                name: googleName
            };

            if (isRegister) {
                // Override nama jika user input manual (opsional)
                const finalName = name.trim() || googleName;
                payload.name = finalName;

                const res = await AuthService.registerUserWithGoogle(payload);
                processAuthResponse(res);
            } else {
                const res = await AuthService.loginUserWithGoogle(payload);
                processAuthResponse(res);
            }

        } catch (err) {
            console.error("Error Google Auth:", err);
            setError(err.message || 'Gagal login dengan Google.');
            setLoading(false);
        }
    };

    const handleManualGoogleSignIn = () => {
        setError("Fitur ini belum tersedia. Gunakan login email/password.");
    };

    // Reset form saat pindah halaman
    useEffect(() => {
        setName(""); setAddress(""); setEmail(""); setPassword(""); setRetypePassword("");
        setError(null); setLoading(false);
    }, [isRegister]);

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