import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:2007";

// Helper Hitung Jarak (Haversine)
const haversineKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const useMaps = () => {
  const [userPos, setUserPos] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mounted = useRef(true);

  // 1. Ambil GPS Browser (Hanya untuk visualisasi titik biru di peta)
  useEffect(() => {
    mounted.current = true;
    if (!navigator.geolocation) {
      if (mounted.current) { setUserPos(null); setShowMap(false); setLoadingLoc(false); }
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mounted.current) {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
          setShowMap(true); setLoadingLoc(false);
        }
      },
      (err) => {
        console.warn("Geolocation denied:", err);
        if (mounted.current) { setUserPos(null); setShowMap(false); setLoadingLoc(false); }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    return () => { mounted.current = false; };
  }, []);

  // 2. Fetch Satgas (Mengandalkan Data di Database)
  useEffect(() => {
    const fetchSatgas = async () => {
      setLoadingBackend(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
             if(mounted.current) setLoadingBackend(false);
             return;
        }

        // KEMBALI KE GET BIASA
        // Kita tidak kirim lat/lng karena asumsinya DB sudah ada isinya
        const response = await axios.get(`${API_BASE_URL}/satgas/nearest`, {
          params: {
            limit: 5
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const rawData = response.data?.payload?.datas || [];

        const parsedLocations = rawData.map((item) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          
          // Hitung jarak real-time dari posisi user sekarang ke lokasi satgas
          let displayDistance = item.distance;
          if (userPos && lat && lng) {
             const dist = haversineKm(userPos[0], userPos[1], lat, lng);
             displayDistance = (Math.round(dist * 10) / 10) + " km";
          }

          return {
            id: item.id,
            name: item.nama || item.name || "Pos Satgas",
            address: item.alamat || item.address || "Alamat tidak tersedia",
            phone: item.telepon || item.phone || null,
            category: "police",
            latitude: lat,
            longitude: lng,
            distance: displayDistance
          };
        });

        if (mounted.current) setLocations(parsedLocations);

      } catch (error) {
        console.error("Gagal Fetch Data:", error);
        // Kalau server mati (Connection Refused), set array kosong
        if (mounted.current) setLocations([]);
      } finally {
        if (mounted.current) setLoadingBackend(false);
      }
    };

    fetchSatgas();

  }, [userPos]); 

  return { userPos, showMap, loadingLoc, loadingBackend, locations, selectedLocation, setSelectedLocation };
};

export default useMaps;