import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Tambahkan useParams & useLocation
import { ArrowLeft, Send, Camera, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";

const PlainButton = ({ onClick, children, className = "", variant, disabled, ...props }) => {
    let baseClasses =
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    if (variant === "ghost") baseClasses = "hover:bg-gray-100 hover:text-accent-foreground";

    return (
        <button onClick={onClick} className={`${baseClasses} ${className}`} disabled={disabled} {...props}>
            {children}
        </button>
    );
};

const PlainInput = ({ value, onChange, onKeyPress, placeholder, className = "", ...props }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${className}`}
        {...props}
    />
);

const PlainAvatar = ({ children, className = "" }) => (
    <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>
        {children}
    </div>
);

const PlainBadge = ({ children, className = "" }) => (
    <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}>
        {children}
    </div>
);


const CurrentChat = () => { 
    const navigate = useNavigate();
    const { chatId } = useParams(); 
    const location = useLocation(); 

    const storedUsername = localStorage.getItem("username") || "Pengguna";

    const [currentRole] = useState(
        localStorage.getItem("userRole")?.toLowerCase() || "user"
    );
    const isSatgas = currentRole === "satgas";

    const satgasPartnerName = location.state?.partnerName || "Pengguna Tidak Dikenal";
    const partnerName = isSatgas ? satgasPartnerName : "Satgas SpeakUp";
    const mySenderRole = isSatgas ? "satgas" : "user";
    
    const initialMessages = [
        {
            id: 1,
            text: isSatgas
                ? `[Sesi: ${chatId}] Halo, ${satgasPartnerName}. Saya di sini untuk membantu. Silakan lanjutkan ceritamu.`
                : "Halo, saya dari tim Satgas SpeakUp. Saya di sini untuk mendengarkan dan membantu. Kamu aman di sini, dan semua percakapan kita bersifat rahasia. Mau cerita apa yang sedang kamu alami?",
            sender: "satgas", // Pesan pembuka selalu dari satgas
            timestamp: new Date(Date.now() - 60000),
        },
    ];

    //hrsnya fetch riwayat pesan berdasarkan chatId di sini
    const [messages, setMessages] = useState(initialMessages); 
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => scrollToBottom(), [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: inputText,
            sender: mySenderRole, 
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText("");
        
        // SIMULASI balasan HANYA jika pengguna saat ini adalah USER
        if (!isSatgas) {
            setIsTyping(true);

            setTimeout(() => {
                const responses = [
                    "Terima kasih sudah berbagi. Saya mendengarkan dengan penuh perhatian.",
                    "Saya memahami perasaanmu. Apa yang kamu rasakan saat ini?",
                    "Kamu sangat berani untuk bercerita. Kita cari solusi bersama, ya.",
                    "Tidak apa-apa merasa seperti itu. Kamu tidak sendiri.",
                    "Apakah kamu dalam kondisi aman saat ini?",
                ];

                const satgasMessage = {
                    id: messages.length + 2,
                    text: responses[Math.floor(Math.random() * responses.length)],
                    sender: "satgas",
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, satgasMessage]);
                setIsTyping(false);
            }, 2000);
        }
    };

    const handleSendImage = (file) => {
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        const newMessage = { id: messages.length + 1, image: imageUrl, sender: mySenderRole, timestamp: new Date() };
        setMessages([...messages, newMessage]);
        scrollToBottom();
    };
 
    const handleShareLocation = () => {
        if (!navigator.geolocation) return alert("Perangkat kamu tidak mendukung lokasi.");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newMessage = {
                    id: messages.length + 1,
                    location: { lat: latitude, lng: longitude },
                    sender: mySenderRole,
                    timestamp: new Date(),
                };
                setMessages([...messages, newMessage]);
                scrollToBottom();
            },
            () => alert("Gagal mengambil lokasi. Pastikan izin lokasi aktif.")
        );
    };

    const formatTime = (date) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar backButton title={partnerName} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-center my-6">
                        <PlainBadge className="bg-gray-200 text-gray-600 px-4 py-1">Hari ini</PlainBadge>
                    </div>

                    {messages.map((message) => {
                        const isMyMessage = message.sender === mySenderRole;
                        const avatarEmoji = message.sender === "satgas" ? '🧑‍⚖️' : '👤';
                        const showPartnerName = isSatgas && !isMyMessage; 

                        return (
                            <div
                                key={message.id}
                                className={`flex items-end gap-2 mb-4 ${
                                    isMyMessage ? "justify-end" : "justify-start"
                                }`}
                            >
                                {!isMyMessage && (
                                    <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600">
                                        <span className="text-white text-lg">{avatarEmoji}</span>
                                    </PlainAvatar>
                                )}

                                <div>
                                    {showPartnerName && (
                                        <p className="text-xs text-gray-500 mb-1 ml-4">{partnerName}</p>
                                    )}

                                    <div
                                        className={`max-w-[70%] rounded-3xl px-4 py-3 text-sm ${
                                            isMyMessage
                                                ? "bg-blue-600 text-white rounded-br-md" 
                                                : "bg-white text-gray-900 border-2 border-gray-100 rounded-bl-md"
                                        }`}
                                    >
                                        {message.text && <p>{message.text}</p>}
                                        {message.image && (
                                            <img src={message.image} alt="Foto" className="rounded-xl mt-2 max-w-[200px] border" />
                                        )}
                                        {message.location && (
                                            <a
                                                href={`http://maps.google.com/?q=$${message.location.lat},${message.location.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`underline mt-2 block ${isMyMessage ? 'text-blue-100' : 'text-blue-600'}`}
                                            >
                                                📍 Lihat lokasi di Google Maps
                                            </a>
                                        )}
                                        <p className={`mt-1 text-xs ${isMyMessage ? "text-blue-100" : "text-gray-500"}`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>

                                {isMyMessage && (
                                    <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600">
                                        <span className="text-white text-lg">{avatarEmoji}</span>
                                    </PlainAvatar>
                                )}
                            </div>
                        );
                    })}

                    {isTyping && !isSatgas && (
                        <div className="flex items-end gap-2 mb-4">
                            <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600">
                                <span className="text-white text-lg">🧑‍⚖️</span>
                            </PlainAvatar>
                            <div className="bg-white border-2 border-gray-100 rounded-3xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto">
                    <p className="text-gray-500 text-center text-sm mb-1">Tulis pesan atau kirim foto/lokasi...</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-95 transition-all duration-150"
                        >
                            <Camera className="w-5 h-5 text-gray-700" />
                        </button>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleSendImage(e.target.files[0])} />

                        <button
                            onClick={handleShareLocation}
                            className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-95 transition-all duration-150"
                        >
                            <MapPin className="w-5 h-5 text-gray-700" />
                        </button>

                        <PlainInput
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder={`Ketik pesan ke ${partnerName}...`}
                            className="flex-1 rounded-full border-2 h-12 px-4"
                        />

                        <PlainButton
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0"
                        >
                            <Send className="w-5 h-5" />
                        </PlainButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentChat; 