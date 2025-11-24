import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  
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
    if (res.data?.payload?.datas) {
        return res.data.payload.datas;
    }
    
    return res.data;

  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    }
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  const response = await fetch(`${API_URL}users/profile`, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal mengupdate profil");
  }

  return await response.json();
};