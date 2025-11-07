import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 

const PlainButton = ({ onClick, children, className, variant, disabled, ...props }) => {
    let baseClasses = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    if (variant === "ghost") {
        baseClasses = "hover:bg-gray-100 hover:text-accent-foreground";
    } else if (variant === "outline") {
        baseClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
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

const PlainCard = ({ onClick, children, className }) => (
    <div 
        onClick={onClick} 
        className={`bg-white shadow-sm rounded-lg ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
        {children}
    </div>
);

const PlainTextarea = ({ value, onChange, placeholder, className, ...props }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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

const mockMenfess = [
  {
    id: 1,
    anonId: "Anonim #892",
    content: "Hari ini aku akhirnya berani cerita ke orang tua tentang apa yang aku alami. Mereka mendengarkan dan mendukungku. Terima kasih SpeakUp sudah memberi aku keberanian. 💙",
    timestamp: new Date(Date.now() - 3600000),
    reactions: { heart: 42, pray: 28, hug: 15 },
    comments: 8
  },
  {
    id: 2,
    anonId: "Anonim #234",
    content: "Kadang aku merasa sendiri, tapi baca menfess di sini bikin aku ngerasa nggak sendirian. Semangat buat kalian semua yang lagi berjuang! 🌟",
    timestamp: new Date(Date.now() - 7200000),
    reactions: { heart: 67, pray: 34, hug: 29 },
    comments: 12
  },
  {
    id: 3,
    anonId: "Anonim #567",
    content: "Buat yang lagi mengalami hal serupa: kamu nggak salah, kamu nggak sendirian, dan bantuan ada di luar sana. Jangan takut untuk speak up.",
    timestamp: new Date(Date.now() - 10800000),
    reactions: { heart: 89, pray: 56, hug: 41 },
    comments: 15
  },
  {
    id: 4,
    anonId: "Anonim #123",
    content: "Edukasi tentang consent di dashboard sangat membantu aku memahami hak-hakku. Semoga lebih banyak orang yang aware tentang ini.",
    timestamp: new Date(Date.now() - 14400000),
    reactions: { heart: 52, pray: 21, hug: 18 },
    comments: 6
  }
];

export default function MenfessPage({ username }) {
  const [menfessList, setMenfessList] = useState(mockMenfess);
  const [newMenfess, setNewMenfess] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const navigate = useNavigate(); 

  const handleBack = () => {
    navigate('/dashboard');
    // Atau bisa menggunakan navigate(-1);
  };


  const handlePostMenfess = () => {
    if (!newMenfess.trim()) return;

    const newPost = {
      id: menfessList.length + 1,
      anonId: "Anonim #" + Math.floor(Math.random() * 1000), 
      content: newMenfess,
      timestamp: new Date(),
      reactions: { heart: 0, pray: 0, hug: 0 },
      comments: 0
    };

    setMenfessList([newPost, ...menfessList]);
    setNewMenfess("");
    setShowCompose(false);
  };

  const handleReaction = (id, reactionType) => {
    setMenfessList(menfessList.map(menfess => {
      if (menfess.id === id) {
        const newReactions = { ...menfess.reactions };
        if (menfess.userReacted === reactionType) {
          newReactions[reactionType]--;
          return { ...menfess, reactions: newReactions, userReacted: undefined };
        } else {
          if (menfess.userReacted) {
            newReactions[menfess.userReacted]--;
          }
          newReactions[reactionType]++;
          return { ...menfess, reactions: newReactions, userReacted: reactionType };
        }
      }
      return menfess;
    }));
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    return `${Math.floor(seconds / 86400)} hari lalu`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlainButton 
              variant="ghost" 
              onClick={handleBack} 
              className="rounded-xl p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </PlainButton>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Menfess Aman</h2>
              <p className="text-sm text-gray-600">Ruang berbagi tanpa nama</p>
            </div>
          </div>
          <a 
            className="text-red-600 hover:text-red-700 font-medium"
          >
            🚨 Butuh bantuan
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            🕊️ Berbagi Cerita. Tanpa Nama, Tapi dengan Hati.
          </h1>
          <p className="text-gray-600">
            Di sini kamu bisa berbagi pengalaman, perasaan, atau cerita tanpa khawatir identitasmu terungkap.
          </p>
        </div>

        {/* Compose Menfess */}
        {!showCompose ? (
          <PlainCard className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-100 mb-6">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full text-left flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-white text-xl">👤</span>
              </PlainAvatar>
              <span className="text-gray-500">Tuliskan ceritamu di sini...</span>
            </button>
          </PlainCard>
        ) : (
          <PlainCard className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-blue-200 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0">
                <span className="text-white text-xl">👤</span>
              </PlainAvatar>
              <div className="flex-1">
                <p className="text-gray-900 font-semibold mb-1">Anonim</p>
                <PlainBadge className="bg-blue-100 text-blue-700">Anonim</PlainBadge>
              </div>
            </div>

            <PlainTextarea
              value={newMenfess}
              onChange={(e) => setNewMenfess(e.target.value)}
              placeholder="Tulis cerita, perasaan, atau pengalamanmu di sini... Ingat, identitasmu tidak akan terlihat."
              className="min-h-[120px] rounded-2xl border-2 border-gray-200 focus:border-blue-400 mb-4 resize-none"
            />

            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                {newMenfess.length} karakter
              </p>
              <div className="flex gap-2">
                <PlainButton
                  variant="outline"
                  onClick={() => {
                    setShowCompose(false);
                    setNewMenfess("");
                  }}
                  className="rounded-2xl"
                >
                  Batal
                </PlainButton>
                <PlainButton
                  onClick={handlePostMenfess}
                  disabled={!newMenfess.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl gap-2"
                >
                  <Send className="w-4 h-4" />
                  Publikasikan Anonim
                </PlainButton>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-blue-800 text-sm">
                💙 Menfess kamu akan dipublikasikan secara anonim. Identitas kamu terlindungi.
              </p>
            </div>
          </PlainCard>
        )}

        {/* Menfess Feed */}
        <div className="space-y-4">
          {menfessList.map((menfess) => (
            <PlainCard key={menfess.id} className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-100 hover:border-gray-200 transition-all">
              {/* Menfess Header */}
              <div className="flex items-start gap-3 mb-4">
                <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                  <span className="text-white text-xl">👤</span>
                </PlainAvatar>
                <div>
                  <p className="text-gray-900 font-semibold">{menfess.anonId}</p>
                  <p className="text-sm text-gray-500">{formatTimeAgo(menfess.timestamp)}</p>
                </div>
              </div>

              {/* Menfess Content */}
              <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                {menfess.content}
              </p>

              {/* Reactions & Comments */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleReaction(menfess.id, 'heart')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm ${
                      menfess.userReacted === 'heart'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${menfess.userReacted === 'heart' ? 'fill-current' : ''}`} />
                    <span>{menfess.reactions.heart}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(menfess.id, 'pray')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm ${
                      menfess.userReacted === 'pray'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    <span>🙏</span>
                    <span>{menfess.reactions.pray}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(menfess.id, 'hug')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm ${
                      menfess.userReacted === 'hug'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
                    }`}
                  >
                    <span>🤗</span>
                    <span>{menfess.reactions.hug}</span>
                  </button>
                </div>

                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>{menfess.comments}</span>
                </button>
              </div>
            </PlainCard>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-100 text-center">
          <p className="text-gray-700">
            💙 Kamu nggak sendiri. Cerita kamu penting. Kami mendengarkan.
          </p>
        </div>
      </div>
    </div>
  );
}