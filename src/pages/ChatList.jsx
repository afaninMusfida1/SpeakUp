import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Format waktu singkat
const formatTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const getSafeId = (item) => {
    if (!item) return "";
    const id = item.id || item.user_id || item.userId || item.uuid || item?.payload?.id || item?.data?.id;
    return id ? String(id) : "";
};

const ChatList = () => {
    const navigate = useNavigate();

    const [chats, setChats] = useState([]); // raw chat objects from /chat/
    const [satgasList, setSatgasList] = useState([]); // for user role
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [myId, setMyId] = useState("");

    const userRole = (localStorage.getItem("userRole") || "user").toLowerCase();
    const token = localStorage.getItem("token");

    // get current user id robustly
    const storedUserId = localStorage.getItem("userId");
    const userString = localStorage.getItem("user");
    const parsed = userString ? JSON.parse(userString) : {};
    const oldObjectId = getSafeId(parsed);
    const currentUserId = myId || storedUserId || oldObjectId;

    useEffect(() => {
        const idFromStorage = localStorage.getItem("userId");
        if (idFromStorage) {
            setMyId(String(idFromStorage));
        } else if (oldObjectId) {
            setMyId(String(oldObjectId));
        }
    }, [oldObjectId]);

    // Fetch chats and satgas list if needed
    useEffect(() => {
        let mounted = true;
        const init = async () => {
            setLoading(true);
            await fetchChatHistory();
            if (userRole === "user") await fetchSatgasList();
            if (mounted) setLoading(false);
        };
        init();

        const interval = setInterval(async () => {
            await fetchChatHistory();
            if (userRole === "user" && satgasList.length === 0) await fetchSatgasList();
        }, 5000);

        return () => { mounted = false; clearInterval(interval); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole]);

    const fetchChatHistory = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/chat/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const datas = res.data?.payload?.datas || [];
            // We expect an array of Chat objects, each may include last message or maybe not.
            // Normalize: ensure createdAt, initiatorId, recipientId present.
            const normalized = datas.map(c => ({
                ...c,
                createdAt: c.createdAt || c.created_at || c.created_at,
                initiatorId: c.initiatorId ?? c.initiator_id ?? getSafeId(c.initiator),
                recipientId: c.recipientId ?? c.recipient_id ?? getSafeId(c.recipient),
                // lastMessage if backend supplies, prefer lastMessage or last_message
                lastMessage: c.lastMessage || c.last_message || null,
                // optionally include unreadCount if backend supplies
                unreadCount: typeof c.unreadCount === "number" ? c.unreadCount : (c.unread_count ?? null),
            }));

            setChats(normalized);
        } catch (e) {
            console.error("Err history", e);
        }
    };

    const fetchSatgasList = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/satgas`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const datas = res.data?.payload?.datas || [];
            setSatgasList(datas);
        } catch (e) {
            console.error("Err satgas", e);
        }
    };

    // HELPERS: find partner object and meta for a chat
    const getPartnerForChat = (chat) => {
        const myIdStr = String(currentUserId || "");
        const initId = String(chat.initiatorId ?? getSafeId(chat.initiator) ?? "");
        const recId = String(chat.recipientId ?? getSafeId(chat.recipient) ?? "");

        let partner = null;
        let partnerId = "";
        if (initId === myIdStr) {
            partnerId = recId;
            partner = chat.recipient || { id: recId, name: chat.recipient_name || chat.recipient?.name || "User" };
        } else {
            partnerId = initId;
            partner = chat.initiator || { id: initId, name: chat.initiator_name || chat.initiator?.name || "User" };
        }
        return { partner, partnerId };
    };

    // Compute last activity time and unread count per chat (best effort).
    const computeChatMeta = (chat) => {
        // lastMessage may be object or string
        let lastMsgText = "";
        let lastMsgTime = chat.createdAt || chat.created_at || chat.updatedAt || new Date().toISOString();
        if (chat.lastMessage) {
            if (typeof chat.lastMessage === "string") lastMsgText = chat.lastMessage;
            else if (chat.lastMessage.content) {
                try {
                    if (typeof chat.lastMessage.content === "string") lastMsgText = chat.lastMessage.content;
                    else lastMsgText = JSON.stringify(chat.lastMessage.content);
                } catch { lastMsgText = ""; }
            } else lastMsgText = chat.lastMessage.message || chat.lastMessage.text || "";
            lastMsgTime = chat.lastMessage.createdAt || chat.lastMessage.created_at || lastMsgTime;
        }

        // unreadCount if provided by backend; else null (we don't spam additional requests here)
        const unreadCount = (typeof chat.unreadCount === "number") ? chat.unreadCount : null;

        return { lastMsgText, lastMsgTime, unreadCount };
    };

    // Build list for satgas view: only chats where partner role is 'user'
    const renderSatgasView = () => {
        // Filter chats so satgas sees only chats with users (exclude chats between satgas-satgas/admin etc)
        const myIdStr = String(currentUserId || "");
        const satgasChats = chats.filter(c => {
            // ensure chat has initiatorId and recipientId
            const a = String(c.initiatorId || getSafeId(c.initiator) || "");
            const b = String(c.recipientId || getSafeId(c.recipient) || "");
            // satgas should see any chat where either side is a user (not satgas) AND the chat involves them? 
            // But the user said "di satgas itu cuma tampil list chat dari user ya" -> so show all chats where the other party is role user.
            // We can't always know partner role from chat object; try to use initiator.role/recipient.role if present.
            const initiatorRole = c.initiator?.role || c.initiator_role || null;
            const recipientRole = c.recipient?.role || c.recipient_role || null;

            // If roles present, include only chats where the opposite is 'user'
            if (initiatorRole || recipientRole) {
                // if initiator is user and recipient is satgas OR vice versa, include
                const isUserInitiator = initiatorRole === "user";
                const isUserRecipient = recipientRole === "user";
                return isUserInitiator || isUserRecipient;
            }

            // fallback: if current user is satgas (myId matches one side), include that chat
            // but user demanded satgas only see list from user — assume satgas account will have myId and we'll show chats where myId involved
            return a === myIdStr || b === myIdStr;
        });

        // Map to meta objects and sort: unread desc, then lastMsgTime desc
        const enriched = satgasChats.map(c => {
            const { partner, partnerId } = getPartnerForChat(c);
            const { lastMsgText, lastMsgTime, unreadCount } = computeChatMeta(c);
            return {
                chatId: c.id,
                partner,
                partnerId,
                lastMsgText,
                lastMsgTime,
                unreadCount: unreadCount ?? 0,
                raw: c
            };
        });

        enriched.sort((x, y) => {
            // unread first
            if ((y.unreadCount || 0) - (x.unreadCount || 0) !== 0) {
                return (y.unreadCount || 0) - (x.unreadCount || 0);
            }
            // then last message time
            return new Date(y.lastMsgTime) - new Date(x.lastMsgTime);
        });

        const filtered = enriched.filter(it => it.partner?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filtered.length === 0) return <div className="text-center mt-20 opacity-50">Belum ada pesan masuk.</div>;

        return filtered.map(item => (
            <div key={item.chatId} onClick={() => navigate(`/chat/${item.chatId}`, { state: { partnerName: item.partner?.name, partnerId: item.partnerId } })}
                 className="flex items-center p-4 border-b bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                        {item.partner?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                </div>

                <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900 truncate pr-2 text-base">{item.partner?.name || "User"}</h3>
                        <span className="text-[10px] font-medium text-gray-400 shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                            {formatTime(item.lastMsgTime)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${item.lastMsgText ? "text-gray-800 font-medium" : "text-gray-400 italic"}`}>
                            {item.lastMsgText || "Klik untuk membuka percakapan"}
                        </p>
                        {item.unreadCount > 0 && (
                            <div className="ml-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {item.unreadCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ));
    };

    // User view: show satgas list (from satgasList), prioritize existing chats & unread
    const renderUserView = () => {
        if (!currentUserId) {
            return (
                <div className="text-center mt-10 text-red-500 text-sm p-4">
                    <p>Memuat profil...</p>
                    <button onClick={() => window.location.reload()} className="mt-2 text-blue-500 underline text-xs">Refresh</button>
                </div>
            );
        }

        // For each satgas, find related chat if exists
        const merged = satgasList.map(s => {
            const pid = getSafeId(s);
            // find chat between currentUserId and pid
            const found = chats.find(c => {
                const a = String(c.initiatorId || getSafeId(c.initiator) || "");
                const b = String(c.recipientId || getSafeId(c.recipient) || "");
                return (a === String(pid) && b === String(currentUserId)) || (b === String(pid) && a === String(currentUserId));
            });

            const meta = found ? computeChatMeta(found) : { lastMsgText: "", lastMsgTime: 0, unreadCount: 0 };

            return {
                ...s,
                partnerId: pid,
                hasChat: !!found,
                chatId: found ? found.id : null,
                lastMsgText: meta.lastMsgText,
                lastMsgTime: meta.lastMsgTime,
                unreadCount: meta.unreadCount || 0
            };
        });

        // Sort: unread desc, then hasChat (recent) then name
        merged.sort((a, b) => {
            if ((b.unreadCount || 0) - (a.unreadCount || 0) !== 0) return (b.unreadCount || 0) - (a.unreadCount || 0);
            if ((b.lastMsgTime || 0) - (a.lastMsgTime || 0) !== 0) return (b.lastMsgTime || 0) - (a.lastMsgTime || 0);
            return a.name.localeCompare(b.name);
        });

        const filtered = merged.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filtered.length === 0) return <div className="text-center mt-20 opacity-50">Tidak ada kontak Satgas.</div>;

        return filtered.map(item => (
            <div key={item.partnerId}
                onClick={() => {
                    if (item.hasChat && item.chatId) {
                        navigate(`/chat/${item.chatId}`, { state: { partnerName: item.name, partnerId: item.partnerId } });
                    } else {
                        navigate(`/chat/new`, { state: { partnerName: item.name, partnerId: item.partnerId } });
                    }
                }}
                className="flex items-center p-4 border-b bg-white hover:bg-gray-50 cursor-pointer"
            >
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                    {item.hasChat && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                </div>
                <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        {item.unreadCount > 0 && <span className="text-[12px] bg-red-500 text-white px-2 py-0.5 rounded-full">{item.unreadCount}</span>}
                    </div>
                    <p className="text-sm text-gray-500">
                        {item.hasChat ? (item.lastMsgText || "Lihat riwayat percakapan") : "Klik untuk mulai konsultasi"}
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
                <div className="flex-1 flex items-center space-x-3 border rounded-full px-4 py-2 bg-gray-100">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-transparent focus:outline-none" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    {userRole === 'satgas' ? 'Inbox User' : 'Daftar Konselor / Satgas'}
                </div>
                {loading ? <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-500" /></div> : (
                    userRole === 'satgas' ? renderSatgasView() : renderUserView()
                )}
            </div>
        </div>
    );
};

export default ChatList;
