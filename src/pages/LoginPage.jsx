import React, { useState } from 'react';
import { Shield, Mail, MapPin, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomButton = React.forwardRef(({ className, variant, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
    
    let styleClasses = "";

    if (props.type === 'submit') {
        styleClasses = "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl h-12 text-white shadow-lg shadow-blue-500/50";
    } else if (variant === 'outline') {
        styleClasses = "w-full rounded-2xl h-12 border-2 border-gray-200 hover:bg-gray-50 text-gray-700";
    } else {
        styleClasses = "bg-gray-200 hover:bg-gray-300 rounded-md";
    }

    return (
        <button
            ref={ref}
            className={`${baseClasses} ${styleClasses} ${className}`}
            {...props}
        />
    );
});

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
const navigate = useNavigate();

 const handleSubmit = (e) => {
    navigate('/dashboard');
  };


  const handleGoogleLogin = () => {
     navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 font-sans">
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
              SpeakUp tidak menyimpan identitas aslimu. Semua percakapan dan menfess bersifat anonim.
            </p>
            
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 font-medium">100% Anonim</p>
                  <p className="text-gray-500 text-sm">Identitas tidak tersimpan</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Terenkripsi</p>
                  <p className="text-gray-500 text-sm">Data kamu aman</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
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

        <div className="p-8 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Masuk ke SpeakUp
            </h2>
            <p className="text-gray-600">
              Kamu nggak sendiri. Kami di sini untuk mendengarkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-gray-700 text-sm font-medium">
                Nama
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="Anonim #123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 h-12 transition duration-200"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1 ml-1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit, laudantium!
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-gray-700 text-sm font-medium">
                Alamat
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="Anonim #123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 h-12 transition duration-200"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1 ml-1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque, similique.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-gray-700 text-sm font-medium">
                Lokasi
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="location"
                  type="text"
                  placeholder="Jakarta, Indonesia"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 h-12 transition duration-200"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1 ml-1">
                Membantu kami menyarankan bantuan terdekat
              </p>
            </div>

            <CustomButton 
              type="submit"
              className="w-full"
            >
              Masuk Anonim
            </CustomButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-sm">atau</span>
              </div>
            </div>

            <CustomButton
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC04"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Masuk dengan Google
            </CustomButton>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-blue-800 text-center text-sm font-medium">
              💙 Privasimu terjaga. SpeakUp tidak menyimpan identitasmu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", location: "" });

  const handleLogin = (username, location) => {
    setUserInfo({ username, location });
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Dashboard userInfo={userInfo} onLogout={() => setIsLoggedIn(false)} />;
  }

  return <LoginPage onLogin={handleLogin} />;
}