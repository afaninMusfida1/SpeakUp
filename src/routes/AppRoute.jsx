import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
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
import ResetPasswordPage from "../pages/ResetPasswordPage";
import EventsPage from "../pages/EventPage";
import ExternalPartnersPage from "../pages/ExternalPartnerPage";

// 1. Helper untuk cek autentikasi
const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" && token !== "null";
};

// 2. Helper untuk ambil role & data user
const getUserData = () => {
    const role = localStorage.getItem("userRole")?.toLowerCase() || "user";
    // userId tidak wajib diambil di sini jika logic redirect diganti
    return { role };
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

    const { role } = getUserData();

    if (role === "satgas") {
        return <ChatList />;
    } 
    return <ChatList />;
};

export default function AppRoute() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />            
            <Route path="*" element={<LandingPage />} />
            <Route path="/login" element={<LoginRegistPage />} />
            <Route path="/register" element={<LoginRegistPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/situation" element={<SituationPage />} />            
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/maps" element={<MapsPage />} /> 
            <Route path="/events" element={<EventsPage />} />
            <Route path="/partners" element={<ExternalPartnersPage />} />

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

            {/* Route Entry Point */}
            <Route path="/chat" element={<ChatEntryPoint />} />
            
            {/* Route Chat Detail */}
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