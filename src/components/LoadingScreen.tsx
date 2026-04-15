"use client";

import { motion } from "framer-motion";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        /* exit handles fade */
      }}
    >
      {/* Pulsing heart */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 0.9, 1], opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="text-rose-400"
        >
          <svg className="w-20 h-20 sm:w-24 sm:h-24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-rose-300"
            style={{ margin: -10 - i * 15 }}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-rose-400 text-sm sm:text-base font-medium tracking-wider"
      >
        Menyiapkan kejutan...
      </motion.p>

      {/* Loading bar */}
      <motion.div className="mt-4 w-40 h-1 bg-rose-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      </motion.div>
    </motion.div>
  );
}
