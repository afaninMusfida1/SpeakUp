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
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CurrentChat = () => {
    // --- Hooks ---
    const navigate = useNavigate();
    const location = useLocation();
    const [currentRole] = useState(
        localStorage.getItem("userRole")?.toLowerCase() || "user"
    );
    const token = localStorage.getItem('token');
    const isSatgas = currentRole === "satgas";
    const partnerName = isSatgas ? (location.state?.partnerName || "User") : "Satgas SpeakUp"; 
    const mySenderRole = isSatgas ? "satgas" : "user";
    const [isWebcamActive, setIsWebcamActive] = useState(false); 
    const [isAttachmentPickerOpen, setIsAttachmentPickerOpen] = useState(false); 
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null); 
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Hardcoded values
    const chatId = 1;
    const receiverId = 3;

    const [messages, setMessages] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    
    // --- Refs ---
    const messagesEndRef = useRef(null);
    const galleryInputRef = useRef(null); 
    
    const formatTime = (date) => {
        if (!date) return '';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        
        return dateObj.toLocaleTimeString("id-ID", { 
            hour: "2-digit", 
            minute: "2-digit" 
        });
    };
    
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // --- Effects & Handlers ---

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    // Load REAL chat history - FIXED STRUCTURE
    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                console.log("🔄 Loading chat history...");
                setIsLoadingHistory(true);
                
                const response = await axios.get(
                    `${API_BASE_URL}/message/history/${chatId}?page=1&limit=50`, 
                    { 
                        headers: { 
                            'Authorization': 'Bearer ' + token
                        } 
                    }
                );
                
                console.log("✅ History response:", response.data);
                
                if (response.status === 200) {
                    // FIX: Structure sesuai BE - response.data.payload.datas.messages
                    const messagesData = response.data.payload?.datas?.messages || [];
                    
                    console.log("🎯 Messages data:", messagesData);
                    
                    if (messagesData.length > 0) {
                        setMessages(messagesData);
                        console.log("🚀 Messages loaded:", messagesData.length);
                    } else {
                        // Jika tidak ada history, tampilkan welcome message
                        const welcomeMessage = {
                            id: 1,
                            text: `Halo! Saya di sini untuk membantu. Silakan ceritakan masalah Anda.`,
                            sender: "satgas", 
                            timestamp: new Date(),
                        };
                        setMessages([welcomeMessage]);
                    }
                    
                    scrollToBottom();
                }
            } catch (error) {
                console.error("❌ Gagal load history:", error);
                
                // Fallback dengan sample data
                const sampleMessages = [
                    {
                        id: 1,
                        text: "Halo, ada yang bisa saya bantu?",
                        sender: "satgas",
                        timestamp: new Date(Date.now() - 3600000),
                    },
                    {
                        id: 2, 
                        text: "test",
                        sender: "user",
                        timestamp: new Date(Date.now() - 1800000),
                    }
                ];
                setMessages(sampleMessages);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        if (chatId && token) {
            loadChatHistory();
        } else {
            setIsLoadingHistory(false);
        }
    }, [chatId, token]);

    const handleSendMessage = async (options = {}) => {
        const { imageFile = null, skipText = false } = options;
        
        if (!inputText.trim() && !imageFile) return;

        // 1. Optimistic Update
        const tempId = Date.now();
        const newMessage = {
            id: tempId,
            text: inputText.trim() || "",
            sender: mySenderRole,
            timestamp: new Date(),
            _isSending: true
        };

        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            newMessage.image = url;
            newMessage._file = imageFile;
        }

        setMessages(prev => [...prev, newMessage]);
        if (!skipText) setInputText("");
        setIsAttachmentPickerOpen(false);
        scrollToBottom();

        // 2. Kirim ke BE
        try {
            const formData = new FormData();
            formData.append('receiverId', receiverId);
            formData.append('messageType', "urgent");
            
            if (inputText.trim() && !skipText) {
                formData.append('message', inputText);
            }

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.post(`${API_BASE_URL}/message`, formData, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // 3. Update dengan data real dari BE
            if(response.status === 201){
                setMessages(prev => prev.map(msg => 
                    msg.id === tempId 
                        ? { ...msg, _isSending: false }
                        : msg
                ));
            }
            
        } catch (error) {
            console.error("❌ Gagal mengirim pesan:", error);
            
            // 4. Mark as failed
            setMessages(prev => prev.map(msg => 
                msg.id === tempId 
                    ? { ...msg, _isFailed: true, _isSending: false }
                    : msg
            ));
        }
    };

    const handleSendImage = (e) => {
        const file = e?.target?.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'File tidak didukung',
                text: 'Hanya file gambar yang diizinkan',
                confirmButtonText: 'Oke'
            });
            return;
        }

        handleSendMessage({ 
            imageFile: file, 
            skipText: true 
        });

        e.target.value = "";
    };

    const handleCaptureWebcam = async (imageDataUrl) => {
        setIsWebcamActive(false); 
        
        try {
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });

            await handleSendMessage({ 
                imageFile: file, 
                skipText: true 
            });
            
        } catch (error) {
            console.error("❌ Gagal mengirim foto dari webcam:", error);
            
            // Fallback UI update
            setMessages((prev) => [
                ...prev,
                { 
                    id: Date.now(), 
                    image: imageDataUrl, 
                    sender: mySenderRole, 
                    timestamp: new Date(),
                    _isFailed: true 
                },
            ]);
            scrollToBottom();
        }
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
                
                // Create location message
                const locationMessage = {
                    id: Date.now(),
                    location: { lat: latitude, lng: longitude },
                    sender: mySenderRole,
                    timestamp: new Date(),
                };
                
                setMessages((prev) => [...prev, locationMessage]);
                scrollToBottom();
            },
            (error) => {
                Swal.close(); 
                setIsLocationLoading(false);
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationError('Izin lokasi ditolak. Aktifkan izin lokasi di browser.');
                } else if (error.code === error.TIMEOUT) {
                    setLocationError('Waktu habis. Coba lagi.');
                } else {
                    setLocationError('Gagal mengambil lokasi.');
                }
            },
            { 
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 0 
            }
        );
    };

    const handleAttachmentClick = () => {
        setIsAttachmentPickerOpen(prev => !prev);
    };
    
    const handleCameraClick = () => {
        setIsAttachmentPickerOpen(false); 
        setIsWebcamActive(true); 
    };

    const handleGalleryClick = () => {
        setIsAttachmentPickerOpen(false);
        galleryInputRef.current.click();
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
            
            {/* Navbar */}
            <Navbar backButton title={partnerName} /> 

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Loading indicator */}
                    {isLoadingHistory && (
                        <div className="flex justify-center mb-4">
                            <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <span className="text-sm text-gray-600">Memuat percakapan...</span>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
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
                                            className={`mt-1 text-[10px] self-end ${
                                                isMyMessage ? "text-blue-100" : "text-gray-500"
                                            }`}
                                        >
                                            {formatTime(message.timestamp)}
                                        </p>

                                        {/* Sending Indicator */}
                                        {message._isSending && (
                                            <div className="flex justify-end mt-1">
                                                <Loader2 className="w-3 h-3 animate-spin text-blue-200" />
                                            </div>
                                        )}
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

                    {/* Location Loading Indicator */}
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

            {/* Input Footer */}
            <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
                <div className="max-w-3xl mx-auto relative"> 
                    
                    {/* Attachment Picker */}
                    {isAttachmentPickerOpen && (
                        <div className="absolute bottom-full left-0 mb-3 p-3 bg-white border border-gray-200 shadow-xl rounded-xl flex gap-2 transition-all duration-300 transform origin-bottom-left z-10">
                            <PlainButton 
                                onClick={handleCameraClick}
                                className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                            >
                                <Camera className="w-6 h-6" />
                                <span className="text-xs mt-1">Kamera</span>
                            </PlainButton>
                            <PlainButton 
                                onClick={handleGalleryClick}
                                className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                            >
                                <Image className="w-6 h-6" />
                                <span className="text-xs mt-1">Galeri</span>
                            </PlainButton>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                        
                        <button
                            onClick={handleAttachmentClick}
                            disabled={isLocationLoading || isWebcamActive}
                            className={`p-3 rounded-xl border border-gray-300 active:scale-95 transition-all duration-150 disabled:opacity-50 ${
                                isAttachmentPickerOpen ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'
                            }`}
                        >
                            <Camera className="w-5 h-5 text-gray-700" />
                        </button>
                        
                        {/* Hidden file input */}
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={galleryInputRef} 
                            className="hidden" 
                            onChange={handleSendImage} 
                        />
                        
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
                            placeholder={`Ketik pesan...`}
                            className="flex-1 rounded-full border-2 h-12 px-4"
                            disabled={isLocationLoading || isAttachmentPickerOpen || isWebcamActive}
                        />

                        <PlainButton
                            onClick={() => handleSendMessage()}
                            disabled={!inputText.trim() || isLocationLoading || isAttachmentPickerOpen || isWebcamActive}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
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