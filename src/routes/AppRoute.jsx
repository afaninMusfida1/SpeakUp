import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginRegistPage from "../pages/LoginRegistPage";
import Dashboard from "../pages/Dashboard";
import CurrentChat from "../pages/CurrentChat"; 
import ChatList from "../pages/ChatList";      
import MapsPage from "../pages/MapsPage";
import MenfessPage from "../pages/MenfessPage";
import { SituationPage } from "../pages/SituationPage";
import ProfilePage from "../pages/ProfilPage";

// Helper function untuk mendapatkan role
const getUserRole = () => {
    return localStorage.getItem("userRole")?.toLowerCase() || "user";
};

// Komponen helper untuk mengarahkan rute chat
const ChatRouteHandler = ({ isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    const role = getUserRole();
    
    if (role === 'satgas') {
        // Jika Satgas, tampilkan daftar chat
        return <ChatList />;
    } else {
        // Jika Pengguna, arahkan ke sesi chat default (misal, dengan ID 'new-session')
        return <CurrentChat />;
    }
};

export default function AppRoute() {
    const isAuthenticated = !!localStorage.getItem("token"); // misal token disimpan di localStorage
    const role = getUserRole(); // Ambil role di sini

    // Tentukan chat ID default untuk Pengguna (misal, menggunakan username atau ID unik sesi)
    const defaultUserChatId = localStorage.getItem("username") ? `session-${localStorage.getItem("username")}` : "session-user-default";

    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginRegistPage />} />
            <Route path="/register" element={<LoginRegistPage />} />
            <Route path="/situation" element={<SituationPage />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />

            <Route
                path="/chat"
                element={isAuthenticated ? 
                    (role === 'satgas' ? <ChatList /> : <Navigate to={`/chat/${defaultUserChatId}`} replace />) 
                    : <Navigate to="/login" />}
            />
            
            <Route
                path="/chat/:chatId"
                element={isAuthenticated ? <CurrentChat /> : <Navigate to="/login" />}
            />

            <Route
                path="/maps"
                element={isAuthenticated ? <MapsPage /> : <Navigate to="/login" />}
            />
            <Route
                path="/menfess"
                element={isAuthenticated ? <MenfessPage /> : <Navigate to="/login" />}
            />
            <Route
                path="/profile"
                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
            />
        </Routes>
    );
}