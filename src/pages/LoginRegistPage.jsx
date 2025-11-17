import React, { useState, useEffect } from "react";
import { Shield, Mail, MapPin, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; 


const generateMockToken = (email) => {
    let role = "User"; // Default role
    let name = "SpeakUp User";

    // LOGIKA SIMULASI ROLE
    if (email && email.toLowerCase().includes("satgas")) {
        role = "Satgas";
        name = "Satgas Tim";
    }

    // Payload (decoded): {"userId":"12345","name":"...", "role": "..."}
    const payloadContent = JSON.stringify({
        userId: "12345",
        name: name,
        role: role
    });
    
    const encodedPayload = btoa(payloadContent).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    return `mock_header.${encodedPayload}.mock_signature`;
};

// hrsnya MEMANGGIL ENDPOINT BACKEND 
const loginUser = async (payload) => {
    console.log("MOCK API: loginUser called with:", payload.email);
    const mockToken = generateMockToken(payload.email);
    return new Promise(resolve => setTimeout(() => resolve({
        data: { token: mockToken },
        token: mockToken
    }), 500));
};

const registerUser = async (payload) => {
    console.log("MOCK API: registerUser called with:", payload.email);
    const mockToken = generateMockToken(payload.email);
    return new Promise(resolve => setTimeout(() => resolve({
        data: { token: mockToken },
        token: mockToken
    }), 500));
};

const loginUserWithGoogle = async (payload) => {
    console.log("MOCK API: loginUserWithGoogle called");
    const decoded = jwtDecode(payload.googleCredential);
    const mockToken = generateMockToken(decoded.email); 
    return new Promise(resolve => setTimeout(() => resolve({
        data: { token: mockToken },
        token: mockToken
    }), 500));
};

const registerUserWithGoogle = async (payload) => {
    console.log("MOCK API: registerUserWithGoogle called");
    const decoded = jwtDecode(payload.googleCredential);
    const mockToken = generateMockToken(decoded.email); 
    return new Promise(resolve => setTimeout(() => resolve({
        data: { token: mockToken },
        token: mockToken
    }), 500));
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
        return {};
    }
};

const CustomButton = React.forwardRef(({ className, variant, ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const style =
    props.type === "submit"
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
  const [locationStatus, setLocationStatus] = useState("Fetching location..."); 
  const [locationData, setLocationData] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState(null); 

  useEffect(() => {
    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setLocationData(coords);
          setLocationStatus(`Location Captured: ${coords}`); 
        },
        (err) => {
          console.warn("Lokasi gagal:", err.message);
          setLocationData("N/A");
          setLocationStatus("Location unavailable (Permission denied or error).");
        }
      );
    } else {
      setLocationData("N/A");
      setLocationStatus("Geolocation not supported by this browser.");
    }

    // Google Sign-In (GIS) Initialization
    if (window.google) {
        window.google.accounts.id.initialize({
            client_id: "848372084731-3lqj9eof64595qvdjm176kg47j91b89k.apps.googleusercontent.com", 
            callback: handleGoogleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("googleSignInButton"),
            { 
                theme: "outline", 
                size: "large", 
                type: "standard", 
                shape: "pill", 
                width: "100%",
                text: isRegister ? "signup_with" : "signin_with" 
            } 
        );
    }
  }, [isRegister]);

  const processAuthResponse = (token) => {
    if (token) {
        localStorage.setItem("token", token);
       
        const decodedPayload = jwtDecode(token);
        const userRole = decodedPayload.role || "User"; 
        localStorage.setItem("userRole", userRole); 
        
        console.log(`SUCCESS: Role user diidentifikasi sebagai: ${userRole}. Navigating to /dashboard...`);
        
        onAuthSuccess(); 
        
        setTimeout(() => {
             navigate("/dashboard"); 
        }, 0);

    } else {
        setError("Autentikasi gagal: Tidak ada token yang diterima dari server.");
    }
  };

  /** SUBMIT MANUAL */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (isRegister && password !== retypePassword) {
      setError("Password dan Retype Password tidak sama! Mohon periksa kembali.");
      return;
    }

    try {
      const payload = { name, email, password, address, location: locationData };
      const res = isRegister
        ? await registerUser(payload) 
        : await loginUser(payload); // hrsnya API call ke backend

      const token = res.data?.token || res.token;
      
      processAuthResponse(token); // Memproses token dan menyimpan role

    } catch (err) {
      console.error("Error during authentication:", err);
      setError(`Authentication Error: ${err.message || 'Terjadi kesalahan server saat mencoba autentikasi.'}`);
    }
  };


  /** GOOGLE CREDENTIAL HANDLER */
  const handleGoogleCredentialResponse = async (response) => {
    setError(null);

    const googleCredential = response.credential;
    const decoded = jwtDecode(googleCredential);
    const { email: googleEmail } = decoded; 

    if (!googleEmail) {
        setError("Autentikasi Google gagal: Email tidak ditemukan dalam token.");
        return; 
    }

    try {
        let payload = { googleCredential: googleCredential, email: googleEmail };
        
        if (isRegister) {
            payload = { ...payload, name: name || decoded.name, address: address, location: locationData };
        }

        const res = isRegister
            ? await registerUserWithGoogle(payload) 
            : await loginUserWithGoogle(payload); //hrsnya API call ke backend

        const token = res.data?.token || res.token;

        processAuthResponse(token); // Memproses token dan menyimpan role
        
    } catch (err) {
        console.error("Error Google Auth:", err);
        setError(`Google Auth Error: ${err.message || 'Terjadi kesalahan server saat mencoba Google Auth.'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 font-sans relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center relative">

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
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 font-medium">100% Anonim</p>
                  <p className="text-gray-500 text-sm">Identitas tidak tersimpan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Terenkripsi</p>
                  <p className="text-gray-500 text-sm">Data kamu aman</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Tanpa Judgement</p>
                  <p className="text-gray-500 text-sm">Ruang aman untuk semua</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isRegister ? "Daftar ke SpeakUp" : "Masuk ke SpeakUp"}
            </h2>
            <p className="text-gray-600">
              {isRegister
                ? "Buat akun anonim baru dan mulai SpeakUp."
                : "Kamu nggak sendiri. Kami di sini untuk mendengarkan."}
            </p>
          </div>
          
          <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded-xl flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="font-medium">Lokasi:</span> 
              {locationStatus}
          </div>

          {/* PESAN ERROR */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl mb-4 text-sm font-medium">
              Gagal: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <>
                {/* Nama */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium">Nama</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 h-12"
                      placeholder="Nama"
                    />
                  </div>
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium">Alamat</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 h-12"
                      placeholder="Alamat"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 h-12"
                  placeholder="contoh@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 h-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Retype password */}
            {isRegister && (
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-medium">Retype Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:border-blue-500 h-12"
                    placeholder="Ulangi password"
                  />
                </div>
              </div>
            )}

            <CustomButton type="submit">
              {isRegister ? "Daftar" : "Masuk"}
            </CustomButton>

            {/* GOOGLE LOGIN */}
            <div 
              id="googleSignInButton" 
              className="w-full flex justify-center" 
            >
            </div>

            {/* SWITCH LOGIN / REGISTER */}
            <div className="text-center text-sm text-gray-600">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button
                type="button"
                onClick={() =>
                  navigate(isRegister ? "/login" : "/register")
                }
                className="text-blue-600 hover:underline font-medium"
              >
                {isRegister ? "Masuk di sini" : "Daftar di sini"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}