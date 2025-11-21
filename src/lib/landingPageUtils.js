export const API_BASE_URL = import.meta.env.VITE_API_URL; 

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 
    }
  }
};

export const getCategoryColor = (color) => {
    const map = {
      blue: "bg-blue-100 text-blue-700 border border-blue-200",
      purple: "bg-purple-100 text-purple-700 border border-purple-200",
      pink: "bg-pink-100 text-pink-700 border border-pink-200",
      red: "bg-red-100 text-red-700 border border-red-200",
    };
    return map[color] || map.blue; 
};

// export const ARTICLE_PLACEHOLDER_URL = "https://via.placeholder.com/600x400/D1C4E9/4527A0?text=Edukasi+SpeakUp"; 

// export const GENERIC_FALLBACK_URL = "https://via.placeholder.com/600x400/CCCCCC/FFFFFF?text=No+Image"; 

export const HERO_IMAGE_URL = `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80`;