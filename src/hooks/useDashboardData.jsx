import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL; 

const useDashboardData = () => {
    const navigate = useNavigate();
    
    const [role] = useState(localStorage.getItem("userRole")?.toLowerCase() || "user");
    const [userXp, setUserXp] = useState(parseInt(localStorage.getItem("userXp")) || 0);
    const isSatgas = role === "satgas";
    const [unreadChatCount, setUnreadChatCount] = useState(0); 
    const [mapCenter, setMapCenter] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);

    useEffect(() => {
        if (isSatgas) {
            setUnreadChatCount(3); 
        }
    }, [isSatgas]);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoadingArticles(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/article?limit=4`);
                const result = response.data; 

                if (result.payload && Array.isArray(result.payload.datas)) {
                    const latestArticles = result.payload.datas.slice(0, 4).map((item) => ({
                        id: item.id,
                        title: item.title,
                        description: item.summary || "Tidak ada deskripsi singkat.",
                        category: item.category || "Umum",
                        readTime: item.timeRead ? `${item.timeRead}` : "5",
                        image: item.imageUrl || null, 
                        color: "blue",
                        requiredXp: item.requiredXp || 0,
                    }));

                    setArticles(latestArticles);
                } else {
                    console.error("Struktur data tidak sesuai:", result);
                    setArticles([]);
                }
            } catch (error) {
                console.error("Gagal mengambil artikel:", error);
            } finally {
                setLoadingArticles(false);
            }
        };

        if (API_BASE_URL) {
            fetchArticles();
        } else {
            console.error("VITE_API_URL belum diset di file .env!");
            setLoadingArticles(false);
        }
    }, []);


    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setMapCenter([latitude, longitude]);
                setShowMap(true);
            },
            () => setShowMap(false),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    const getCategoryColor = (category) => {
        const categoryLower = category?.name?.toLowerCase() || "";
        if (categoryLower.includes("hukum") || categoryLower.includes("legal")) return "bg-pink-100 text-pink-700";
        if (categoryLower.includes("kesehatan") || categoryLower.includes("mental")) return "bg-purple-100 text-purple-700";
        if (categoryLower.includes("darurat")) return "bg-red-100 text-red-700";
        return "bg-blue-100 text-blue-700";
    };

    const chatTarget = isSatgas ? "Pengguna" : "Satgas";
    const chatButtonText = `Chat dengan ${chatTarget}`;

    const handleArticleDetail = (id) => navigate(`/article/${id}`);
    const handleStartChat = () => navigate("/chat");
    const handleGoToMenfess = () => navigate("/menfess");
    const handleGoToMaps = () => navigate("/maps");
    const handleGoToAllArticles = () => navigate("/articles");
    const handleGoToProfile = () => navigate("/profile");

    return {
        role,
        userXp,
        isSatgas,
        unreadChatCount,
        mapCenter,
        showMap,
        articles,
        loadingArticles,
        getCategoryColor,
        handleStartChat,
        handleGoToMenfess,
        handleGoToMaps,
        handleGoToAllArticles,
        handleArticleDetail,
        chatButtonText,
        handleGoToProfile,
    };
};

export default useDashboardData;