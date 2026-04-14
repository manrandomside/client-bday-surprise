"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./GameContext";

interface Card {
  id: number;
  imageIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const HEART_GRID: boolean[][] = [
  [false, true, true, false, false, false, true, true, false],
  [true, true, true, true, true, true, true, true, true],
  [false, true, true, true, true, true, true, true, false],
  [false, false, true, true, true, true, true, false, false],
  [false, false, false, true, true, true, false, false, false],
];

const TOTAL_PAIRS = 14;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getHeartPositions(): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];
  for (let r = 0; r < HEART_GRID.length; r++) {
    for (let c = 0; c < HEART_GRID[r].length; c++) {
      if (HEART_GRID[r][c]) {
        positions.push({ row: r, col: c });
      }
    }
  }
  return positions;
}

interface MatchParticle {
  id: number;
  x: number;
  y: number;
}

export default function MatchingGame() {
  const { setCurrentPhase } = useGame();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [particles, setParticles] = useState<MatchParticle[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const particleIdRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imageIndices = Array.from({ length: TOTAL_PAIRS }, (_, i) => i + 1);
    const pairs = [...imageIndices, ...imageIndices];
    const shuffled = shuffleArray(pairs);
    const initialCards: Card[] = shuffled.map((imageIndex, i) => ({
      id: i,
      imageIndex,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
  }, []);

  const spawnParticles = useCallback((x: number, y: number) => {
    const newParticles: MatchParticle[] = Array.from({ length: 8 }, () => ({
      id: particleIdRef.current++,
      x,
      y,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 1000);
  }, []);

  const handleCardClick = useCallback(
    (index: number) => {
      if (isChecking || gameComplete) return;
      if (cards[index].isFlipped || cards[index].isMatched) return;
      if (flippedIndices.length >= 2) return;

      const newCards = [...cards];
      newCards[index] = { ...newCards[index], isFlipped: true };
      setCards(newCards);

      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((prev) => prev + 1);
        setIsChecking(true);

        const [firstIdx, secondIdx] = newFlipped;
        const isMatch =
          newCards[firstIdx].imageIndex === newCards[secondIdx].imageIndex;

        if (isMatch) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card, i) =>
                i === firstIdx || i === secondIdx
                  ? { ...card, isMatched: true }
                  : card
              )
            );
            setFlippedIndices([]);
            setIsChecking(false);

            const newMatchedPairs = matchedPairs + 1;
            setMatchedPairs(newMatchedPairs);

            if (gridRef.current) {
              const rect = gridRef.current.getBoundingClientRect();
              const positions = getHeartPositions();
              const pos1 = positions[firstIdx];
              const pos2 = positions[secondIdx];
              if (pos1 && pos2) {
                const cellW = rect.width / 9;
                const cellH = rect.height / 5;
                spawnParticles(
                  rect.left + (pos1.col + 0.5) * cellW,
                  rect.top + (pos1.row + 0.5) * cellH
                );
                spawnParticles(
                  rect.left + (pos2.col + 0.5) * cellW,
                  rect.top + (pos2.row + 0.5) * cellH
                );
              }
            }

            if (newMatchedPairs === TOTAL_PAIRS) {
              setGameComplete(true);
              setTimeout(() => {
                setCurrentPhase(2);
              }, 3000);
            }
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card, i) =>
                i === firstIdx || i === secondIdx
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            setFlippedIndices([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [
      cards,
      flippedIndices,
      isChecking,
      matchedPairs,
      gameComplete,
      setCurrentPhase,
      spawnParticles,
    ]
  );

  const heartPositions = getHeartPositions();

  if (cards.length === 0) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-rose-50 to-pink-100"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3,
              }}
              className="text-7xl sm:text-8xl text-rose-400 mb-6"
            >
              &#9829;
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-2xl sm:text-3xl font-bold text-rose-700 mb-3 text-center"
            >
              Permainan Mencocokkan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-rose-500 mb-8 text-center px-4 max-w-sm"
            >
              Temukan semua pasangan kartu yang cocok untuk melanjutkan ke
              tahap berikutnya
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowIntro(false)}
              className="px-8 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-rose-300/50 cursor-pointer"
            >
              Mulai Bermain
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -20 : 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-4 sm:mb-6 z-10"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-rose-700 mb-1">
          Temukan Pasangannya!
        </h1>
        <div className="flex items-center gap-4 text-sm text-rose-500">
          <span>Langkah: {moves}</span>
          <span>
            Cocok: {matchedPairs}/{TOTAL_PAIRS}
          </span>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: showIntro ? 0 : 1, scaleX: showIntro ? 0 : 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md mb-4 sm:mb-6 z-10"
      >
        <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(matchedPairs / TOTAL_PAIRS) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </motion.div>

      {/* Heart-shaped grid */}
      <motion.div
        ref={gridRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.8 : 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="grid z-10"
        style={{
          gridTemplateColumns: "repeat(9, 1fr)",
          gridTemplateRows: "repeat(5, 1fr)",
          gap: "clamp(3px, 1vw, 8px)",
          width: "min(90vw, 540px)",
          aspectRatio: "9 / 5",
        }}
      >
        {HEART_GRID.flat().map((isActive, gridIndex) => {
          if (!isActive) {
            return <div key={`empty-${gridIndex}`} />;
          }
          const cardIndex = heartPositions.findIndex(
            (pos) =>
              pos.row === Math.floor(gridIndex / 9) &&
              pos.col === gridIndex % 9
          );
          const card = cards[cardIndex];
          if (!card) return <div key={`missing-${gridIndex}`} />;

          const isFlipped = card.isFlipped || card.isMatched;

          return (
            <motion.div
              key={card.id}
              className="relative cursor-pointer"
              style={{ perspective: 600, aspectRatio: "1" }}
              whileHover={!isFlipped ? { scale: 1.08 } : {}}
              whileTap={!isFlipped ? { scale: 0.95 } : {}}
              onClick={() => handleCardClick(cardIndex)}
              layout
            >
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Card back */}
                <div
                  className="absolute inset-0 rounded-md sm:rounded-lg flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    background:
                      "linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f43f5e 100%)",
                    boxShadow: "0 2px 8px rgba(244, 63, 94, 0.3)",
                  }}
                >
                  <span className="text-white text-xs sm:text-base md:text-lg opacity-80">
                    &#9829;
                  </span>
                </div>

                {/* Card front */}
                <div
                  className="absolute inset-0 rounded-md sm:rounded-lg overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    boxShadow: card.isMatched
                      ? "0 0 12px rgba(244, 63, 94, 0.5)"
                      : "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <img
                    src={`/game-photos/${card.imageIndex}.jpeg`}
                    alt="Kartu permainan"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {card.isMatched && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-rose-400/20 flex items-center justify-center"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        className="text-white text-sm sm:text-xl drop-shadow-lg"
                      >
                        &#10003;
                      </motion.span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Match particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <MatchParticleEffect key={particle.id} x={particle.x} y={particle.y} />
        ))}
      </AnimatePresence>

      {/* Game complete overlay */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-rose-100/95 via-pink-50/95 to-rose-100/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.6, times: [0, 0.7, 1] }}
              className="text-6xl sm:text-8xl text-rose-500 mb-4"
            >
              &#9829;
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl sm:text-3xl font-bold text-rose-700 mb-2"
            >
              Luar Biasa!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-rose-500 text-center"
            >
              Kamu berhasil menyelesaikannya dalam {moves} langkah!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-rose-400 text-sm mt-4"
            >
              Mempersiapkan tahap selanjutnya...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatchParticleEffect({ x, y }: { x: number; y: number }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 40 + Math.random() * 30;
        return (
          <motion.div
            key={i}
            className="fixed pointer-events-none z-40 text-rose-400"
            style={{ left: x, top: y, fontSize: 10 + Math.random() * 8 }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            &#9829;
          </motion.div>
        );
      })}
    </>
  );
}
