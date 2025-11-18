import axios from "axios";

// Pastikan variabel environment ini benar
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  
  // Validasi Token
  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("token");
    throw new Error("Authentication required");
  }

  try {
    const res = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ============================================================
    // PERBAIKAN DI SINI:
    // Ambil data dari dalam: response -> data -> payload -> datas
    // ============================================================
    if (res.data?.payload?.datas) {
        return res.data.payload.datas;
    }
    
    // Fallback jika struktur tidak sesuai
    return res.data;

  } catch (error) {
    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    }
    throw error;
  }
};