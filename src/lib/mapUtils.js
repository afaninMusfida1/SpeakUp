import L from "leaflet";

export const createPinHtml = ({ color = "#ef4444", size = 32 } = {}) => {
    const stroke = "#ffffff";
    const strokeWidth = 2;
    const svg = encodeURIComponent(`
     <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" >
       <path d="M12 21s6-5.333 6-10a6 6 0 10-12 0c0 4.667 6 10 6 10z" fill="${color}" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
       <path d="M9 12l1.8 1.8L15 9.6" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
     </svg>
    `);
    return `data:image/svg+xml;utf8,${svg}`;
};

export const PinIcon = (color = "#ef4444", size = 36) =>
    L.divIcon({
        className: "custom-pin-icon",
        html: `<img src="${createPinHtml({ color, size })}" style="width:${size}px;height:${size}px;display:block;"/>`,
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size / 2],
    });