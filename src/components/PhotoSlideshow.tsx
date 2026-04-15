"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = Array.from({ length: 14 }, (_, i) => `/game-photos/${i + 1}.jpeg`);

export default function PhotoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  }, []);

  // Auto-advance when open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [isOpen, goNext]);

  return (
    <>
      {/* Trigger button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        className="mt-4 px-6 py-3 bg-white/60 rounded-2xl shadow-md text-rose-500 font-semibold text-sm sm:text-base cursor-pointer flex items-center gap-2"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v12z"
          />
        </svg>
        Lihat Kenangan Kita
      </motion.button>

      {/* Fullscreen slideshow modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/80 px-4"
            style={{ backdropFilter: "blur(10px)" }}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white cursor-pointer z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/90 text-lg sm:text-xl font-semibold mb-4"
            >
              Kenangan Kita Bersama
            </motion.h3>

            {/* Photo container */}
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={PHOTOS[currentIndex]}
                  alt={`Kenangan ${currentIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                  custom={direction}
                  initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              </AnimatePresence>

              {/* Photo counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
                {currentIndex + 1} / {PHOTOS.length}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-6 mt-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goPrev}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </motion.button>

              {/* Dot indicators */}
              <div className="flex gap-1.5">
                {PHOTOS.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                      i === currentIndex ? "bg-white" : "bg-white/30"
                    }`}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goNext}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
