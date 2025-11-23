import React, { useEffect } from "react"; // Tambah useEffect
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import Swal from "sweetalert2"; // Import SweetAlert

import Navbar from "../components/Navbar";
import useMenfess from "../hooks/useMenfess";

// --- UI COMPONENTS (Tidak Berubah) ---
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

  // --- 1. EFFECT: Handle ERROR dengan SweetAlert ---
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
        confirmButtonColor: '#ef4444', // Red-500
        confirmButtonText: 'Tutup'
      }).then(() => {
        // Reset error state setelah alert ditutup
        setError(null);
      });
    }
  }, [error, setError]);

  // --- 2. WRAPPER: Handle POST Menfess dengan SweetAlert Sukses ---
  const onSubmitMenfess = async () => {
    if (!newMenfess.trim()) return;

    try {
        // Kita asumsikan handlePostMenfess mengembalikan Promise
        // Jika hook useMenfess Anda tidak return Promise, kode ini tetap jalan tapi flow-nya mungkin perlu disesuaikan.
        await handlePostMenfess();

        // Jika sukses (tidak masuk catch di dalam hook dan tidak set error)
        Swal.fire({
            icon: 'success',
            title: 'Terkirim!',
            text: 'Ceritamu berhasil dipublikasikan secara anonim.',
            timer: 2000,
            showConfirmButton: false,
            position: 'center',
            background: '#fff',
            iconColor: '#9333ea' // Purple-600 sesuai tema
        });
        
    } catch (err) {
        // Error biasanya sudah dihandle oleh state `error` dan useEffect di atas
        console.error("Failed post", err);
    }
  };

  // --- 3. WRAPPER: Handle POST Comment dengan SweetAlert Sukses ---
  const onSubmitComment = async (menfessId) => {
    if (!newComments[menfessId]?.trim()) return;

    try {
        await handleAddComment(menfessId);
        
        const Toast = Swal.mixin({
            toast: true,
            // UBAH DISINI: Dari 'top-end' jadi 'bottom-end'
            position: 'bottom-end', 
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            // Opsional: Tambah margin sedikit biar ga nempel banget sama pinggir layar
            didOpen: (toast) => {
                toast.style.marginBottom = '20px';
                toast.style.marginRight = '20px';
            }
        });
          
        Toast.fire({
            icon: 'success',
            title: 'Komentar terkirim'
        });
    } catch (err) {
        console.error("Failed comment", err);
    }
  };

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
          <PlainCard className="p-6 mb-6 bg-white/90 backdrop-blur-md border-2 border-blue-200 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                  // UPDATE: Menggunakan Wrapper onSubmitMenfess
                  onClick={onSubmitMenfess}
                  disabled={!newMenfess.trim() || loading}
                  className="rounded-2xl px-5 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Publikasikan
                </PlainButton>
              </div>
            </div>
          </PlainCard>
        )}

        {/* ERROR BLOCK LAMA DIHAPUS KARENA SUDAH PAKAI SWEETALERT */}

        {loading && menfessList.length === 0 ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {menfessList.length === 0 && !loading && (
              <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-gray-100 text-center text-gray-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-2xl">📭</div>
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

                <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">{menfess.content}</p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleComments(menfess.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all text-sm border border-transparent hover:border-purple-100"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{(menfess.comments || []).length} Komentar</span>
                      </button>
                    </div>
                  </div>

                  {visibleComments[menfess.id] && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div className="pl-4 border-l-2 border-gray-100 space-y-3">
                        {loadingReplies[menfess.id] ? (
                          <div className="text-sm text-gray-400 italic">Memuat komentar...</div>
                        ) : (menfess.comments || []).length > 0 ? (
                          [...(menfess.comments || [])].reverse().map((comment) => (
                            <div key={comment.id ?? Math.random()} className="bg-gray-50 p-3 rounded-r-xl rounded-bl-xl text-gray-700 text-sm">
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <div className="text-xs font-bold text-purple-700">{comment.creator ?? "Anonim"}</div>
                                <div className="text-[10px] text-gray-400">{formatTimeAgo(comment.created_at)}</div>
                              </div>
                              <div className="text-gray-800">{comment.content ?? ""}</div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-xs italic py-2">Belum ada komentar. Jadilah yang pertama!</p>
                        )}
                      </div>

                      <div className="flex gap-2 mt-2 pt-2">
                        <input
                          type="text"
                          placeholder="Tulis komentar..."
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition-all"
                          value={newComments[menfess.id] || ""}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [menfess.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && onSubmitComment(menfess.id)}
                        />
                        <PlainButton 
                          // UPDATE: Menggunakan Wrapper onSubmitComment
                          onClick={() => onSubmitComment(menfess.id)} 
                          disabled={!newComments[menfess.id]}
                          className="bg-purple-600 text-white hover:bg-purple-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
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