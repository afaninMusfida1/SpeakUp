import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthService = {
    request: async (endpoint, method, data, token = null) => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await axios({
                method: method,
                url: `${API_BASE_URL}${endpoint}`,
                data: data,
                headers: headers
            });
            return response.data; 
        } catch (error) {
            if (error.response) {
                const responseData = error.response.data;
                const message = 
                    responseData?.message || 
                    responseData?.payload?.message || 
                    responseData?.error || 
                    (typeof responseData === 'string' ? responseData : null) || 
                    `Gagal (${error.response.status}): ${error.response.statusText}`;
                throw new Error(message);
            } else if (error.request) {
                throw new Error("Tidak dapat terhubung ke server. Cek koneksi internetmu.");
            } else {
                throw new Error(error.message);
            }
        }
    },

    loginUser: async (payload) => {
        return await AuthService.request('/auth/login', 'POST', {
            email: payload.email,
            password: payload.password,
            latitude: payload.latitude,
            longitude: payload.longitude
        });
    },

    registerUser: async (payload) => {
        return await AuthService.request('/auth/register', 'POST', {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            address: payload.address,
            latitude: payload.latitude,
            longitude: payload.longitude
        });
    },

    loginUserWithGoogle: async (payload) => {
        return await AuthService.request('/auth/google-login', 'POST', {
            email: payload.email,
            name: payload.name,
            latitude: payload.latitude,
            longitude: payload.longitude
        });
    },

    registerUserWithGoogle: async (payload) => {
        return await AuthService.request('/auth/google-register', 'POST', {
            name: payload.name,
            email: payload.email,
            latitude: payload.latitude,
            longitude: payload.longitude
        });
    }
};

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

const useLoginRegister = (onAuthSuccess) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isRegister = pathname === "/register";
    
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    
    const [locationStatus, setLocationStatus] = useState("Menunggu izin lokasi...");
    const [rawLocation, setRawLocation] = useState(null); 
    
    // --- FIX: Gunakan Ref agar nilai selalu update di dalam Callback Google ---
    const locationRef = useRef(null); 

    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [showGoogleFallback, setShowGoogleFallback] = useState(false);
    
    const debounceRef = useRef(false);
    const googleButtonRef = useRef(null);
    const googleInitialized = useRef(false);
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Sinkronisasi State ke Ref setiap kali rawLocation berubah
    useEffect(() => {
        locationRef.current = rawLocation;
    }, [rawLocation]);

    // --- GOOGLE SCRIPT ---
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

    // --- 2. GEOLOCATION ---
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus("Browser tidak support GPS");
            return;
        }

        const toastLoading = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        toastLoading.fire({
            icon: 'info',
            title: 'Meminta Izin Lokasi...',
            text: 'Mohon klik "Allow" atau "Izinkan" pada popup browser.'
        });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setRawLocation({ lat: latitude, long: longitude });
                // Ref juga diupdate otomatis via useEffect di atas
                
                const coordsString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                setLocationStatus(coordsString);

                Swal.fire({
                    icon: 'success',
                    title: 'Lokasi Diterima!',
                    html: `Koordinat berhasil didapatkan:<br/><b>${coordsString}</b>`,
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            },
            (err) => {
                setRawLocation(null);
                let errorMsg = "Gagal deteksi lokasi.";
                if (err.code === 1) { 
                    errorMsg = "Izin Lokasi Ditolak!";
                    setLocationStatus("Izin Ditolak (Cek Browser)");
                    Swal.fire({
                        icon: 'warning',
                        title: 'Akses Lokasi Ditolak',
                        text: 'Aplikasi tidak dapat mendeteksi posisi Anda. Mohon klik ikon gembok/pengaturan di browser dan izinkan akses lokasi.',
                        confirmButtonText: 'Saya Mengerti',
                        confirmButtonColor: '#d33'
                    });
                } else if (err.code === 2) { 
                    errorMsg = "Sinyal GPS Lemah";
                    setLocationStatus("GPS tidak tersedia");
                } else if (err.code === 3) { 
                    errorMsg = "Waktu Habis (Timeout)";
                    setLocationStatus("Gagal (Timeout)");
                }
                console.warn("GPS Error:", err);
            },
            { timeout: 10000, enableHighAccuracy: false }
        );
    }, []);

    // --- HANDLER GOOGLE (UPDATED) ---
    const handleGoogleCredentialResponse = async (response) => {
        setError(null);
        if (!response?.credential) {
            setError("Google Auth gagal.");
            return;
        }

        setLoading(true);
        try {
            const googleCredential = response.credential;
            const decoded = jwtDecode(googleCredential);
            const googleEmail = decoded.email;
            const googleName = decoded.name || "";

            if (!googleEmail) throw new Error("Email tidak ditemukan dari Google.");

            // --- PENTING: BACA DARI REF (locationRef.current), BUKAN STATE ---
            // Ini menjamin kita mengambil nilai TERBARU, bukan nilai saat tombol dirender.
            const currentLoc = locationRef.current;
            console.log("📍 Google Login Location:", currentLoc); // Debugging

            let payload = { 
                email: googleEmail,
                name: googleName,
                latitude: currentLoc?.lat,
                longitude: currentLoc?.long
            };

            let res;
            if (isRegister) {
                const finalName = name.trim() || googleName;
                payload.name = finalName;
                res = await AuthService.registerUserWithGoogle(payload);
            } else {
                res = await AuthService.loginUserWithGoogle(payload);
            }
            
            processAuthResponse(res);

        } catch (err) {
            console.error("Error Google Auth:", err);
            setError(err.message || 'Gagal login dengan Google.');
            setLoading(false);
        }
    };

    // --- GOOGLE UI INIT ---
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
            }
            googleInitialized.current = true;
        } catch (err) {
            setShowGoogleFallback(true);
        }
    }, [googleLoaded, isRegister, GOOGLE_CLIENT_ID]);

    // --- AUTH RESPONSE ---
    const processAuthResponse = (response) => {
        const token = response?.payload?.datas?.token || 
                      response?.data?.token || 
                      response?.token;

        if (!token) {
            if (isRegister && (response?.status === 200 || response?.status === 201 || response?.message === "User created successfully")) {
                Swal.fire('Sukses', 'Registrasi berhasil! Silakan login.', 'success');
                navigate("/login");
                setLoading(false);
                return;
            }
            setError("Login sukses, namun token tidak ditemukan.");
            setLoading(false);
            return;
        }

        try {
            localStorage.setItem("token", token);
            const userData = response?.payload?.datas;
            if (userData) {
                localStorage.setItem("userRole", userData.role || "user");
                localStorage.setItem("userXp", userData.userXp || 0);
            } 
            if (onAuthSuccess) onAuthSuccess();
            setTimeout(() => { navigate("/dashboard"); }, 100);
        } catch (err) {
            setError("Gagal memproses data sesi login.");
        } finally {
            setLoading(false);
        }
    };

    // --- MANUAL SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (debounceRef.current || loading) return;

        debounceRef.current = true;
        setTimeout(() => (debounceRef.current = false), 800);
        setLoading(true);

        try {
            if (isRegister) {
                if (!name.trim() || !email.trim() || !password || !retypePassword) throw new Error("Semua kolom wajib diisi.");
                if (password !== retypePassword) throw new Error("Konfirmasi password tidak cocok!");
                if (password.length < 6) throw new Error("Password minimal 6 karakter.");
            } else {
                if (!email.trim() || !password) throw new Error("Email dan Password wajib diisi.");
            }

            // Untuk manual submit, kita bisa pakai state (rawLocation) atau ref, sama saja
            // Tapi konsisten pakai ref lebih aman
            const currentLoc = locationRef.current; 

            const payload = { 
                name: name.trim(), 
                email: email.trim(), 
                password, 
                address: address.trim(),
                latitude: currentLoc?.lat,
                longitude: currentLoc?.long
            };
            
            const res = isRegister
                ? await AuthService.registerUser(payload)
                : await AuthService.loginUser(payload);

            processAuthResponse(res);

        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.message || 'Terjadi kesalahan sistem.');
            setLoading(false);
        }
    };

    const handleManualGoogleSignIn = () => {
        setError("Fitur ini belum tersedia. Gunakan login email/password.");
    };

    useEffect(() => {
        setName(""); setAddress(""); setEmail(""); setPassword(""); setRetypePassword("");
        setError(null); setLoading(false);
    }, [isRegister]);

    return {
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
    };
};

export default useLoginRegister;