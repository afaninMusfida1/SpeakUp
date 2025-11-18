import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "";

const PlainButton = ({ onClick, children, className = "", variant, disabled, ...props }) => {
  let baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  if (variant === "ghost") baseClasses = "hover:bg-gray-100 hover:text-accent-foreground";
  if (variant === "outline") baseClasses = "border border-gray-300 bg-white hover:bg-gray-50";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const PlainCard = ({ onClick, children, className = "" }) => (
  <div onClick={onClick} className={`bg-white shadow-md rounded-2xl ${className} ${onClick ? "cursor-pointer" : ""}`}>
    {children}
  </div>
);

const PlainTextarea = ({ value, onChange, placeholder, className = "", ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    {...props}
  />
);

const PlainAvatar = ({ children, className = "" }) => (
  <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>{children}</div>
);

const PlainBadge = ({ children, className = "" }) => (
  <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}>{children}</div>
);

const normalizeReply = (raw) => {
  return {
    id: raw.id ?? raw._id ?? Math.random().toString(36).slice(2, 9),
    creator: raw.creator ?? "Anonim",
    content: raw.content ?? raw.text ?? "",
    created_at: raw.created_at ?? raw.createdAt ?? null
  };
};

const normalizeMenfess = (raw) => {
  return {
    id: raw.id ?? raw._id,
    creator: raw.creator ?? raw.anonId ?? "Anonim",
    content: raw.content ?? raw.body ?? "",
    created_at: raw.created_at ?? raw.createdAt ?? raw.timestamp ?? null,
    comments: Array.isArray(raw.replies) ? raw.replies.map(normalizeReply) : []
  };
};

const MenfessPage = ({ username }) => {
  const [menfessList, setMenfessList] = useState([]);
  const [newMenfess, setNewMenfess] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [visibleComments, setVisibleComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    fetchMenfess();
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleBack = () => navigate("/dashboard");

  const fetchReplyCount = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/menfess/${id}/reply`);
      const menfessData = res.data?.payload?.datas ?? res.data?.data ?? {};
      const replies = Array.isArray(menfessData.replies) ? menfessData.replies : (Array.isArray(menfessData) ? menfessData : []);
      return replies.length;
    } catch (err) {
      return 0;
    }
  };

  const fetchMenfess = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/menfess`);
      const rawList = Array.isArray(res.data?.payload?.datas) ? res.data.payload.datas : [];
      let list = [...rawList]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(normalizeMenfess);

      list = await Promise.all(
        list.map(async (m) => {
          if (m.comments && m.comments.length > 0) {
            return m;
          }
          const count = await fetchReplyCount(m.id);
          const placeholders = Array.from({ length: count }, () => ({ __placeholder: true }));
          return { ...m, comments: placeholders };
        })
      );

      if (mounted.current) setMenfessList(list);
    } catch (err) {
      if (mounted.current) setError("Gagal memuat menfess. Cek koneksi atau server.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const toggleComments = async (id) => {
    const willOpen = !visibleComments[id];
    setVisibleComments(prev => ({ ...prev, [id]: willOpen }));

    const menfess = menfessList.find(m => m.id === id);
    const hasPlaceholder = Array.isArray(menfess?.comments) && menfess.comments.length > 0 && menfess.comments[0]?.__placeholder;

    if (willOpen && ( !menfess?.comments || menfess.comments.length === 0 || hasPlaceholder )) {
      setLoadingReplies(prev => ({ ...prev, [id]: true }));
      try {
        const res = await axios.get(`${API_URL}/menfess/${id}/reply`);
        const menfessData = res.data?.payload?.datas ?? res.data?.data ?? {};
        const repliesRaw = Array.isArray(menfessData.replies) ? menfessData.replies : (Array.isArray(menfessData) ? menfessData : []);
        const replies = repliesRaw.map(normalizeReply);
        setMenfessList(prev =>
          prev.map(m => (m.id === id ? { ...m, comments: replies } : m))
        );
      } catch (err) {
        setError("Gagal memuat komentar. Coba lagi.");
      } finally {
        setLoadingReplies(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handlePostMenfess = async () => {
    if (!newMenfess.trim()) return;
    const anonId = `Anonim #${Math.floor(Math.random() * 1000)}`;

    const temp = {
      id: `temp-${Date.now()}`,
      creator: anonId,
      content: newMenfess,
      created_at: new Date().toISOString(),
      comments: []
    };
    setMenfessList(prev => [temp, ...prev]);
    setNewMenfess("");
    setShowCompose(false);

    try {
      await axios.post(`${API_URL}/menfess`, {
        creator: anonId,
        content: temp.content
      });
      await fetchMenfess();
    } catch (err) {
      setMenfessList(prev => prev.filter(m => m.id !== temp.id));
      setError("Gagal mengirim menfess. Coba lagi.");
    }
  };

  const handleAddComment = async (menfessId) => {
    const commentText = (newComments[menfessId] || "").trim();
    if (!commentText) return;

    const anonId = `Anonim #${Math.floor(Math.random() * 1000)}`;

    const tempComment = {
      id: `temp-${Date.now()}`,
      creator: anonId,
      content: commentText,
      created_at: new Date().toISOString()
    };

    setMenfessList(prev =>
      prev.map(m => (m.id === menfessId ? { ...m, comments: [...(m.comments || []), tempComment] } : m))
    );
    setNewComments(prev => ({ ...prev, [menfessId]: "" }));

    try {
      await axios.post(`${API_URL}/menfess/${menfessId}/reply`, {
        creator: anonId,
        content: commentText
      });

      const res2 = await axios.get(`${API_URL}/menfess/${menfessId}/reply`);
      const menfessData = res2.data?.payload?.datas ?? res2.data?.data ?? {};
      const repliesRaw = Array.isArray(menfessData.replies) ? menfessData.replies : (Array.isArray(menfessData) ? menfessData : []);
      const replies = repliesRaw.map(normalizeReply);

      setMenfessList(prev =>
        prev.map(m => (m.id === menfessId ? { ...m, comments: replies } : m))
      );
    } catch (err) {
      setError("Gagal mengirim komentar. Coba lagi.");
      setMenfessList(prev =>
        prev.map(m =>
          m.id === menfessId
            ? { ...m, comments: (m.comments || []).filter(c => !String(c.id).startsWith("temp-")) }
            : m
        )
      );
    }
  };

  const formatTimeAgo = (iso) => {
    if (!iso) return "";
    const date = typeof iso === "string" ? new Date(iso) : new Date(iso);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    return `${Math.floor(seconds / 86400)} hari lalu`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar backButton={true} title="Menfess" showUrgent={true} onBack={handleBack} />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <section className="py-5">
          <div className="max-w-xl mx-auto text-center px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">🕊️ Berbagi Cerita Tanpa Nama</h1>
            <p className="text-gray-600 text-base">
              Bagikan pengalaman atau perasaanmu dengan aman. Identitasmu tetap rahasia.
            </p>
          </div>
        </section>

        {!showCompose ? (
          <PlainCard className="p-6 mb-6 bg-white/90 backdrop-blur-md border-2 border-gray-100 hover:shadow-lg transition-shadow">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-white text-xl">👤</span>
              </PlainAvatar>
              <span className="text-gray-500">Tuliskan ceritamu di sini...</span>
            </button>
          </PlainCard>
        ) : (
          <PlainCard className="p-6 mb-6 bg-white/90 backdrop-blur-md border-2 border-blue-200 shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-white text-xl">👤</span>
              </PlainAvatar>
              <div className="flex-1">
                <p className="text-gray-900 font-semibold mb-1">Anonim</p>
                <PlainBadge className="bg-blue-100 text-blue-700">Anonim</PlainBadge>
              </div>
            </div>
            <PlainTextarea
              value={newMenfess}
              onChange={(e) => setNewMenfess(e.target.value)}
              placeholder="Tulis cerita atau perasaanmu..."
              className="min-h-[120px] rounded-2xl border-2 border-gray-200 focus:border-blue-400 mb-4 resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">{newMenfess.length} karakter</p>
              <div className="flex gap-2">
                <PlainButton
                  variant="outline"
                  onClick={() => {
                    setShowCompose(false);
                    setNewMenfess("");
                  }}
                  className="rounded-2xl px-5 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Batal
                </PlainButton>
                <PlainButton
                  onClick={handlePostMenfess}
                  disabled={!newMenfess.trim()}
                  className="rounded-2xl px-5 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Publikasikan
                </PlainButton>
              </div>
            </div>
          </PlainCard>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-lg">
            {error}
            <button
              onClick={() => {
                setError(null);
              }}
              className="ml-3 underline text-xs"
            >
              tutup
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {menfessList.length === 0 && (
              <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-gray-100 text-center text-gray-500">
                Belum ada menfess — jadilah yang pertama berbagi.
              </div>
            )}

            {menfessList.map((menfess) => (
              <PlainCard key={menfess.id} className="p-6 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400">
                    <span className="text-white text-xl">👤</span>
                  </PlainAvatar>
                  <div>
                    <p className="text-gray-900 font-semibold">{menfess.creator}</p>
                    <p className="text-sm text-gray-500">{formatTimeAgo(menfess.created_at)}</p>
                  </div>
                </div>

                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{menfess.content}</p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleComments(menfess.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{(menfess.comments || []).length}</span>
                      </button>
                    </div>

                    <div className="text-sm text-gray-400"></div>
                  </div>

                  {visibleComments[menfess.id] && (
                    <div className="mt-3 space-y-2 pl-12">
                      {loadingReplies[menfess.id] ? (
                        <div className="text-sm text-gray-400">Memuat komentar...</div>
                      ) : (menfess.comments || []).length > 0 ? (
                        [...(menfess.comments || [])].reverse().map((comment) => (
                          <div key={comment.id ?? JSON.stringify(comment)} className="bg-gray-100 p-3 rounded-lg text-gray-700 text-sm">
                            <div className="flex justify-between items-start gap-2">
                              <div className="text-sm font-semibold text-gray-800">{comment.creator ?? "Anonim"}</div>
                              <div className="text-xs text-gray-400">{formatTimeAgo(comment.created_at)}</div>
                            </div>
                            <div className="mt-1 text-gray-700">{comment.content ?? ""}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">Belum ada komentar.</p>
                      )}

                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Tulis komentar..."
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={newComments[menfess.id] || ""}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [menfess.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleAddComment(menfess.id)}
                        />
                        <PlainButton onClick={() => handleAddComment(menfess.id)} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                          Kirim
                        </PlainButton>
                      </div>
                    </div>
                  )}
                </div>
              </PlainCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenfessPage;
