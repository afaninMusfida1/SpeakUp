import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

// Data Dummy
const initialChats = [
    { id: "chat-001", username: "Budi", lastMessage: "Terima kasih atas bantuannya...", unreadCount: 2, timestamp: new Date(Date.now() - 3600000) },
    { id: "chat-002", username: "Rina", lastMessage: "Apakah saya bisa menghubungi Anda lagi besok?", unreadCount: 0, timestamp: new Date(Date.now() - 60000) },
    { id: "chat-003", username: "Dian", lastMessage: "Saya ingin cerita lebih detail...", unreadCount: 5, timestamp: new Date(Date.now() - 86400000) },
];

const formatTime = (date) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const ChatList = () => {
    const navigate = useNavigate();
    const [chats] = useState(initialChats);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChats = chats.filter(chat =>
        chat.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectChat = (chatId, username) => {
        navigate(`/chat/${chatId}`, { state: { partnerName: username } });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar/>

            <div className="p-4 bg-white border-b flex items-center space-x-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>

                <div className="flex-1 flex items-center space-x-3 border rounded-full px-4 py-2 bg-gray-100 focus-within:ring-2 focus-within:ring-blue-400">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">Tidak ada sesi chat yang ditemukan.</p>
                )}

                {filteredChats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id, chat.username)}
                        className="flex items-center p-4 hover:bg-gray-100 cursor-pointer transition-colors duration-150 border-b"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <User className="w-6 h-6" />
                            </div>
                            {chat.unreadCount > 0 && (
                                <span className="absolute bottom-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white font-bold">
                                    {chat.unreadCount} 
                                </span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 ml-4">
                            <p className="font-semibold text-gray-900">{chat.username}</p>
                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        </div>

                        <div className="ml-4 text-right flex flex-col items-end justify-center">
                            <p className="text-xs text-gray-400">{formatTime(chat.timestamp)}</p>
                            {/* Indikator 'Baru' juga hanya muncul jika ada pesan belum dibaca */}
                            {chat.unreadCount > 0 && (
                                <div className="text-xs text-red-600 font-medium mt-0.5">Baru</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;