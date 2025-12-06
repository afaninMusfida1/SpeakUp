import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Camera,
  MapPin,
  Loader2,
  Image as ImageIcon,
  FileText,
  Check,       // --- NEW: Icon Centang 1
  CheckCheck,  // --- NEW: Icon Centang 2
  ChevronDown  // --- NEW: Icon Panah Bawah
} from "lucide-react";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import WebcamCapture from "../components/common/WebcamCapture";
import {
  PlainButton,
  PlainInput,
  PlainAvatar,
  LocationPreview,
} from "../components/common/UI";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CurrentChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId: chatIdParam } = useParams();

  // ---------- AUTH / USER ----------
  const getLocalUserId = () => {
    const directId = localStorage.getItem("userId") || localStorage.getItem("id");
    if (directId) return directId;
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      return userObj.id || null;
    } catch (e) {
      return null;
    }
  };

  const localUserId = getLocalUserId();
  const token = localStorage.getItem("token") || "";
  
  const partnerName = location.state?.partnerName || "Chat";
  const partnerId = location.state?.partnerId || null;

  // ---------- UI STATE ----------
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isAttachmentPickerOpen, setIsAttachmentPickerOpen] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // --- NEW: State untuk Scroll & Unread Count
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadNewMessages, setUnreadNewMessages] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const messagesEndRef = useRef(null);
  const galleryInputRef = useRef(null);
  const chatContainerRef = useRef(null); // --- NEW: Ref untuk container scroll

  // ---------- HELPER ----------
  const handleSessionExpired = () => {
    if (Swal.isVisible()) return;
    Swal.fire({
      icon: "error",
      title: "Sesi Habis",
      text: "Token anda kadaluarsa, silakan login kembali.",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      localStorage.clear();
      navigate("/login", { replace: true });
    });
  };

  const scrollToBottom = (smooth = true) => {
    // --- NEW: Logic scroll hanya jika user mau atau dipaksa
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
      setUnreadNewMessages(0); // Reset counter kalau udah di bawah
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  // ---------------- NORMALIZE MESSAGE ----------------
  const normalizeMessage = (raw) => {
    const msg = { ...(raw || {}) };
    msg.id = msg.id ?? msg._id ?? `msg-${Date.now()}-${Math.random()}`;
    msg.senderId = msg.senderId ?? msg.sender_id ?? msg.senderID ?? msg.userId ?? null;
    msg.text = msg.text ?? msg.message ?? msg.content?.message ?? null;
    msg.image = msg.image ?? msg.imageUrl ?? msg.content?.image ?? null;
    
    // --- NEW: Handle Status Read
    // Pastikan backend mengirim field 'isRead' atau 'read_at'
    msg.isRead = msg.isRead ?? (msg.read_at ? true : false) ?? false;

    const lat = msg.latitude ?? msg.lat ?? msg.content?.latitude ?? null;
    const lng = msg.longitude ?? msg.lng ?? msg.content?.longitude ?? null;
    if (lat && lng) {
      msg.location = { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
    msg.timestamp = msg.timestamp ?? msg.createdAt ?? new Date();
    msg.timestamp = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
    return msg;
  };

  const isMessageFromMe = (msg) => {
    if (!msg) return false;
    if (msg._forceMine || msg._isSending) return true;
    if (localUserId && msg.senderId) {
      return String(msg.senderId) === String(localUserId);
    }
    return false; 
  };

  // ---------------- NEW: MARK AS READ API ----------------
  const markMessagesAsRead = async (messageList = messages) => {
  if (!token || !messageList.length) return;

  // ✅ HANYA pesan lawan + belum dibaca
  const unreadMessages = messageList.filter(
    (msg) => !isMessageFromMe(msg) && !msg.isRead
  );

  if (unreadMessages.length === 0) return;

  for (const msg of unreadMessages) {
    try {
      await axios.put(
        `${API_BASE_URL}/api/v1/message/read/${msg.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ update state biar UI langsung berubah
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, isRead: true } : m
        )
      );
    } catch (err) {
      console.error("Gagal mark read msgId:", msg.id, err);
    }
  }
};


  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if ((chatIdParam === "new" || !chatIdParam) && !partnerId) {
      navigate("/chat");
    }
  }, [chatIdParam, partnerId]);

  // --- NEW: Scroll Handler Logic
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Deteksi jika user sudah dekat bagian bawah (toleransi 100px)
    const isBottom = scrollHeight - scrollTop - clientHeight < 150;
    
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom);

    // Jika user scroll mentok bawah, reset unread count & tandai dibaca
    if (isBottom) {
        setUnreadNewMessages(0);
        markMessagesAsRead(messages);
        }
  };

  // Auto scroll saat pertama load atau user kirim pesan sendiri
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      // Jika pesan terakhir dari saya, paksa scroll ke bawah
      if (isMessageFromMe(lastMsg)) {
        scrollToBottom();
      } 
    }
  }, [messages]);


  // ---------------- LOAD HISTORY (POLLING) ----------------
  useEffect(() => {
    let isMounted = true;
    const chatId = chatIdParam === "new" ? null : chatIdParam;

    const loadChatHistory = async () => {
      if (!token || !chatId) {
        if (isMounted) setIsLoadingHistory(false);
        return;
      }

      try {
        if (isMounted && messages.length === 0) setIsLoadingHistory(true);

        const res = await axios.get(
          `${API_BASE_URL}/message/history/${chatId}?page=1&limit=100`,
          { headers: { Authorization: "Bearer " + token } }
        );

        const rawMessages =
          res?.data?.payload?.messages ?? 
          res?.data?.payload?.datas?.messages ??
          res?.data?.payload ??
          [];

        const normalized = (Array.isArray(rawMessages) ? rawMessages : []).map(normalizeMessage);

        if (isMounted) {
          setMessages(prev => {
            // --- NEW: Logic Unread Count & Scroll Prevention
            // Jika ada pesan baru (jumlah bertambah) DAN user TIDAK di posisi bawah
            if (prev.length > 0 && normalized.length > prev.length && !isAtBottom) {
              const diff = normalized.length - prev.length;
              setUnreadNewMessages(p => p + diff);
            }
            
            // --- NEW: Jika user di posisi bawah, langsung update & mark read
            if (isAtBottom && normalized.length > prev.length) {
               markMessagesAsRead();
            }

            return normalized; 
          });
          setIsLoadingHistory(false);
        }
      } catch (err) {
        if (isMounted) {
          if (err?.response?.status === 401) handleSessionExpired();
          setIsLoadingHistory(false);
        }
      }
    };

    loadChatHistory();
    // Mark read saat pertama kali buka chat
    markMessagesAsRead();

    const polling = setInterval(loadChatHistory, 3000); 
    return () => {
      isMounted = false;
      clearInterval(polling);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIdParam, token, isAtBottom]); // Tambahkan isAtBottom ke dependency

  // ---------------- SEND MESSAGE ----------------
  const handleSendMessage = async ({ imageFile = null, skipText = false, lat = null, lng = null } = {}) => {
    if (!token) return handleSessionExpired();
    if ((!inputText || !inputText.trim()) && !imageFile && !(lat && lng)) return;

    const tempId = "temp-" + Date.now();
    const optimistic = {
      id: tempId,
      text: !skipText && inputText ? inputText.trim() : null,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
      location: lat && lng ? { lat, lng } : null,
      senderId: localUserId, 
      timestamp: new Date(),
      _isSending: true,
      _forceMine: true, 
      isRead: false, // Default unread
    };

    setMessages((p) => [...p, normalizeMessage(optimistic)]);
    if (!skipText) setInputText("");
    setIsAttachmentPickerOpen(false);
    
    // Force scroll ke bawah karena kita yang kirim
    setTimeout(() => scrollToBottom(), 100);

    try {
      const fd = new FormData();
      if (chatIdParam && chatIdParam !== 'new') fd.append("chatId", chatIdParam);
      if (partnerId) fd.append("receiverId", partnerId);
      fd.append("messageType", "not-urgent"); 
      
      if (!skipText && optimistic.text) fd.append("message", optimistic.text);
      if (imageFile) fd.append("image", imageFile);
      if (lat && lng) {
        fd.append("latitude", lat);
        fd.append("longitude", lng);
      }

      const res = await axios.post(`${API_BASE_URL}/message`, fd, {
        headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
      });

      if (res?.status === 200 || res?.status === 201) {
        const payload = res.data?.payload;
        const serverMsg = payload?.datas ?? payload ?? res.data?.data;

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === tempId) {
              if (serverMsg) {
                const normalizedServer = normalizeMessage(serverMsg);
                normalizedServer._forceMine = true; 
                return normalizedServer;
              }
              return { ...m, _isSending: false };
            }
            return m;
          })
        );
        
        if (chatIdParam === 'new') {
          const newChatId = serverMsg?.chatId || serverMsg?.chat_id || payload?.chatId;
          if (newChatId) {
            navigate(`/chat/${newChatId}`, { replace: true, state: location.state }); 
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) return handleSessionExpired();
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, _isSending: false, _isFailed: true } : m)));
    }
  };

  const handleSendImage = (e) => {
    const file = e?.target?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleSendMessage({ imageFile: file, skipText: true });
    }
    e.target.value = "";
  };

  const handleCaptureWebcam = async (dataUrl) => {
    setIsWebcamActive(false);
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `cam-${Date.now()}.jpg`, { type: "image/jpeg" });
    handleSendMessage({ imageFile: file, skipText: true });
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocationLoading(false);
        handleSendMessage({ lat: pos.coords.latitude, lng: pos.coords.longitude, skipText: true });
      },
      () => {
        setIsLocationLoading(false);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Tidak bisa mengambil lokasi' });
      },
      { enableHighAccuracy: true }
    );
  };

  const handleAttachmentClick = () => setIsAttachmentPickerOpen((p) => !p);
  const openCamera = () => { setIsAttachmentPickerOpen(false); setIsWebcamActive(true); };
  const openGallery = () => { setIsAttachmentPickerOpen(false); galleryInputRef.current?.click(); };

  // --- NEW: Komponen Indikator Status (Ticks)
  const MessageStatus = ({ isSending, isFailed, isRead }) => {
    if (isFailed) return <span className="text-red-300 font-bold ml-1">!</span>;
    if (isSending) return <Loader2 className="w-3 h-3 animate-spin ml-1" />;
    
    // Logic centang
    if (isRead) {
      // Dibaca (Centang 2 Biru)
      return <CheckCheck className="w-3 h-3 ml-1 text-blue-300" />;
    } else {
      // Terkirim tapi belum dibaca (Centang 2 Abu-abu / Centang 1)
      // Disini kita default pakai Centang 2 Abu (Delivered) agar mirip WA
      return <CheckCheck className="w-3 h-3 ml-1 text-gray-300" />;
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {isWebcamActive && <WebcamCapture onCapture={handleCaptureWebcam} onClose={() => setIsWebcamActive(false)} />}

      <Navbar backButton title={partnerName} />

      {/* --- NEW: Tambahkan onScroll dan ref pada container --- */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar relative"
      >
        <div className="max-w-3xl mx-auto pb-2">
          {isLoadingHistory && messages.length === 0 && (
            <div className="flex justify-center mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}

          {!isLoadingHistory && messages.length === 0 && (
            <div className="text-center mt-20 opacity-50"><p>Belum ada pesan.</p></div>
          )}

          {messages.map((rawMsg, idx) => {
            const m = normalizeMessage(rawMsg);
            const isMe = isMessageFromMe(m);

            return (
              <div key={m.id || idx} className={`flex items-end gap-2 mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
                
                {!isMe && (
                  <PlainAvatar className="w-8 h-8 bg-gray-300 flex-shrink-0">
                    <span className="text-sm">👤</span>
                  </PlainAvatar>
                )}

                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                  <div className={`px-4 py-3 text-sm flex flex-col shadow-sm
                    ${isMe 
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
                    
                    {m.image && (
                        <img src={m.image} alt="attachment" className="rounded-lg mt-2 max-w-full object-cover max-h-64" />
                    )}
                    
                    {m.location && (
                      <div className="mt-2 rounded overflow-hidden">
                        <LocationPreview lat={m.location.lat} lng={m.location.lng} isMyMessage={isMe} />
                      </div>
                    )}

                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                      {formatTime(m.timestamp)}
                      
                      {/* --- NEW: Render Status Centang khusus pesan kita --- */}
                      {isMe && (
                        <MessageStatus 
                          isSending={m._isSending} 
                          isFailed={m._isFailed} 
                          isRead={m.isRead} 
                        />
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- NEW: Floating Scroll Button (WhatsApp Style) --- */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-4 z-30 animate-in fade-in zoom-in duration-200">
          <button 
            onClick={() => scrollToBottom(true)}
            className="relative w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronDown size={20} />
            {unreadNewMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {unreadNewMessages}
              </span>
            )}
          </button>
        </div>
      )}

      <div className="bg-white border-t border-gray-200 p-3 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto relative">
          
          {isAttachmentPickerOpen && (
            <div className="absolute bottom-full left-0 mb-3 p-2 bg-white border border-gray-100 shadow-lg rounded-xl flex gap-4 z-20">
              <button onClick={openCamera} className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Camera size={20} /></div>
                <span className="text-[10px] font-medium text-gray-600">Kamera</span>
              </button>
              <button onClick={openGallery} className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><ImageIcon size={20} /></div>
                <span className="text-[10px] font-medium text-gray-600">Galeri</span>
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <button onClick={handleAttachmentClick} className={`p-3 rounded-full transition-colors ${isAttachmentPickerOpen ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}>
              <FileText size={20} />
            </button>
            <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleSendImage} />
            <button onClick={handleShareLocation} disabled={isLocationLoading} className={`p-3 rounded-full transition-colors ${isLocationLoading ? 'animate-pulse' : ''} text-gray-500 hover:bg-gray-100`}>
              {isLocationLoading ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
            </button>

            <div className="flex-1 bg-gray-100 rounded-3xl flex items-center px-4 py-2">
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Tulis pesan..."
                    className="bg-transparent border-none outline-none w-full text-sm max-h-24 resize-none overflow-y-auto"
                    disabled={isLocationLoading}
                />
            </div>

            <button onClick={() => handleSendMessage()} disabled={(!inputText.trim() && !isLocationLoading)} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-transform active:scale-95">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentChat;