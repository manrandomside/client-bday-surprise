"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./GameContext";
import Confetti from "./Confetti";

type CelebrationStep = "match" | "reveal" | "greeting";

function TypewriterText({
  text,
  delay = 0,
  speed = 35,
  className = "",
  onComplete,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <p className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-[1em] bg-rose-400 ml-0.5 align-text-bottom"
        />
      )}
    </p>
  );
}

const BIRTHDAY_MESSAGES = [
  {
    text: "Di hari spesialmu ini, aku cuma mau bilang...",
    className: "text-rose-700 text-base sm:text-lg leading-relaxed mb-4",
  },
  {
    text: "Kamu itu lebih dari sekadar teman. Kamu adalah orang yang selalu bikin hari-hariku lebih berwarna dan bermakna.",
    className:
      "text-rose-800 text-lg sm:text-xl font-semibold leading-relaxed mb-4",
  },
  {
    text: "Semoga di tahun ini semua impian dan harapanmu tercapai. Semoga selalu bahagia, sehat, dan dikelilingi orang-orang yang menyayangimu.",
    className: "text-rose-600 text-base sm:text-lg leading-relaxed mb-4",
  },
  {
    text: "Terima kasih sudah menjadi bagian terindah dalam hidupku.",
    className: "text-rose-700 text-lg sm:text-xl font-bold",
  },
];

export default function Celebration() {
  const { uploadedPhoto, targetPhoto } = useGame();
  const [step, setStep] = useState<CelebrationStep>("match");
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showSignature, setShowSignature] = useState(false);

  const handleMessageComplete = useCallback(() => {
    setVisibleMessages((prev) => {
      const next = prev + 1;
      if (next >= BIRTHDAY_MESSAGES.length) {
        setTimeout(() => setShowSignature(true), 500);
      }
      return next;
    });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <Confetti count={step === "greeting" ? 100 : 60} />

      <AnimatePresence mode="wait">
        {/* Step 1: Match animation */}
        {step === "match" && (
          <motion.div
            key="match"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center z-10"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.3, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 150,
                damping: 12,
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 mb-8 sm:mb-10 text-center"
            >
              Cocok!
            </motion.h1>

            <div className="flex items-center gap-4 sm:gap-6 mb-8">
              {/* User photo */}
              <motion.div
                initial={{ x: -100, opacity: 0, rotate: -15 }}
                animate={{ x: 0, opacity: 1, rotate: -6 }}
                transition={{
                  delay: 0.6,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500" />
                <div className="relative w-28 h-36 sm:w-36 sm:h-44 md:w-40 md:h-48 rounded-2xl overflow-hidden">
                  {uploadedPhoto ? (
                    <img
                      src={uploadedPhoto}
                      alt="Foto kamu"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center">
                      <span className="text-rose-400 text-3xl">?</span>
                    </div>
                  )}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center text-rose-600 text-xs sm:text-sm font-medium mt-2"
                >
                  Kamu
                </motion.p>
              </motion.div>

              {/* Heart connector */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.0,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                className="text-rose-500 z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Target photo */}
              <motion.div
                initial={{ x: 100, opacity: 0, rotate: 15 }}
                animate={{ x: 0, opacity: 1, rotate: 6 }}
                transition={{
                  delay: 0.6,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400" />
                <div className="relative w-28 h-36 sm:w-36 sm:h-44 md:w-40 md:h-48 rounded-2xl overflow-hidden">
                  <img
                    src={targetPhoto}
                    alt="Pasanganmu"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center text-rose-600 text-xs sm:text-sm font-medium mt-2"
                >
                  Dia
                </motion.p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-rose-500 text-center mb-8 max-w-xs"
            >
              Kalian berdua saling tertarik satu sama lain!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("reveal")}
              className="px-8 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-rose-300/50 cursor-pointer"
            >
              Lanjutkan
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Reveal / Plot twist */}
        {step === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center z-10 text-center max-w-md px-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: 0.2,
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 shadow-lg shadow-amber-300/40"
            >
              <span className="text-3xl sm:text-4xl text-white">!</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-rose-700 mb-4"
            >
              Tunggu dulu...
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-rose-600 text-base sm:text-lg mb-2 leading-relaxed"
            >
              Ini bukan aplikasi cari jodoh beneran kok...
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-rose-500 text-base sm:text-lg mb-8 leading-relaxed"
            >
              Tapi ada sesuatu yang lebih spesial menunggumu!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("greeting")}
              className="px-8 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-rose-300/50 cursor-pointer"
            >
              Lihat Kejutannya
            </motion.button>
          </motion.div>
        )}

        {/* Step 3: Birthday greeting */}
        {step === "greeting" && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center z-10 text-center max-w-lg px-4"
          >
            {/* Animated cake icon */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: 0.2,
              }}
              className="mb-6"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-400 flex items-center justify-center shadow-xl shadow-rose-300/40"
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
                    d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12 8.25a2.25 2.25 0 01-2.25-2.25c0-.844.75-2.25 2.25-3.75 1.5 1.5 2.25 2.906 2.25 3.75A2.25 2.25 0 0112 8.25z"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Birthday title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 10,
              }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 mb-4"
            >
              Selamat Ulang Tahun!
            </motion.h1>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent mb-6"
            />

            {/* Photos together */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center -space-x-4 mb-6"
            >
              <motion.div
                animate={{ rotate: [-3, 3, -3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-rose-400 to-pink-500" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                  {uploadedPhoto ? (
                    <img
                      src={uploadedPhoto}
                      alt="Kamu"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-rose-200 flex items-center justify-center text-rose-400 text-xl">
                      ?
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: [3, -3, 3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-0"
              >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                  <img
                    src={targetPhoto}
                    alt="Dia"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Birthday message with typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="relative max-w-sm"
            >
              <div
                className="absolute -inset-4 rounded-3xl opacity-20"
                style={{
                  background:
                    "linear-gradient(135deg, #f43f5e, #ec4899, #d946ef)",
                  filter: "blur(20px)",
                }}
              />
              <div
                className="relative bg-white/70 rounded-2xl p-6 sm:p-8 text-left"
                style={{ backdropFilter: "blur(10px)" }}
              >
                {BIRTHDAY_MESSAGES.map((msg, i) => {
                  if (i > visibleMessages) return null;
                  const isTyping = i === visibleMessages;
                  const prevCharsTotal = BIRTHDAY_MESSAGES.slice(0, i).reduce(
                    (sum, m) => sum + m.text.length * 35 + 400,
                    0
                  );

                  return isTyping ? (
                    <TypewriterText
                      key={i}
                      text={msg.text}
                      delay={i === 0 ? 800 : 300}
                      speed={35}
                      className={msg.className}
                      onComplete={handleMessageComplete}
                    />
                  ) : (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      className={msg.className}
                    >
                      {msg.text}
                    </motion.p>
                  );
                })}
              </div>
            </motion.div>

            {/* Signature */}
            <AnimatePresence>
              {showSignature && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-6 flex flex-col items-center"
                >
                  <p className="text-rose-400 text-sm italic">
                    Dengan penuh cinta dan doa terbaik,
                  </p>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-rose-500 mt-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glowing orbs background */}
      {step === "greeting" && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="fixed rounded-full pointer-events-none"
              style={{
                width: 100 + i * 60,
                height: 100 + i * 60,
                background: `radial-gradient(circle, ${
                  [
                    "rgba(244,63,94,0.08)",
                    "rgba(236,72,153,0.06)",
                    "rgba(217,70,239,0.05)",
                    "rgba(251,113,133,0.07)",
                    "rgba(249,168,212,0.06)",
                  ][i]
                } 0%, transparent 70%)`,
                left: `${[10, 70, 30, 80, 50][i]}%`,
                top: `${[20, 60, 70, 30, 50][i]}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                x: [0, 30, -20, 0],
                y: [0, -20, 30, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
