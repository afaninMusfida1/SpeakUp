import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL dari .env:", API_URL);

export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    return res.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data);
    return res.data;
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    throw err;
  }
};
