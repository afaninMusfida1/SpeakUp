import React from "react";
import { MapPin } from "lucide-react"; 

export const PlainButton = ({ onClick, children, className = "", variant, disabled, ...props }) => {
    let baseClasses =
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    if (variant === "ghost") baseClasses = "hover:bg-gray-100 hover:text-accent-foreground";

    return (
        <button onClick={onClick} className={`${baseClasses} ${className}`} disabled={disabled} {...props}>
            {children}
        </button>
    );
};

export const PlainInput = ({ value, onChange, onKeyPress, placeholder, className = "", ...props }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${className}`}
        {...props}
    />
);

export const PlainAvatar = ({ children, className = "" }) => (
    <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>
        {children}
    </div>
);

export const PlainBadge = ({ children, className = "" }) => (
    <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}>
        {children}
    </div>
);

export const LocationPreview = ({ lat, lng, isMyMessage }) => {
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    return (
        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="block mt-2">
            <div className={`w-[200px] h-[150px] overflow-hidden rounded-xl border-4 ${isMyMessage ? 'border-blue-700' : 'border-gray-200'} relative`}>
                
                <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-center p-2">
                    <MapPin className="w-6 h-6 text-red-500 mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Lokasi Dibagikan</p>
                    <p className="text-xs text-gray-500">({lat.toFixed(4)}, {lng.toFixed(4)})</p>
                </div>

                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <PlainBadge className="bg-white text-blue-600 shadow-lg border border-gray-100">
                        Buka Peta
                    </PlainBadge>
                </div>
            </div>
        </a>
    );
};