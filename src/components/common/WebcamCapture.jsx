import React, { useCallback, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // IMPORT PENTING
import Webcam from 'react-webcam';
import { RefreshCw, Check, ArrowLeft } from 'lucide-react';
import { PlainButton } from './UI'; 

const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: "user"
};

const WebcamCapture = ({ onCapture, onClose }) => {
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const [domReady, setDomReady] = useState(false);

    useEffect(() => {
        setDomReady(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const triggerFlash = () => {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150);
    };

    const capture = useCallback(() => {
        triggerFlash();
        const capturedImage = webcamRef.current.getScreenshot();
        setTimeout(() => setImageSrc(capturedImage), 50);
    }, [webcamRef]);

    const sendImage = () => { if (imageSrc) onCapture(imageSrc); };
    const retake = () => { setImageSrc(null); };

    const cameraUI = (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center animate-in fade-in duration-200">
            
            {/* --- HEADER --- */}
            <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-50">
                <button 
                    onClick={onClose}
                    className="group flex items-center gap-2 pl-2 pr-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-all active:scale-95 border border-zinc-800"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Kembali</span>
                </button>
                <div className="text-zinc-400 font-medium tracking-wide text-xs bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                    {imageSrc ? "Preview Foto" : "Ambil Foto"}
                </div>
            </div>

            {/* --- AREA KAMERA --- */}
            <div className="relative w-full max-w-[350px] aspect-square mx-6 group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-[2rem] blur-md opacity-75"></div>
                
                <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
                    <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-200 ${isFlashing ? 'opacity-100' : 'opacity-0'}`} />

                    {imageSrc ? (
                        <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                            />
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                                <div className="border-r border-white/10"></div>
                                <div className="border-r border-white/10"></div>
                                <div></div>
                                <div className="border-t border-white/10 col-span-3 mt-[33%]"></div>
                                <div className="border-t border-white/10 col-span-3 mt-[33%]"></div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- FOOTER CONTROLS --- */}
            <div className="absolute bottom-10 w-full px-8 flex justify-center items-center">
                {imageSrc ? (
                    <div className="flex gap-4 w-full max-w-[350px] animate-in slide-in-from-bottom-4 duration-300">
                        <PlainButton 
                            onClick={retake}
                            className="flex-1 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 border border-zinc-800"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Ulangi</span>
                        </PlainButton>
                        <PlainButton 
                            onClick={sendImage}
                            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            <span>Gunakan</span>
                        </PlainButton>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={capture}
                            className="relative group transition-transform active:scale-95"
                        >
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-20 h-20 rounded-full border-[5px] border-white/20 flex items-center justify-center bg-transparent">
                                <div className="w-[66px] h-[66px] bg-white rounded-full shadow-inner transition-all duration-300 group-hover:scale-90 group-active:scale-75"></div>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Ini bikin dia "lepas" dari layout parent, jadi pasti di paling atas.
    if (!domReady) return null;
    
    return createPortal(cameraUI, document.body);
};

export default WebcamCapture;