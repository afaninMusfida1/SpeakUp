import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginRegistPage from "../pages/LoginRegistPage";
import Dashboard from "../pages/Dashboard";
import CurrentChat from "../pages/CurrentChat"; 
import ChatList from "../pages/ChatList";      
import MapsPage from "../pages/MapsPage";
import MenfessPage from "../pages/MenfessPage";
import { SituationPage } from "../pages/SituationPage";
import ProfilPage from "../pages/ProfilPage";
import ArticlePage from "../pages/ArticlePage"; 
import ArticleDetail from "../pages/ArticleDetail";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import Game from "../pages/Game";

// 1. Helper untuk cek autentikasi
const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" && token !== "null";
};

// 2. Helper untuk ambil role & data user
const getUserData = () => {
    const role = localStorage.getItem("userRole")?.toLowerCase() || "user";
    
    const userString = localStorage.getItem("user");
    let userId = "default-user";
    
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            userId = userObj.id || userObj.email || "default-user";
        } catch (e) {
            console.error("Gagal parse user data", e);
        }
    }

    return { role, userId };
};

// 3. Private Route Wrapper 
const PrivateRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const ChatEntryPoint = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const { role, userId } = getUserData();

    if (role === "satgas") {
        return <ChatList />;
    } else {
        const sessionID = `session-${userId}`; 
        return <Navigate to={`/chat/${sessionID}`} replace />;
    }
};

export default function AppRoute() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />            
            <Route path="*" element={<LandingPage />} />
            <Route path="/login" element={<LoginRegistPage />} />
            <Route path="/register" element={<LoginRegistPage />} />
            <Route path="/situation" element={<SituationPage />} />            
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
             <Route path="/maps" element={<MapsPage />} /> 

            {/* Protected Routes */}
            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/articles" 
                element={
                    <PrivateRoute>
                        <ArticlePage />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/article/:id" 
                element={
                    <PrivateRoute>
                        <ArticleDetail />
                    </PrivateRoute>
                } 
            />

            <Route path="/chat" element={<ChatEntryPoint />} />
            
            <Route 
                path="/chat/:chatId" 
                element={
                    <PrivateRoute>
                        <CurrentChat />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/menfess" 
                element={
                    <PrivateRoute>
                        <MenfessPage />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/game" 
                element={
                    <PrivateRoute>
                        <Game />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/profile" 
                element={
                    <PrivateRoute>
                        <ProfilPage />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
}