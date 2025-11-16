import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginRegistPage from "../pages/LoginRegistPage";
import Dashboard from "../pages/Dashboard";
import ChatPage from "../pages/ChatPage";
import MapsPage from "../pages/MapsPage";
import MenfessPage from "../pages/MenfessPage";
import { SituationPage } from "../pages/SituationPage";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginRegistPage />} />
      <Route path="/register" element={<LoginRegistPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/maps" element={<MapsPage />} />
      <Route path="/menfess" element={<MenfessPage />} />
      <Route path="/situation" element={<SituationPage/>} />

    </Routes>
  );
}
