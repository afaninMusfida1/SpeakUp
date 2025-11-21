import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const AuthService = {
    request: async (endpoint, method, data) => {
        try {
            const response = await axios({
                method: method,
                url: `${API_BASE_URL}${endpoint}`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data; 
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.message || error.response.data?.error || `Terjadi kesalahan (${error.response.status})`;
                throw new Error(message);
            } else if (error.request) {
                throw new Error("Tidak dapat terhubung ke server.");
            } else {
                throw new Error(error.message);
            }
        }
    },

    loginUser: async (payload) => {
        return await AuthService.request('/auth/login', 'POST', {
            email: payload.email,
            password: payload.password
        });
    },

    registerUser: async (payload) => {
        return await AuthService.request('/auth/register', 'POST', {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            address: payload.address,
            // location: payload.location 
        });
    },

    loginUserWithGoogle: async (payload) => {
        return await AuthService.request('/auth/google-login', 'POST', {
            email: payload.email,
            name: payload.name
        });
    },

    registerUserWithGoogle: async (payload) => {
        return await AuthService.request('/auth/google-register', 'POST', {
            name: payload.name,
            email: payload.email
        });
    }
};

// Decoder JWT Helper
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
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

    // 3. Handle Google Credential Response
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

            let payload = { 
                email: googleEmail,
                name: googleName
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

    // 4. Initialize Google Sign-In UI
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

    // 5. Process Auth Response (Common Logic)
    const processAuthResponse = (response) => {
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
            localStorage.setItem("token", token);
            const userData = response?.payload?.datas?.user;
            if (userData) {
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("userRole", userData.role || "user");
            } else {
                const decodedPayload = jwtDecode(token);
                localStorage.setItem("userRole", decodedPayload.role || "user");
            }

            if (onAuthSuccess) onAuthSuccess();
            
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

    // 6. Handle Manual Submit
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

    const handleManualGoogleSignIn = () => {
        setError("Fitur ini belum tersedia. Gunakan login email/password.");
    };

    // Reset form on route change
    useEffect(() => {
        setName(""); setAddress(""); setEmail(""); setPassword(""); setRetypePassword("");
        setError(null); setLoading(false);
    }, [isRegister]);

    return {
        // States
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