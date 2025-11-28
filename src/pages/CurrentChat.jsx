import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Camera, MapPin, Loader2, Image, FileText } from "lucide-react"; 
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import WebcamCapture from "../components/common/WebcamCapture"; 
import { 
    PlainButton, 
    PlainInput, 
    PlainAvatar, 
    PlainBadge, 
    LocationPreview 
} from "../components/common/UI"; 


const CurrentChat = () => {
    // --- Hooks ---
    const navigate = useNavigate();
    const { chatId } = useParams();
    const location = useLocation();
    const [currentRole] = useState(
        localStorage.getItem("userRole")?.toLowerCase() || "user"
    );
    const isSatgas = currentRole === "satgas";
    const satgasPartnerName = location.state?.partnerName || "Anonim";
    const partnerName = isSatgas ? satgasPartnerName : "Satgas SpeakUp"; 
    const mySenderRole = isSatgas ? "satgas" : "user";
    const [isWebcamActive,  setIsWebcamActive] = useState(false); 
    const [isAttachmentPickerOpen, setIsAttachmentPickerOpen] = useState(false); 
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null); 
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const WELCOME_MESSAGE = 
         `[Sesi: ${chatId}] Halo, ${satgasPartnerName}. Saya di sini untuk membantu. Silakan lanjutkan ceritamu.`
    const initialMessages = [
        {
            id: 1,
            text: WELCOME_MESSAGE, 
            sender: "satgas", 
            timestamp: new Date(Date.now() - 60000),
        },
    ];

    const [messages, setMessages] = useState(initialMessages);
    
    // --- Refs ---
    const messagesEndRef = useRef(null);
    const galleryInputRef = useRef(null); 
    
    const formatTime = (date) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // --- Effects & Handlers ---

    useEffect(() => scrollToBottom(), [messages]);
    
    useEffect(() => {
        if (locationError) { 
             Swal.fire({
                icon: 'error',
                title: 'Gagal Mengambil Lokasi',
                text: locationError,
                confirmButtonText: 'Oke, Paham',
                confirmButtonColor: '#3b82f6', 
                customClass: {
                    popup: 'rounded-2xl font-sans',
                    confirmButton: 'rounded-xl px-6 py-2.5 font-medium'
                }
            });
            setLocationError(null); 
        }
    }, [locationError]);

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

    const handleSendImage = (e) => {
        const file = e?.target?.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);

        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, image: url, sender: mySenderRole, timestamp: new Date() },
        ]);

        e.target.value = "";
        setIsAttachmentPickerOpen(false); 
        scrollToBottom();
    };

    const handleAttachmentClick = () => {
        setIsAttachmentPickerOpen(prev => !prev);
    };
    
    const handleCameraClick = () => {
        setIsAttachmentPickerOpen(false); 
        setIsWebcamActive(true); 
    };

    const handleCaptureWebcam = (imageDataUrl) => {
        setIsWebcamActive(false); 
        
        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, image: imageDataUrl, sender: mySenderRole, timestamp: new Date() },
        ]);
        scrollToBottom();
    };

    const handleGalleryClick = () => {
        setIsAttachmentPickerOpen(false);
        galleryInputRef.current.click();
    };
    
    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Perangkat kamu tidak mendukung fitur lokasi.');
            return;
        }
        
        Swal.fire({
            title: 'Mengambil Lokasi...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setIsLocationLoading(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                Swal.close(); 
                setIsLocationLoading(false);
                const { latitude, longitude } = pos.coords;
                const newMessage = {
                    id: messages.length + 1,
                    location: { lat: latitude, lng: longitude },
                    sender: mySenderRole,
                    timestamp: new Date(),
                };
                
                setMessages((prev) => [...prev, newMessage]);
                scrollToBottom();
            },
            (error) => {
                Swal.close(); 
                setIsLocationLoading(false);
                if (error.code === error.PERMISSION_DENIED) {
                     setLocationError('Izin lokasi ditolak. Aktifkan izin lokasi (GPS) di browser kamu.');
                } else if (error.code === error.TIMEOUT) {
                    setLocationError('Waktu habis saat mencoba mengambil lokasi. Coba lagi.');
                } else {
                    setLocationError('Gagal mengambil lokasi. Pastikan izin lokasi (GPS) di browser sudah aktif.');
                }
                console.error("Geolocation Error:", error);
            },
            { 
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 0 
            }
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* Modal Webcam Capture */}
            {isWebcamActive && (
                <WebcamCapture 
                    onCapture={handleCaptureWebcam} 
                    onClose={() => setIsWebcamActive(false)} 
                />
            )}
            
            {/* Navbar menggunakan partnerName */}
            <Navbar backButton title={partnerName} /> 

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="max-w-3xl mx-auto">
                    {/* ... (Mapping messages) ... */}
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
                                {/* Avatar Lawan Bicara */}
                                {!isMyMessage && (
                                    <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600">
                                        <span className="text-white text-lg">{avatarEmoji}</span>
                                    </PlainAvatar>
                                )}

                                {/* Kontainer Bubble & Nama */}
                                <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                                    {showPartnerName && (
                                        <p className="text-xs text-gray-500 mb-1 ml-4">{partnerName}</p>
                                    )}

                                    {/* Bubble Chat */}
                                    <div
                                        className={`max-w-xs rounded-3xl px-4 py-3 text-sm flex flex-col ${
                                            isMyMessage
                                                ? "bg-blue-600 text-white rounded-tr-xl" 
                                                : "bg-white text-gray-900 border-2 border-gray-100 rounded-tl-xl"
                                            }`}
                                    >
                                        {message.text && <p className="text-left whitespace-pre-wrap">{message.text}</p>}
                                        
                                        {/* Gambar */}
                                        {message.image && (
                                            <img src={message.image} alt="Foto" className="rounded-xl mt-2 max-w-full border" />
                                        )}
                                        
                                        {/* Lokasi */}
                                        {message.location && (
                                            <LocationPreview 
                                                lat={message.location.lat} 
                                                lng={message.location.lng} 
                                                isMyMessage={isMyMessage} 
                                            />
                                        )}

                                        {/* Waktu Kirim */}
                                        <p 
                                            className={`mt-1 text-[10px] self-end ${isMyMessage ? "text-blue-100" : "text-gray-500"}`}
                                        >
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>

                                {/* Avatar Saya */}
                                {isMyMessage && (
                                    <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600">
                                        <span className="text-white text-lg">{avatarEmoji}</span>
                                    </PlainAvatar>
                                )}
                            </div>
                        );
                    })}

                    {/* Indikator Mengetik */}
                    {isTyping && !isSatgas && (
                        <div className="flex items-end gap-2 mb-4 justify-start">
                            <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600">
                                <span className="text-white text-lg">🧑‍⚖️</span>
                            </PlainAvatar>
                            <div className="bg-white border-2 border-gray-100 rounded-3xl rounded-tl-xl px-4 py-3 max-w-xs">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-[bounce_1s_infinite]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: "0.15s" }}></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: "0.3s" }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Indikator Loading Lokasi */}
                    {isLocationLoading && (
                        <div className="flex items-end gap-2 mb-4 justify-end">
                             <div className="bg-blue-600 text-white rounded-3xl rounded-tr-xl px-4 py-3 max-w-xs flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <p className="text-sm">Mengirim lokasi...</p>
                             </div>
                             <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600">
                                <span className="text-white text-lg">👤</span>
                            </PlainAvatar>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Footer Input */}
            <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
                <div className="max-w-3xl mx-auto relative"> 
                    
                    {/* Attachment Picker Pop-up */}
                    {isAttachmentPickerOpen && (
                        <div className="absolute bottom-full left-0 mb-3 p-3 bg-white border border-gray-200 shadow-xl rounded-xl flex gap-2 transition-all duration-300 transform origin-bottom-left z-10">
                            {/* Tombol Ambil Foto (Membuka WebRTC) */}
                            <PlainButton 
                                onClick={handleCameraClick}
                                className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                            >
                                <Camera className="w-6 h-6" />
                                <span className="text-xs mt-1">Foto</span>
                            </PlainButton>
                            {/* Tombol Pilih dari Galeri */}
                            <PlainButton 
                                onClick={handleGalleryClick}
                                className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                            >
                                <Image className="w-6 h-6" />
                                <span className="text-xs mt-1">Galeri</span>
                            </PlainButton>
                        </div>
                    )}
                    
                    <p className="text-gray-500 text-center text-sm mb-1">Tulis pesan atau kirim foto/lokasi...</p>
                    <div className="flex items-center gap-3">
                        
                        <button
                            onClick={handleAttachmentClick}
                            disabled={isLocationLoading || isWebcamActive}
                            className={`p-3 rounded-xl border border-gray-300 active:scale-95 transition-all duration-150 disabled:opacity-50 ${isAttachmentPickerOpen ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'}`}
                        >
                            <Camera className="w-5 h-5 text-gray-700" />
                        </button>
                        
                        {/* Input Gambar - Galeri/File (Tersembunyi) */}
                        <input type="file" accept="image/*" ref={galleryInputRef} className="hidden" onChange={handleSendImage} />
                        
                        <button
                            onClick={handleShareLocation}
                            disabled={isLocationLoading || isAttachmentPickerOpen || isWebcamActive}
                            className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-95 transition-all duration-150 disabled:opacity-50"
                        >
                            <MapPin className="w-5 h-5 text-gray-700" />
                        </button>

                        <PlainInput
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder={`Ketik pesan ke ${partnerName}...`}
                            className="flex-1 rounded-full border-2 h-12 px-4"
                            disabled={isLocationLoading || isAttachmentPickerOpen || isWebcamActive}
                        />

                        <PlainButton
                            onClick={handleSendMessage}
                            disabled={!inputText.trim() || isLocationLoading || isAttachmentPickerOpen || isWebcamActive}
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