import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { getSocket } from "../lib/socketUtils"; 

const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- HELPERS ---
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

    // --- 2. SOCKET LISTENER ---
    useEffect(() => {
        if (!token || !myId) return;

        const socket = getSocket();

        if (!socket.connected) {
            socket.auth = { token };
            socket.connect();
        }

        socket.emit("join_user", myId);

        const handleNewMessage = (newMsg) => {
            setChats(prevChats => {
                const incomingChatId = String(newMsg.chatId || newMsg.chat_id);
                const senderId = String(newMsg.senderId || newMsg.sender_id);

                const chatIndex = prevChats.findIndex(c => String(c.id) === incomingChatId);
                let newChats = [...prevChats];
                
                if (chatIndex > -1) {
                    // Update Chat Existing
                    const targetChat = { ...newChats[chatIndex] };
                    
                    const preview = newMsg.text?.trim() 
                        ? newMsg.text 
                        : newMsg.image ? "📷 Foto" : newMsg.location ? "📍 Lokasi" : "Pesan baru";

                    targetChat.lastMessage = preview;
                    targetChat.lastMsgTime = newMsg.createdAt || new Date().toISOString();
                    
                    // Logic Unread: Tambah 1 jika pengirim BUKAN kita
                    if (senderId !== myId) {
                        targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
                    }

                    // Pindahkan ke atas
                    newChats.splice(chatIndex, 1);
                    newChats.unshift(targetChat);
                } else {
                    // Chat Baru -> Fetch ulang biar aman datanya
                    fetchChatHistory();
                    return prevChats;
                }
                return newChats;
            });
        };

        socket.on("new_message", handleNewMessage);
        socket.on("receive_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("receive_message", handleNewMessage);
        };
    }, [myId, token]);


    // --- 3. API ACTIONS ---
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
                lastMessage: c.lastMessage || (c.unreadCount > 0 ? "Pesan baru" : "Riwayat chat"),
                lastMsgTime: c.updatedAt || c.created_at || new Date().toISOString(),
                unreadCount: c.unreadCount || c.unread_count || 0,
            }));

            // Filter Duplicate Partner (Simpan yang terbaru)
            const uniqueByPartner = [];
            const seenPartner = new Set();

            // Urutkan dulu biar yang masuk yang paling baru
            normalized.sort((a, b) => new Date(b.lastMsgTime) - new Date(a.lastMsgTime));

            for (const chat of normalized) {
                const partnerId = String(
                    String(chat.initiatorId) === String(myId) ? chat.recipientId : chat.initiatorId
                );

                if (!seenPartner.has(partnerId)) {
                    seenPartner.add(partnerId);
                    uniqueByPartner.push(chat);
                }
            }

            setChats(uniqueByPartner);
        } catch (err) {
            if(err.response?.status === 401) navigate('/login');
            console.error("fetchChatHistory error:", err);
        }
    };

    const fetchSatgasList = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/satgas`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSatgasList(res.data?.payload?.datas || []);
        } catch (e) { 
            if(e.response?.status === 401) navigate('/login');
        }
    };

    // --- 4. LOGIC OPEN CHAT (SOLUSI RESET COUNT) ---
    const handleOpenChat = (chatId, partnerInfo) => {
        // A. Update State Lokal (Visual) -> Reset unread jadi 0
        setChats(prevChats => prevChats.map(chat => {
            if (String(chat.id) === String(chatId)) {
                return { ...chat, unreadCount: 0 };
            }
            return chat;
        }));

        // B. Navigasi
        navigate(`/chat/${chatId}`, { 
            state: { 
                partnerName: partnerInfo.name, 
                partnerId: partnerInfo.id 
            } 
        });
    };

    // --- 5. HELPERS VIEW ---
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

    // VIEW A: List Inbox (Semua Chat)
    const renderInboxList = () => {
        const filtered = chats.filter(c => getPartnerInfo(c).name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filtered.length === 0) return <div className="text-center mt-20 opacity-50 text-sm">Belum ada pesan.</div>;

        return filtered.map(item => {
            const partner = getPartnerInfo(item);
            return (
                <div key={item.id} 
                     onClick={() => handleOpenChat(item.id, partner)} // Pakai fungsi baru
                     className="flex items-center p-4 border-b bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                            {partner.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-gray-900 truncate pr-2 text-base">{partner.name}</h3>
                            <span className={`text-[11px] font-medium shrink-0 ${item.unreadCount > 0 ? 'text-[#25D366]' : 'text-gray-400'}`}>
                                {formatTime(item.lastMsgTime)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className={`text-sm truncate max-w-[80%] ${item.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                {typeof item.lastMessage === 'string' ? item.lastMessage : "📷 Foto"}
                            </p>
                            
                            {item.unreadCount > 0 && (
                                <div className="bg-[#25D366] text-white text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1 shadow-sm">
                                    {item.unreadCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };

    // VIEW B: List Satgas (Gabungan Chat Ada + Kontak Baru)
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
                        // Kalau sudah ada chat, pakai handleOpenChat biar reset unread
                        handleOpenChat(item.chatData.id, { name: item.name, id: item.id });
                    } else {
                        // Kalau belum ada, navigate biasa (karena unread pasti 0)
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
                        {item.chatData?.unreadCount > 0 && (
                             <div className="bg-[#25D366] text-white text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1 shadow-sm">
                                {item.chatData.unreadCount}
                            </div>
                        )}
                    </div>
                    <p className={`text-sm ${item.chatData ? 'text-gray-500' : 'text-blue-500 italic'}`}>
                        {item.chatData ? 
                            (typeof item.chatData.lastMessage === 'string' ? item.chatData.lastMessage : "📷 Foto") 
                            : "Klik untuk mulai Konsultasi"}
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
                    {userRole === 'satgas' ? 'Kotak Masuk' : 'Daftar Satgas'}
                </div>
                {loading ? <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-600" /></div> : (
                    userRole === 'satgas' ? renderInboxList() : renderSatgasContactList()
                )}
            </div>
        </div>
    );
};

export default ChatList;