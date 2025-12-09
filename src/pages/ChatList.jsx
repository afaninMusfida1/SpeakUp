import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
// --- NEW: Import helper socket ---
import { getSocket } from "../lib/socketUtils"; 

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Format waktu singkat
const formatTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    
    const now = new Date();
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    
    return isToday 
        ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) 
        : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

const getSafeId = (item) => item?.id || item?.user_id || item?.userId || "";

const ChatList = () => {
    const navigate = useNavigate();
    // const socket = useRef(null); // TIDAK PERLU REF LAGI

    const [chats, setChats] = useState([]);
    const [satgasList, setSatgasList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Auth Data
    const token = localStorage.getItem("token");
    const userRole = (localStorage.getItem("userRole") || "user").toLowerCase();
    
    const getMyId = () => {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        return String(u.id || localStorage.getItem("userId") || "");
    }
    const myId = getMyId();

    // --- 1. FETCH DATA (INIT) ---
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchChatHistory();
            if (userRole === "user") await fetchSatgasList();
            setLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole]);

    // --- 2. SOCKET LISTENER (REALTIME UPDATES) ---
    useEffect(() => {
        if (!token || !myId) return;

        const socket = getSocket();

        // Pastikan terkoneksi
        if (!socket.connected) {
            socket.auth = { token };
            socket.connect();
        }

        // Join room user agar bisa terima notif personal
        socket.emit("join_user", myId);

        // Handler saat ada pesan baru masuk
        const handleNewMessage = (newMsg) => {
            console.log("ChatList: New Message Received", newMsg);

            setChats(prevChats => {
                const incomingChatId = String(newMsg.chatId || newMsg.chat_id);
                const senderId = String(newMsg.senderId || newMsg.sender_id);

                // Cari apakah chat sudah ada di list
                const chatIndex = prevChats.findIndex(c => String(c.id) === incomingChatId);
                
                let newChats = [...prevChats];
                
                if (chatIndex > -1) {
                    // --- SKENARIO 1: Chat Sudah Ada ---
                    const targetChat = { ...newChats[chatIndex] };
                    
                    // Update preview pesan terakhir
                    const preview =
                        newMsg.text?.trim()
                            ? newMsg.text
                            : newMsg.image
                                ? "📷 Foto"
                                : newMsg.location
                                    ? "📍 Lokasi"
                                    : "Pesan baru";

                    targetChat.lastMessage = preview;

                    localStorage.setItem(
                        `lastMessage_${incomingChatId}`,
                        preview
                    );

                    localStorage.setItem(
                        `lastMessage_${incomingChatId}`,
                        targetChat.lastMessage
                        );

                    targetChat.lastMsgTime = newMsg.createdAt || new Date().toISOString();
                    
                    // Logic Unread: Tambah 1 jika pengirim BUKAN kita
                    if (senderId !== myId) {
                        targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
                    }

                    // Pindahkan ke paling atas (unshift)
                    newChats.splice(chatIndex, 1);
                    newChats.unshift(targetChat);
                } else {
                    // --- SKENARIO 2: Chat Baru (Belum ada di list) ---
                    // Fetch ulang agar data chat lengkap (nama partner, avatar, dll)
                    fetchChatHistory();
                    return prevChats; // Sementara return prev, nanti ke-update via fetch
                }
                
                return newChats;
            });
        };

        // Handler saat pesan dibaca (opsional, untuk reset badge realtime)
        const handleMessagesRead = ({ chatId }) => {
             setChats(prev => prev.map(c => {
                 if(String(c.id) === String(chatId)) {
                     return { ...c, unreadCount: 0 };
                 }
                 return c;
             }));
        };

        // Listen Events
        socket.on("new_message", handleNewMessage);
        socket.on("receive_message", handleNewMessage); // Jaga-jaga nama event beda
        socket.on("messages_read_update", handleMessagesRead); // Jika ada fitur ini di backend

        // Cleanup listener saja, jangan disconnect socket global
        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("receive_message", handleNewMessage);
            socket.off("messages_read_update", handleMessagesRead);
        };
    }, [myId, token]);


    // --- API CALLS ---
    const fetchChatHistory = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/chat/`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const rawDatas = res.data?.payload?.datas || [];
        
        const normalized = rawDatas.map(c => ({
            id: c.id,
            initiatorId: getSafeId(c.initiator) || c.initiatorId,
            recipientId: getSafeId(c.recipient) || c.recipientId,
            initiator: c.initiator,
            recipient: c.recipient,
            lastMessage:
                c.lastMessage ??
                localStorage.getItem(`lastMessage_${c.id}`) ??
                (c.unreadCount > 0 ? "Pesan baru" : "Belum ada pesan"),
            lastMsgTime: c.updatedAt || c.created_at || new Date().toISOString(),
            unreadCount: c.unreadCount || c.unread_count || 0,
        }));

        const uniqueByPartner = [];
        const seenPartner = new Set();

        for (const chat of normalized) {
            const partnerId = String(
                String(chat.initiatorId) === String(myId)
                    ? chat.recipientId
                    : chat.initiatorId
            );

            if (!seenPartner.has(partnerId)) {
                seenPartner.add(partnerId);
                uniqueByPartner.push(chat);
            }
        }

        uniqueByPartner.sort(
            (a, b) => new Date(b.lastMsgTime) - new Date(a.lastMsgTime)
        );

        setChats(uniqueByPartner);
    } catch (err) {
        console.error("fetchChatHistory error:", err);
    }
};


    const fetchSatgasList = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/satgas`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSatgasList(res.data?.payload?.datas || []);
        } catch (e) { console.error("Err satgas", e); }
    };

    const getPartnerInfo = (chat) => {
        const initId = String(chat.initiatorId);
        if (initId === myId) {
            return {
                id: String(chat.recipientId),
                name: chat.recipient?.name || "User",
            };
        }
        return {
            id: initId,
            name: chat.initiator?.name || "User",
        };
    };

    // --- VIEWS ---

    // VIEW 1: List Inbox (Satgas/User melihat Chat Langsung)
    const renderInboxList = () => {
        const filtered = chats.filter(c => getPartnerInfo(c).name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filtered.length === 0) return <div className="text-center mt-20 opacity-50 text-sm">Belum ada pesan.</div>;

        return filtered.map(item => {
            const partner = getPartnerInfo(item);
            return (
                <div key={item.id} onClick={() => navigate(`/chat/${item.id}`, { state: { partnerName: partner.name, partnerId: partner.id } })}
                     className="flex items-center p-4 border-b bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    
                    {/* AVATAR */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                            {partner.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-gray-900 truncate pr-2 text-base">{partner.name}</h3>
                            {/* JAM - Hijau kalau unread */}
                            <span className={`text-[11px] font-medium shrink-0 ${item.unreadCount > 0 ? 'text-[#25D366]' : 'text-gray-400'}`}>
                                {formatTime(item.lastMsgTime)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm truncate text-gray-500 max-w-[80%]">
                                {typeof item.lastMessage === 'string' ? item.lastMessage : "📷 Foto"}
                            </p>
                            
                            {/* BADGE HIJAU */}
                            {item.unreadCount > 0 && (
                                <div className="bg-[#25D366] text-white text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1 shadow-sm animate-in zoom-in">
                                    {item.unreadCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };

    // VIEW 2: List Satgas (Hanya untuk User yang mau konsultasi)
    const renderSatgasContactList = () => {
        const mergedList = satgasList.map(s => {
            const existingChat = chats.find(c => {
                const p = getPartnerInfo(c);
                return String(p.id) === String(s.id);
            });
            return { ...s, chatData: existingChat || null };
        });

        // Sort: Unread > Recent > Name
        mergedList.sort((a, b) => {
            const unreadA = a.chatData?.unreadCount || 0;
            const unreadB = b.chatData?.unreadCount || 0;
            if (unreadB !== unreadA) return unreadB - unreadA;
            
            const timeA = a.chatData?.lastMsgTime || 0;
            const timeB = b.chatData?.lastMsgTime || 0;
            if (timeA && timeB) return new Date(timeB) - new Date(timeA);
            
            return a.name.localeCompare(b.name);
        });

        const filtered = mergedList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

        return filtered.map(item => (
            <div key={item.id}
                onClick={() => {
                    if (item.chatData) {
                        navigate(`/chat/${item.chatData.id}`, { state: { partnerName: item.name, partnerId: item.id } });
                    } else {
                        navigate(`/chat/new`, { state: { partnerName: item.name, partnerId: item.id } });
                    }
                }}
                className="flex items-center p-4 border-b bg-white hover:bg-gray-50 cursor-pointer"
            >
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        
                        {/* BADGE HIJAU DI LIST SATGAS */}
                        {item.chatData?.unreadCount > 0 && (
                             <div className="bg-[#25D366] text-white text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1 shadow-sm">
                                {item.chatData.unreadCount}
                            </div>
                        )}
                    </div>
                    <p className={`text-sm ${item.chatData ? 'text-gray-500' : 'text-blue-500 italic'}`}>
                        {item.chatData ? 
                            (typeof item.chatData.lastMessage === 'string' ? item.chatData.lastMessage : "📷 Foto") 
                            : "Klik untuk mulai konsultasi"}
                    </p>
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="p-4 bg-white border-b flex items-center space-x-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
                <div className="flex-1 flex items-center space-x-3 border rounded-full px-4 py-2 bg-gray-100 focus-within:ring-1 focus-within:ring-[#25D366] transition-all">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-transparent focus:outline-none text-sm" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {userRole === 'satgas' ? 'Inbox Pesan' : 'Daftar Konselor'}
                </div>
                {loading ? <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#25D366]" /></div> : (
                    userRole === 'satgas' ? renderInboxList() : renderSatgasContactList()
                )}
            </div>
        </div>
    );
};

export default ChatList;