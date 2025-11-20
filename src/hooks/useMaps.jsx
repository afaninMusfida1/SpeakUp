import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const haversineKm = (lat1, lon1, lat2, lon2) => {
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

  // 1. Get Geolocation saat mount
  useEffect(() => {
    mounted.current = true;

    if (!navigator.geolocation) {
      if(mounted.current) {
        setUserPos(null);
        setShowMap(false);
        setLoadingLoc(false);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if(mounted.current) {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserPos([lat, lng]);
          setShowMap(true);
          setLoadingLoc(false);
        }
      },
      (err) => {
        console.warn("Geolocation error / denied:", err);
        if(mounted.current) {
          setUserPos(null);
          setShowMap(false);
          setLoadingLoc(false);
        }
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );

    return () => { mounted.current = false; };
  }, []);

  // 2. Fetch Nearby Locations dari Backend saat userPos tersedia
  useEffect(() => {
    if (!userPos) return;

    const fetchNearby = async () => {
      setLoadingBackend(true);
      try {
        const url = `${API_BASE_URL}/nearby`;
        const response = await axios.get(url, {
            params: {
                lat: userPos[0],
                lng: userPos[1]
            }
        });

        const data = response.data;

        // Parsing Logic (Support OSM Feature & Prisma Record)
        const parsed = (Array.isArray(data) ? data : data.features || [])
          .map((item) => {
            // A. Format OSM Feature
            if (item?.type === "Feature" && item?.properties) {
              const props = item.properties;
              const coords = item.geometry?.coordinates || [];
              const lat = coords[1];
              const lng = coords[0];
              const name = props.name || props["alt_name"] || props["operator"] || "Tanpa Nama";
              
              const addressParts = [];
              if (props["addr:street"]) addressParts.push(props["addr:street"]);
              if (props["addr:housenumber"]) addressParts.push(props["addr:housenumber"]);
              if (props["addr:postcode"]) addressParts.push(props["addr:postcode"]);
              const address = addressParts.join(" ").trim() || props.operator || "";

              return {
                id: item.id || `${lat}-${lng}`,
                name,
                address,
                phone: props.phone || props.phone_number || null,
                category: props.amenity || props.type || null,
                latitude: lat,
                longitude: lng,
                distance:
                  typeof props.distance !== "undefined" && props.distance !== null
                    ? props.distance
                    : (typeof lat === "number" && typeof lng === "number"
                        ? (Math.round(haversineKm(userPos[0], userPos[1], lat, lng) * 10) / 10) + " km"
                        : null),
              };
            }

            // B. Format Prisma / Backend Database
            if (item && item.nama_kantor && typeof item.latitude === "number" && typeof item.longitude === "number") {
              const lat = item.latitude;
              const lng = item.longitude;
              return {
                id: item.id,
                name: item.nama_kantor,
                address: item.alamat || "",
                phone: item.phone || item.telp || null,
                category: item.category || null,
                latitude: lat,
                longitude: lng,
                distance:
                  typeof item.distance !== "undefined" && item.distance !== null
                    ? item.distance
                    : (Math.round(haversineKm(userPos[0], userPos[1], lat, lng) * 10) / 10) + " km",
              };
            }

            return null;
          })
          .filter(Boolean);

        if (mounted.current) setLocations(parsed);

      } catch (err) {
        console.error("Gagal fetch lokasi terdekat:", err);
        if (mounted.current) setLocations([]);
      } finally {
        if (mounted.current) setLoadingBackend(false);
      }
    };

    fetchNearby();
  }, [userPos]);

  return {
    userPos,
    showMap,
    loadingLoc,
    loadingBackend,
    locations,
    selectedLocation,
    setSelectedLocation
  };
};

export default useMaps;