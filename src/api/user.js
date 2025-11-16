import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
