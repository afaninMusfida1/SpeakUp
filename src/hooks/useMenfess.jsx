import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

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

const useMenfess = () => {
  const navigate = useNavigate();
  
  // State
  const [menfessList, setMenfessList] = useState([]);
  const [newMenfess, setNewMenfess] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [visibleComments, setVisibleComments] = useState({});
  const [newComments, setNewComments] = useState({});
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState({});
  const [error, setError] = useState(null);
  
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

      // Optional: Pre-fetch placeholder counts (bisa di-skip jika performa lambat)
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

    // Optimistic Update
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
      // Refresh untuk mendapatkan data real dari server (termasuk ID asli)
      await fetchMenfess();
    } catch (err) {
      // Rollback jika gagal
      setMenfessList(prev => prev.filter(m => m.id !== temp.id));
      setError("Gagal mengirim menfess. Coba lagi.");
    }
  };

  const handleAddComment = async (menfessId) => {
    const commentText = (newComments[menfessId] || "").trim();
    if (!commentText) return;

    const anonId = `Anonim #${Math.floor(Math.random() * 1000)}`;

    // Optimistic Update
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

      // Fetch ulang reply khusus untuk menfess ini agar sinkron
      const res2 = await axios.get(`${API_URL}/menfess/${menfessId}/reply`);
      const menfessData = res2.data?.payload?.datas ?? res2.data?.data ?? {};
      const repliesRaw = Array.isArray(menfessData.replies) ? menfessData.replies : (Array.isArray(menfessData) ? menfessData : []);
      const replies = repliesRaw.map(normalizeReply);

      setMenfessList(prev =>
        prev.map(m => (m.id === menfessId ? { ...m, comments: replies } : m))
      );
    } catch (err) {
      setError("Gagal mengirim komentar. Coba lagi.");
      // Rollback comment
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

  return {
    menfessList,
    newMenfess, setNewMenfess,
    showCompose, setShowCompose,
    visibleComments,
    newComments, setNewComments,
    loading,
    loadingReplies,
    error, setError,
    handleBack,
    handlePostMenfess,
    handleAddComment,
    toggleComments,
    formatTimeAgo
  };
};

export default useMenfess;