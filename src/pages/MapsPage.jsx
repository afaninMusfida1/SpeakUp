import { useState } from "react";
import { ArrowLeft, Phone, MessageCircle, Navigation, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 

const mockLocations = [
  {
    id: 1,
    name: "Polsek Jakarta Selatan",
    type: "police",
    address: "Jl. TB Simatupang No.1, Jakarta Selatan",
    phone: "110",
    distance: "1.2 km",
    lat: -6.2844,
    lng: 106.8155
  },
  {
    id: 2,
    name: "P2TP2A Jakarta",
    type: "satgas",
    address: "Jl. Merdeka No.15, Jakarta Pusat",
    phone: "(021) 3846543",
    distance: "2.5 km",
    lat: -6.2088,
    lng: 106.8456
  },
  {
    id: 3,
    name: "RS Umum Fatmawati",
    type: "hospital",
    address: "Jl. RS Fatmawati, Cilandak, Jakarta Selatan",
    phone: "(021) 7501524",
    distance: "3.1 km",
    lat: -6.2950,
    lng: 106.7937
  },
  {
    id: 4,
    name: "Polres Metro Jakarta Pusat",
    type: "police",
    address: "Jl. Taman Sari No.58, Jakarta Pusat",
    phone: "110",
    distance: "4.3 km",
    lat: -6.1751,
    lng: 106.8256
  }
];

const PlainButton = ({ children, className, onClick, variant = 'default', ...props }) => {
    let baseStyle = "flex items-center justify-center font-medium transition-colors";
    
    if (variant === 'ghost') {
        baseStyle += " text-gray-700 hover:bg-gray-100 p-2";
    } else {
        baseStyle += " text-white px-4 py-2 shadow-md";
    }

    return (
        <button 
            className={`${baseStyle} ${className}`} 
            onClick={onClick} 
            {...props}
        >
            {children}
        </button>
    );
};

const PlainCard = ({ children, className, onClick, ...props }) => {
    return (
        <div
            className={`bg-white border rounded-2xl shadow-sm ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

const PlainBadge = ({ children, className, ...props }) => {
    return (
        <div
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default function MapsPage({ onStartChat }) { 
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate(); 

  const handleBack = () => {
    navigate(-1); 

  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "police":
        return "🚓";
      case "satgas":
        return "🧑‍⚖️";
      case "hospital":
        return "🏥";
      default:
        return "📍";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "police":
        return "Polisi";
      case "satgas":
        return "Satgas P2TP2A";
      case "hospital":
        return "Rumah Sakit";
      default:
        return "Lokasi";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "police":
        return "bg-blue-100 text-blue-700";
      case "satgas":
        return "bg-purple-100 text-purple-700";
      case "hospital":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <PlainButton 
            variant="ghost" 
            onClick={handleBack} 
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </PlainButton>
          
        </div>
      </div>

      {/* Emergency */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 border-b border-red-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PlainButton 
            className="bg-red-600 hover:bg-red-700 rounded-2xl h-14 gap-2"
            onClick={() => window.open('tel:110')}
          >
            <Phone className="w-5 h-5" />
            📞 Hubungi Darurat (110)
          </PlainButton>
          <PlainButton 
            onClick={onStartChat} 
            className="bg-purple-600 hover:bg-purple-700 rounded-2xl h-14 gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            💬 Chat dengan Satgas
          </PlainButton>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 grid lg:grid-cols-[1fr,400px]">
        <div className="relative bg-gray-100 h-[400px] lg:h-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-8 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>

            {/* Location Mark*/}
            {mockLocations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform focus:outline-none"
                style={{
                  left: `${30 + index * 15}%`,
                  top: `${40 + (index % 2) * 20}%`
                }}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    selectedLocation?.id === location.id 
                      ? 'ring-4 ring-blue-400 scale-110 bg-white' 
                      : 'bg-white'
                  }`}>
                    <span className="text-2xl">{getTypeIcon(location.type)}</span>
                  </div>
                  {selectedLocation?.id === location.id && (
                    <div className="mt-2 bg-white px-3 py-1 rounded-full shadow-lg border border-blue-400">
                      <p className="text-gray-900 whitespace-nowrap text-sm font-medium">
                        {location.name}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            ))}

            {/* User Location */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <PlainButton className="bg-white hover:bg-gray-100 text-gray-900 w-12 h-12 rounded-full shadow-lg p-0 text-xl">
              +
            </PlainButton>
            <PlainButton className="bg-white hover:bg-gray-100 text-gray-900 w-12 h-12 rounded-full shadow-lg p-0 text-xl">
              -
            </PlainButton>
          </div>
        </div>

        {/* Location List Sidebar */}
        <div className="bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Lokasi Bantuan Terdekat</h3>
            <p className="text-sm text-gray-600">
              {mockLocations.length} lokasi ditemukan
            </p>
          </div>

          <div className="p-4 space-y-3">
            {mockLocations.map((location) => (
              <PlainCard
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedLocation?.id === location.id
                    ? 'border-2 border-blue-400 shadow-lg'
                    : 'border-2 border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{getTypeIcon(location.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <PlainBadge className={`${getTypeColor(location.type)} mb-2`}>
                      {getTypeLabel(location.type)}
                    </PlainBadge>
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {location.address}
                    </p>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {location.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedLocation?.id === location.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <PlainButton 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2 h-10 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Menggunakan format link Google Maps standar
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`);
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                      Navigasi
                    </PlainButton>
                    <PlainButton 
                      className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl gap-2 h-10 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${location.phone}`);
                      }}
                    >
                      <Phone className="w-4 h-4" />
                      Hubungi
                    </PlainButton>
                  </div>
                )}
              </PlainCard>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8">
        <PlainButton 
          onClick={() => window.open('tel:110')}
          className="bg-red-600 hover:bg-red-700 w-16 h-16 rounded-full shadow-2xl p-0"
        >
          <Phone className="w-6 h-6" />
        </PlainButton>
      </div>
    </div>
  );
}