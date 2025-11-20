import React from "react";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import useMenfess from "../hooks/useMenfess";

const PlainButton = ({ onClick, children, className = "", variant, disabled, ...props }) => {
  let baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  if (variant === "ghost") baseClasses = "hover:bg-gray-100 hover:text-accent-foreground";
  if (variant === "outline") baseClasses = "border border-gray-300 bg-white hover:bg-gray-50";

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

const PlainCard = ({ onClick, children, className = "" }) => (
  <div onClick={onClick} className={`bg-white shadow-md rounded-2xl ${className} ${onClick ? "cursor-pointer" : ""}`}>
    {children}
  </div>
);

const PlainTextarea = ({ value, onChange, placeholder, className = "", ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    {...props}
  />
);

const PlainAvatar = ({ children, className = "" }) => (
  <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>{children}</div>
);

const PlainBadge = ({ children, className = "" }) => (
  <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${className}`}>{children}</div>
);

// ====================================================================
// MAIN COMPONENT
// ====================================================================

const MenfessPage = () => {
  // Menggunakan Hook
  const {
    menfessList,
    newMenfess, setNewMenfess,
    showCompose, setShowCompose,
    visibleComments,
    newComments, setNewComments,
    loading,
    loadingReplies,
    error, setError,
    handleBack,
    handlePostMenfess,
    handleAddComment,
    toggleComments,
    formatTimeAgo
  } = useMenfess();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar backButton={true} title="Menfess" showUrgent={true} onBack={handleBack} />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <section className="py-5">
          <div className="max-w-xl mx-auto text-center px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">🕊️ Berbagi Cerita Tanpa Nama</h1>
            <p className="text-gray-600 text-base">
              Bagikan pengalaman atau perasaanmu dengan aman. Identitasmu tetap rahasia.
            </p>
          </div>
        </section>

        {!showCompose ? (
          <PlainCard className="p-6 mb-6 bg-white/90 backdrop-blur-md border-2 border-gray-100 hover:shadow-lg transition-shadow">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-white text-xl">👤</span>
              </PlainAvatar>
              <span className="text-gray-500">Tuliskan ceritamu di sini...</span>
            </button>
          </PlainCard>
        ) : (
          <PlainCard className="p-6 mb-6 bg-white/90 backdrop-blur-md border-2 border-blue-200 shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600">
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
              placeholder="Tulis cerita atau perasaanmu..."
              className="min-h-[120px] rounded-2xl border-2 border-gray-200 focus:border-blue-400 mb-4 resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">{newMenfess.length} karakter</p>
              <div className="flex gap-2">
                <PlainButton
                  variant="outline"
                  onClick={() => {
                    setShowCompose(false);
                    setNewMenfess("");
                  }}
                  className="rounded-2xl px-5 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Batal
                </PlainButton>
                <PlainButton
                  onClick={handlePostMenfess}
                  disabled={!newMenfess.trim()}
                  className="rounded-2xl px-5 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Publikasikan
                </PlainButton>
              </div>
            </div>
          </PlainCard>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-3 underline text-xs"
            >
              tutup
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {menfessList.length === 0 && (
              <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-gray-100 text-center text-gray-500">
                Belum ada menfess — jadilah yang pertama berbagi.
              </div>
            )}

            {menfessList.map((menfess) => (
              <PlainCard key={menfess.id} className="p-6 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <PlainAvatar className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400">
                    <span className="text-white text-xl">👤</span>
                  </PlainAvatar>
                  <div>
                    <p className="text-gray-900 font-semibold">{menfess.creator}</p>
                    <p className="text-sm text-gray-500">{formatTimeAgo(menfess.created_at)}</p>
                  </div>
                </div>

                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{menfess.content}</p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleComments(menfess.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{(menfess.comments || []).length}</span>
                      </button>
                    </div>

                    <div className="text-sm text-gray-400"></div>
                  </div>

                  {visibleComments[menfess.id] && (
                    <div className="mt-3 space-y-2 pl-12">
                      {loadingReplies[menfess.id] ? (
                        <div className="text-sm text-gray-400">Memuat komentar...</div>
                      ) : (menfess.comments || []).length > 0 ? (
                        [...(menfess.comments || [])].reverse().map((comment) => (
                          <div key={comment.id ?? JSON.stringify(comment)} className="bg-gray-100 p-3 rounded-lg text-gray-700 text-sm">
                            <div className="flex justify-between items-start gap-2">
                              <div className="text-sm font-semibold text-gray-800">{comment.creator ?? "Anonim"}</div>
                              <div className="text-xs text-gray-400">{formatTimeAgo(comment.created_at)}</div>
                            </div>
                            <div className="mt-1 text-gray-700">{comment.content ?? ""}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">Belum ada komentar.</p>
                      )}

                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Tulis komentar..."
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={newComments[menfess.id] || ""}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [menfess.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleAddComment(menfess.id)}
                        />
                        <PlainButton onClick={() => handleAddComment(menfess.id)} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                          Kirim
                        </PlainButton>
                      </div>
                    </div>
                  )}
                </div>
              </PlainCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenfessPage;