import React, { useState, useRef, useEffect } from "react";
import { 
    ArrowRight, 
    CheckCircle, 
    AlertTriangle, 
    Zap, 
    Star, 
    Play,
    Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import useDashboardData from "../hooks/useDashboardData";

// --- DATA DUMMY (DIPERBANYAK BIAR ACAKNYA BERASA) ---
const QUESTION_POOL = [
  { id: 1, text: "Pasangan minta password HP kamu buat 'cek kesetiaan'.", type: "red", feedback: "Privasi itu HAK! Percaya gak butuh password.", subtext: "Digital Privacy" },
  { id: 2, text: "Dia support hobimu walau dia gak terlalu paham.", type: "green", feedback: "Ini tanda pasangan yang dewasa & suportif.", subtext: "Support System" },
  { id: 3, text: "Tiba-tiba ngambek & diem berhari-hari (Silent Treatment).", type: "red", feedback: "Manipulasi emosi biar kamu ngerasa bersalah.", subtext: "Emotional Abuse" },
  { id: 4, text: "Selalu diskusi dulu sebelum bikin keputusan besar berdua.", type: "green", feedback: "Komunikasi sehat adalah kunci!", subtext: "Healthy Communication" },
  { id: 5, text: "Nglarang kamu main sama temen-temenmu.", type: "red", feedback: "Isolasi sosial itu tanda bahaya besar!", subtext: "Possessive" },
  { id: 6, text: "Dia ngancem putus tiap kali kalian berantem kecil.", type: "red", feedback: "Ini bentuk manipulasi biar kamu nurut.", subtext: "Threats" },
  { id: 7, text: "Mau mengakui kesalahan dan minta maaf duluan.", type: "green", feedback: "Tanda kedewasaan emosional.", subtext: "Accountability" },
  { id: 8, text: "Sering ngeremehin pencapaian/pekerjaan kamu.", type: "red", feedback: "Pasangan harusnya bangga, bukan iri/ngeremehin.", subtext: "Verbal Abuse" },
  { id: 9, text: "Menghormati kata 'TIDAK' dari kamu tanpa maksa.", type: "green", feedback: "Consent adalah pondasi hubungan sehat.", subtext: "Consent" },
  { id: 10, text: "Cemburu buta sama sepupu atau saudara kandungmu.", type: "red", feedback: "Cemburu irasional itu red flag parah.", subtext: "Jealousy" },
];

// ACAK DAN AMBIL 3 SOAL
const fetchQuestions = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Algoritma Fisher-Yates Shuffle sederhana
            const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
            resolve(shuffled.slice(0, 3)); 
        }, 500); 
    });
};

const Game = () => {
  const { handleGoToProfile } = useDashboardData();
  const navigate = useNavigate();

  // --- STATE ---
  const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, finished
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // XP GLOBAL (LOCAL STORAGE)
  const [currentXP, setCurrentXP] = useState(0);

  // DRAG STATE
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState(null); 
  const [feedbackData, setFeedbackData] = useState(null);
  
  // SESSION SCORE
  const [sessionXP, setSessionXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  
  const cardRef = useRef(null);

  // Load awal
  useEffect(() => {
    const savedXP = localStorage.getItem('userXP');
    if (savedXP) setCurrentXP(parseInt(savedXP));
    
    // Load soal pertama kali
    loadNewGameData();
  }, []);

  // Fungsi khusus Load Data
  const loadNewGameData = async () => {
    setIsLoading(true);
    const data = await fetchQuestions();
    setQuestions(data);
    setIsLoading(false);
  };

  // Logic Start Game (Masuk Phase Playing)
  const startGame = () => {
    setGamePhase('playing');
    setSessionXP(0);
    setCorrectCount(0);
    setCurrentIndex(0);
  };

  // Logic Restart / Main Lagi
  const handleRestart = async () => {
    // 1. Balikin ke fase Intro atau Loading dulu
    setGamePhase('intro'); 
    setFeedback(null); // Reset feedback nyangkut
    setDragPos({ x: 0, y: 0 }); // Reset posisi kartu

    // 2. Ambil soal baru
    await loadNewGameData(); 

    // 3. Reset Score Sesi (XP Global jangan direset)
    setSessionXP(0);
    setCorrectCount(0);
    setCurrentIndex(0);
  };

  // Update XP Global saat Finish
  useEffect(() => {
    if (gamePhase === 'finished') {
        const newTotalXP = currentXP + sessionXP;
        setCurrentXP(newTotalXP);
        localStorage.setItem('userXP', newTotalXP.toString());
    }
  }, [gamePhase]);

  // --- DRAG LOGIC ---
  const handleStart = (e) => {
    if (feedback) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    if (cardRef.current) cardRef.current.startX = clientX;
  };

  const handleMove = (e) => {
    if (!isDragging || !cardRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - cardRef.current.startX;
    setDragPos({ x: deltaX, y: 0 });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragPos.x > 100) handleSwipe('right');
    else if (dragPos.x < -100) handleSwipe('left');
    else setDragPos({ x: 0, y: 0 }); 
  };

  const handleSwipe = (direction) => {
    const currentCard = questions[currentIndex];
    const isRedFlag = currentCard.type === 'red';
    let isCorrect = (direction === 'left' && isRedFlag) || (direction === 'right' && !isRedFlag);

    if (isCorrect) {
        setSessionXP(prev => prev + 5); 
        setCorrectCount(prev => prev + 1);
    }

    setFeedbackData({ isCorrect, text: currentCard.feedback });
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setDragPos({ x: direction === 'left' ? -1000 : 1000, y: 0 }); 
  };

  const nextCard = () => {
    setFeedback(null);
    setDragPos({ x: 0, y: 0 });
    if (currentIndex + 1 >= questions.length) setGamePhase('finished');
    else setCurrentIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
    return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const rotation = dragPos.x * 0.05;
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen font-sans bg-slate-900 flex flex-col text-white overflow-hidden">
      
      {/* NAVBAR */}
      <div className="px-4 py-4 flex justify-between items-center bg-slate-800/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
         <div className="flex items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition">
                <ArrowRight className="rotate-180 text-white" size={20} />
            </button>
            <span className="font-bold text-lg tracking-wide">RedFlag<span className="text-red-500">Detector</span></span>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/50">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-300">{currentXP} XP</span>
            </div>
         </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative px-4 w-full max-w-md mx-auto">
        
        {/* Background Glow */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />

        {/* --- INTRO --- */}
        {!isLoading && gamePhase === 'intro' && (
            <div className="relative z-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] rotate-6">
                    <Zap size={48} className="text-white drop-shadow-md" fill="currentColor" />
                </div>
                <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">SIAP MAIN?</h1>
                <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                   3 Soal Cepat.<br/>Tebak Red Flag atau Green Flag.
                </p>
                <button onClick={startGame} className="w-full py-4 bg-white text-slate-900 font-black text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                    <Play fill="black" size={20} /> GAS MULAI!
                </button>
            </div>
        )}

        {/* --- GAMEPLAY --- */}
        {!isLoading && gamePhase === 'playing' && (
            <div className="w-full h-full flex flex-col justify-center">
                
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                {/* CARD AREA */}
                <div className="relative w-full h-[420px] mb-8">
                    {/* Feedback Overlay */}
                    {feedback && (
                        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center p-6 text-center border border-white/10 animate-in zoom-in-95 duration-200">
                            <div className={`mb-4 p-4 rounded-full ${feedbackData.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {feedbackData.isCorrect ? <CheckCircle size={50} /> : <AlertTriangle size={50} />}
                            </div>
                            <h2 className="text-3xl font-black mb-2 text-white">{feedbackData.isCorrect ? 'CAKEP!' : 'SALAH!'}</h2>
                            <p className="text-slate-300 text-sm mb-6">{feedbackData.text}</p>
                            <button onClick={nextCard} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer z-50">
                                Lanjut <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Active Card */}
                    {questions[currentIndex] && (
                        <div 
                            ref={cardRef}
                            className="absolute inset-0 bg-slate-800/80 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl cursor-grab active:cursor-grabbing"
                            style={{ 
                                transform: `translate(${dragPos.x}px, ${dragPos.y}px) rotate(${rotation}deg)`,
                                transition: isDragging ? 'none' : 'transform 0.4s ease-out'
                            }}
                            onMouseDown={handleStart}
                            onTouchStart={handleStart}
                        >
                            <div className="bg-slate-700/50 px-4 py-1.5 rounded-full border border-white/10 mb-6">
                                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                                    {questions[currentIndex].subtext}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold leading-relaxed mb-auto mt-4 text-white drop-shadow-sm select-none">
                                "{questions[currentIndex].text}"
                            </h3>

                            {/* --- BUTTONS INSIDE CARD --- */}
                            <div className="w-full flex justify-between items-center mt-8 border-t border-white/5 pt-6">
                                <button 
                                    onMouseDown={(e) => e.stopPropagation()} 
                                    onClick={(e) => { e.stopPropagation(); handleSwipe('left'); }}
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 border border-transparent hover:border-red-500/20"
                                >
                                    &larr; Red Flag
                                </button>
                                
                                <button 
                                    onMouseDown={(e) => e.stopPropagation()} 
                                    onClick={(e) => { e.stopPropagation(); handleSwipe('right'); }}
                                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 border border-transparent hover:border-green-500/20"
                                >
                                    Green Flag &rarr;
                                </button>
                            </div>

                            {/* Overlay Indikator */}
                            <div className="absolute top-6 right-6 border-4 border-red-500 text-red-500 font-black text-xl px-2 rounded rotate-12 opacity-0 pointer-events-none" style={{ opacity: Math.abs(Math.min(0, dragPos.x)) / 100 }}>RED FLAG</div>
                            <div className="absolute top-6 left-6 border-4 border-green-500 text-green-500 font-black text-xl px-2 rounded -rotate-12 opacity-0 pointer-events-none" style={{ opacity: Math.max(0, dragPos.x) / 100 }}>GREEN FLAG</div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- FINISHED --- */}
        {!isLoading && gamePhase === 'finished' && (
            <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 text-center w-full animate-in zoom-in-95">
                <Trophy size={64} className="text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce" />
                <h2 className="text-4xl font-black text-white mb-2">+{sessionXP} XP</h2>
                <p className="text-slate-400 text-sm mb-8">Benar {correctCount} dari {questions.length} soal!</p>
                
                <div className="p-4 bg-slate-900/50 rounded-xl mb-6 border border-white/5">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Total XP Kamu</p>
                    <p className="text-2xl font-bold text-yellow-400">{currentXP} XP</p>
                </div>
                
                {/* BUTTON RESET BENERAN */}
                <button onClick={handleRestart} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mb-3 hover:bg-blue-500 transition-colors">
                    Main Lagi
                </button>
                <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                    Dashboard
                </button>
            </div>
        )}

      </main>
    </div>
  );
};

export default Game;