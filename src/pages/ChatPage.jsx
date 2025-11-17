import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Camera, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PlainButton = ({ onClick, children, className, variant, disabled, ...props }) => {
  let baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  if (variant === "ghost") {
    baseClasses = "hover:bg-gray-100 hover:text-accent-foreground";
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const PlainInput = ({ value, onChange, onKeyPress, placeholder, className, ...props }) => (
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

const PlainAvatar = ({ children, className }) => (
  <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>
    {children}
  </div>
);

const PlainBadge = ({ children, className }) => (
  <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </div>
);

export default function ChatPage({ username, onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo, saya dari tim Satgas SpeakUp. Saya di sini untuk mendengarkan dan membantu. Kamu aman di sini, dan semua percakapan kita bersifat rahasia. Mau cerita apa yang sedang kamu alami?",
      sender: "satgas",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send Text
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulasi balasan
    setTimeout(() => {
      const responses = [
        "Terima kasih sudah berbagi. Saya mendengarkan dengan penuh perhatian.",
        "Saya memahami perasaanmu. Apa yang kamu rasakan saat ini?",
        "Kamu sangat berani untuk bercerita. Kita cari solusi bersama, ya.",
        "Tidak apa-apa merasa seperti itu. Kamu tidak sendiri.",
        "Apakah kamu dalam kondisi aman saat ini?"
      ];

      const satgasMessage = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "satgas",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, satgasMessage]);
      setIsTyping(false);
    }, 2000);
  };

  // Send Image
  const handleSendImage = (file) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    const newMessage = {
      id: messages.length + 1,
      image: imageUrl,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    scrollToBottom();
  };

  // Share location
  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Perangkat kamu tidak mendukung lokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const newMessage = {
          id: messages.length + 1,
          location: { lat: latitude, lng: longitude },
          sender: "user",
          timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        scrollToBottom();
      },
      () => alert("Gagal mengambil lokasi. Pastikan izin lokasi aktif.")
    );
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const handleBackPage = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
      backButton={true}
      title="Satgas SpeakUp"
      />


      {/* Privacy */}
      {/* <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 text-center text-sm text-blue-800">
        🔒 Percakapan ini terenkripsi. Identitas kamu aman.
      </div> */}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center my-6">
            <PlainBadge className="bg-gray-200 text-gray-600 px-4 py-1">Hari ini</PlainBadge>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "satgas" && (
                <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600">
                  <span className="text-white text-lg">🧑‍⚖️</span>
                </PlainAvatar>
              )}

              <div
                className={`max-w-[70%] rounded-3xl px-4 py-3 text-sm ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-900 border-2 border-gray-100 rounded-bl-md"
                }`}
              >
                {/* Text */}
                {message.text && <p>{message.text}</p>}

                {/* Image */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Foto"
                    className="rounded-xl mt-2 max-w-[200px] border"
                  />
                )}

                {/* Location */}
                {message.location && (
                  <a
                    href={`https://www.google.com/maps?q=${message.location.lat},${message.location.lng}`}
                    target="_blank"
                    className="text-blue-200 underline mt-2 block"
                  >
                    📍 Lihat lokasi di Google Maps
                  </a>
                )}

                <p
                  className={`mt-1 text-xs ${
                    message.sender === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.sender === "user" && (
                <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600">
                  <span className="text-white text-lg">👤</span>
                </PlainAvatar>
              )}
            </div>
          ))}

          {/* Typing */}
          {isTyping && (
            <div className="flex items-end gap-2 mb-4">
              <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600">
                <span className="text-white text-lg">🧑‍⚖️</span>
              </PlainAvatar>
              <div className="bg-white border-2 border-gray-100 rounded-3xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500 text-center text-sm mb-1">
            Tulis pesan atau kirim foto/lokasi...
          </p>

          <div className="flex items-center gap-3">

            {/* Foto - modern minimalis */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 
                         active:scale-95 transition-all duration-150"
            >
              <Camera className="w-5 h-5 text-gray-700" />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleSendImage(e.target.files[0])}
            />

            {/* Lokasi - modern minimalis */}
            <button
              onClick={handleShareLocation}
              className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 
                         active:scale-95 transition-all duration-150"
            >
              <MapPin className="w-5 h-5 text-gray-700" />
            </button>

            {/* Input text */}
            <PlainInput
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ketik pesan..."
              className="flex-1 rounded-full border-2 h-12 px-4"
            />

            {/* Send */}
            <PlainButton
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0"
            >
              <Send className="w-5 h-5" />
            </PlainButton>
          </div>
        </div>
      </div>
    </div>
  );
}
