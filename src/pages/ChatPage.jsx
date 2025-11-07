import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlainButton = ({ onClick, children, className, variant, disabled, ...props }) => {
  let baseClasses = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

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
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    setTimeout(() => {
      const responses = [
        "Terima kasih sudah berbagi. Saya mendengarkan dengan penuh perhatian. Bisa cerita lebih detail?",
        "Saya memahami perasaanmu. Apa yang kamu rasakan saat ini?",
        "Kamu sangat berani untuk berbagi. Mari kita bahas langkah-langkah yang bisa diambil.",
        "Tidak apa-apa untuk merasa seperti ini. Kamu tidak sendiri. Bagaimana saya bisa membantu lebih lanjut?",
        "Situasi yang kamu alami penting. Apakah kamu dalam kondisi aman saat ini?"
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlainButton 
              variant="ghost" 
              onClick={onBack}
              className="rounded-xl p-2"
            >
              <PlainButton 
              variant="ghost" 
              onClick={handleBack} 
              className="rounded-xl p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </PlainButton>
            </PlainButton>
            
            <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600">
              <span className="text-white text-xl">🧑‍⚖️</span>
            </PlainAvatar>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Satgas SpeakUp</h3>
              <div className="flex items-center gap-1 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PlainButton 
              variant="ghost" 
              className="rounded-xl p-2"
              onClick={() => window.open('tel:110')}
            >
              <Phone className="w-5 h-5 text-red-600" />
            </PlainButton>
            
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
        <p className="text-blue-800 text-sm text-center">
          🔒 Percakapan ini terenkripsi end-to-end. Identitas kamu tidak akan terlihat.
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto">
          {/* Date Divider */}
          <div className="flex items-center justify-center my-6">
            <PlainBadge className="bg-gray-200 text-gray-600 px-4 py-1">
              Hari ini
            </PlainBadge>
          </div>

          {/* Messages */}
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
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
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

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-2 mb-4">
              <PlainAvatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600">
                <span className="text-white text-lg">🧑‍⚖️</span>
              </PlainAvatar>
              <div className="bg-white border-2 border-gray-100 rounded-3xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
          <div className="mb-2 text-center">
            <p className="text-gray-500 text-sm">
              Tulis pesanmu di sini... identitasmu tidak akan terlihat
            </p>
          </div>
          <div className="flex gap-2">
            <PlainInput
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ketik pesan..."
              className="flex-1 rounded-full border-2 border-gray-200 focus:border-blue-400 px-6 h-12"
            />
            <PlainButton
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </PlainButton>
          </div>
        </div>
      </div>
    </div>
  );
}