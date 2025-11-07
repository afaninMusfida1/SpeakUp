import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import MapsPage from './pages/MapsPage';
import MenfessPage from './pages/MenfessPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/menfess" element={<MenfessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
