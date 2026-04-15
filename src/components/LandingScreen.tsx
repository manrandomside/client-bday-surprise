"use client";

import { motion } from "framer-motion";
import { useGame } from "./GameContext";

export default function LandingScreen() {
  const { targetName, setIsStarted } = useGame();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
    >
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            background: `rgba(244, 63, 94, ${Math.random() * 0.2 + 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Envelope opening animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            className="w-28 h-28 sm:w-36 sm:h-36 text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </motion.div>

        {/* Sparkles around envelope */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-rose-300 rounded-full"
            style={{
              top: ["10%", "15%", "70%", "75%"][i],
              left: ["-10%", "105%", "-15%", "110%"][i],
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-center mb-3"
      >
        Hai, {targetName}!
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-rose-400 text-base sm:text-lg text-center max-w-sm mb-2 leading-relaxed"
      >
        Ada sesuatu yang spesial menunggumu di sini...
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-rose-300 text-sm sm:text-base text-center max-w-xs mb-10"
      >
        Tapi kamu harus menyelesaikan tantangannya dulu!
      </motion.p>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsStarted(true)}
        className="relative group cursor-pointer"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-500 rounded-full opacity-70 group-hover:opacity-100 blur transition-opacity duration-300" />
        <div className="relative px-10 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-bold text-lg shadow-xl">
          Mulai Petualangan
        </div>
      </motion.button>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="mt-6 text-rose-300/60 text-xs"
      >
        Bersiaplah untuk sesuatu yang tak terduga
      </motion.p>
    </motion.div>
  );
}
