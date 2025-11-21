import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/landingPageUtils'; 

const useLandingPageData = () => {
  const navigate = useNavigate();
  const [educationArticles, setEducationArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      try {
        const response = await fetch(`${API_BASE_URL}/article`);
        const result = await response.json();

        if (result.payload && Array.isArray(result.payload.datas)) {
          const articlesForLanding = result.payload.datas.slice(0, 2); 
          setEducationArticles(articlesForLanding);
          setError(null);
        } else {
          setError("Gagal memuat artikel: Struktur data server tidak valid.");
          setEducationArticles([]);
        }
      } catch (err) {
        console.error("Fetch Articles Error:", err);
        setError("Terjadi kesalahan jaringan atau server tidak merespons.");
        setEducationArticles([]);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

  const onLearnMore = () => {
    document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false); 
  };
  
  const handleReadArticle = (id) => {
    navigate(`/article/${id}`); 
  };
  
  return {
    educationArticles,
    loadingArticles,
    error,
    onLearnMore,
    handleLogin,
    handleReadArticle,
    navigate, 
    setIsOpen,
    isOpen,
  };
};

export default useLandingPageData;