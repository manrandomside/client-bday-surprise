"use client";

import { useState } from "react";
import { GameProvider, useGame } from "@/components/GameContext";
import FloatingHearts from "@/components/FloatingHearts";
import LoadingScreen from "@/components/LoadingScreen";
import LandingScreen from "@/components/LandingScreen";
import MusicToggle from "@/components/MusicToggle";
import MatchingGame from "@/components/MatchingGame";
import PhotoUpload from "@/components/PhotoUpload";
import SwipeGame from "@/components/SwipeGame";
import Celebration from "@/components/Celebration";
import { motion, AnimatePresence } from "framer-motion";

const PHASE_LABELS = ["Permainan", "Foto", "Swipe", "Kejutan"];

function PhaseIndicator() {
  const { currentPhase } = useGame();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-white/60"
      style={{ backdropFilter: "blur(12px)" }}
    >
      {PHASE_LABELS.map((label, i) => {
        const phase = i + 1;
        const isActive = phase === currentPhase;
        const isCompleted = phase < currentPhase;

        return (
          <div key={phase} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive
                    ? "#f43f5e"
                    : isCompleted
                      ? "#fb7185"
                      : "#fecdd3",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-2.5 h-2.5 rounded-full"
              />
              <span
                className={`text-[9px] mt-0.5 font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-rose-600"
                    : isCompleted
                      ? "text-rose-400"
                      : "text-rose-300"
                }`}
              >
                {label}
              </span>
            </div>
            {i < PHASE_LABELS.length - 1 && (
              <div
                className={`w-4 h-px mb-3 transition-colors duration-300 ${
                  isCompleted ? "bg-rose-400" : "bg-rose-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

function PhaseRouter() {
  const { currentPhase } = useGame();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPhase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentPhase === 1 && <MatchingGame />}
        {currentPhase === 2 && <PhotoUpload />}
        {currentPhase === 3 && <SwipeGame />}
        {currentPhase === 4 && <Celebration />}
      </motion.div>
    </AnimatePresence>
  );
}

function GameContent() {
  const { isStarted } = useGame();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <FloatingHearts />
      <MusicToggle />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        ) : !isStarted ? (
          <LandingScreen key="landing" />
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PhaseIndicator />
            <PhaseRouter />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
