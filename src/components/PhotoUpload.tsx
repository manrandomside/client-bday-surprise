"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./GameContext";

type UploadStep = "intro" | "upload" | "preview";

export default function PhotoUpload() {
  const { setUploadedPhoto, setCurrentPhase } = useGame();
  const [step, setStep] = useState<UploadStep>("intro");
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setPreview(compressed);
          setStep("preview");
        }
        setIsProcessing(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleConfirm = useCallback(() => {
    if (preview) {
      setUploadedPhoto(preview);
      setCurrentPhase(3);
    }
  }, [preview, setUploadedPhoto, setCurrentPhase]);

  const handleRetake = useCallback(() => {
    setPreview(null);
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Step 1: Intro */}
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center z-10 max-w-md"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-300/40"
            >
              <svg
                className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-rose-700 mb-3"
            >
              Saatnya Selfie!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-rose-500 mb-2 leading-relaxed"
            >
              Sebelum melanjutkan ke tahap berikutnya, kami butuh foto terbaikmu.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-rose-400 text-sm mb-8"
            >
              Tenang, fotomu akan digunakan untuk sesuatu yang spesial!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("upload")}
              className="px-8 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-rose-300/50 cursor-pointer"
            >
              Ayo Mulai
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Upload */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center z-10 w-full max-w-md"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-bold text-rose-700 mb-2 text-center"
            >
              Unggah Fotomu
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-rose-400 text-sm mb-6 text-center"
            >
              Pilih foto terbaikmu atau seret ke area di bawah
            </motion.p>

            {/* Drop zone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative w-full aspect-square max-w-xs rounded-3xl border-3 border-dashed
                flex flex-col items-center justify-center cursor-pointer
                transition-all duration-300 mb-6
                ${
                  isDragging
                    ? "border-rose-400 bg-rose-100/80 scale-105"
                    : "border-rose-300/60 bg-white/60 hover:border-rose-400 hover:bg-rose-50/80"
                }
              `}
              style={{
                backdropFilter: "blur(8px)",
                boxShadow: isDragging
                  ? "0 0 30px rgba(244, 63, 94, 0.2)"
                  : "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-3 border-rose-300 border-t-rose-500 rounded-full"
                />
              ) : (
                <>
                  <motion.div
                    animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-4"
                  >
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </motion.div>

                  <p className="text-rose-600 font-medium text-sm sm:text-base mb-1">
                    {isDragging ? "Lepaskan di sini!" : "Ketuk untuk memilih foto"}
                  </p>
                  <p className="text-rose-400 text-xs sm:text-sm">
                    atau seret dan lepas foto ke sini
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.div>

            {/* Camera button for mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-3 text-rose-300 text-sm">
                <div className="w-8 h-px bg-rose-200" />
                <span>atau</span>
                <div className="w-8 h-px bg-rose-200" />
              </div>

              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.capture = "user";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) processFile(file);
                  };
                  input.click();
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/80 border border-rose-200 rounded-full text-rose-600 font-medium text-sm hover:bg-rose-50 transition-colors cursor-pointer"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
                Ambil dari Kamera
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Preview */}
        {step === "preview" && preview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center z-10 w-full max-w-md"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-bold text-rose-700 mb-1 text-center"
            >
              Tampak Sempurna!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-rose-400 text-sm mb-6 text-center"
            >
              Pastikan ini foto terbaikmu ya
            </motion.p>

            {/* Photo preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="relative mb-8"
            >
              {/* Decorative ring */}
              <motion.div
                className="absolute -inset-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #f43f5e, #ec4899, #f43f5e)",
                  opacity: 0.2,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #f43f5e, #ec4899, #f472b6)",
                }}
              />

              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden">
                <img
                  src={preview}
                  alt="Foto yang diunggah"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Sparkle accents */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-rose-400 rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: i % 2 === 0 ? "-8px" : "calc(100% + 4px)",
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
            >
              <button
                onClick={handleRetake}
                className="flex-1 px-6 py-3 border-2 border-rose-300 text-rose-500 rounded-full font-medium hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Ganti Foto
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-semibold shadow-lg shadow-rose-300/50 cursor-pointer"
              >
                Lanjutkan
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
