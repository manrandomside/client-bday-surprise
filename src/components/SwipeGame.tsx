"use client";

import { useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useGame } from "./GameContext";

interface Profile {
  name: string;
  age: number;
  bio: string;
  color: string;
  emoji: string;
  isTarget: boolean;
  image?: string;
}

const FAKE_PROFILES: Omit<Profile, "isTarget">[] = [
  {
    name: "Budi Setiawan",
    age: 35,
    bio: "Hobi: Mengoleksi sandal jepit dan berdebat dengan kucing tetangga.",
    color: "from-blue-400 to-cyan-300",
    emoji: "B",
  },
  {
    name: "Agus Maulana",
    age: 42,
    bio: "Profesional tidur siang. Bisa ngorok dalam 7 bahasa.",
    color: "from-amber-400 to-orange-300",
    emoji: "A",
  },
  {
    name: "Joko Santoso",
    age: 28,
    bio: "Bukan presiden, cuma tukang bakso yang kebetulan ganteng.",
    color: "from-emerald-400 to-teal-300",
    emoji: "J",
  },
];

const RUNAWAY_MESSAGES = [
  "Hehe, kena deh!",
  "Gak bisa dong~",
  "Coba lagi!",
  "Terlalu lambat!",
  "Nggak semudah itu!",
  "Wkwk, hampir!",
  "Cepetan dikit!",
  "Mau kemana kamu?",
];

function RunawayButton({
  label,
  variant,
}: {
  label: string;
  variant: "interested" | "not-interested";
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [runCount, setRunCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleInteraction = useCallback(() => {
    const maxOffset = 150;
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 70;

    let newX = Math.cos(angle) * distance;
    let newY = Math.sin(angle) * distance;

    newX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    newY = Math.max(-maxOffset, Math.min(maxOffset, newY));

    if (Math.abs(position.x - newX) < 30) {
      newX = -newX;
    }

    setPosition({ x: newX, y: newY });
    setRunCount((prev) => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  }, [position.x]);

  const baseClass =
    variant === "interested"
      ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-300/40"
      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-300/40";

  return (
    <div className="relative" style={{ minHeight: 60 }}>
      <AnimatePresence>
        {runCount > 0 && isShaking && (
          <motion.p
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute left-1/2 -translate-x-1/2 -top-6 text-rose-500 text-xs font-medium whitespace-nowrap z-10"
          >
            {RUNAWAY_MESSAGES[runCount % RUNAWAY_MESSAGES.length]}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        ref={buttonRef}
        animate={{
          x: position.x,
          y: position.y,
          rotate: isShaking ? [0, -5, 5, -3, 3, 0] : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        onHoverStart={handleInteraction}
        onTouchStart={(e) => {
          e.preventDefault();
          handleInteraction();
        }}
        className={`px-8 py-3 rounded-full font-semibold cursor-pointer select-none ${baseClass}`}
      >
        {label}
      </motion.button>
    </div>
  );
}

function NormalButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: "interested" | "not-interested";
}) {
  const baseClass =
    variant === "interested"
      ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-300/40"
      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-300/40";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-semibold cursor-pointer ${baseClass}`}
    >
      {label}
    </motion.button>
  );
}

function ProfileCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  isFinal,
  direction,
}: {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isFinal: boolean;
  direction: "left" | "right" | null;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = 100;
      const vel = 500;

      if (info.offset.x > threshold || info.velocity.x > vel) {
        if (isFinal) {
          onSwipeRight();
        }
      } else if (info.offset.x < -threshold || info.velocity.x < -vel) {
        if (!isFinal) {
          onSwipeLeft();
        }
      }
    },
    [isFinal, onSwipeLeft, onSwipeRight]
  );

  const exitX = direction === "right" ? 400 : -400;
  const exitRotate = direction === "right" ? 25 : -25;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: exitX,
        opacity: 0,
        rotate: exitRotate,
        transition: { duration: 0.4, ease: "easeIn" },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
    >
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Card background */}
        {profile.image ? (
          <img
            src={profile.image}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${profile.color} flex items-center justify-center`}
          >
            <span className="text-8xl sm:text-9xl font-bold text-white/30 select-none">
              {profile.emoji}
            </span>
          </div>
        )}

        {/* Swipe indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 left-6 px-4 py-2 border-3 border-green-400 rounded-xl rotate-[-15deg] z-20"
        >
          <span className="text-green-400 font-black text-2xl tracking-wider">
            SUKA
          </span>
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-6 right-6 px-4 py-2 border-3 border-red-400 rounded-xl rotate-[15deg] z-20"
        >
          <span className="text-red-400 font-black text-2xl tracking-wider">
            LEWAT
          </span>
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
          <div className="flex items-end gap-2 mb-2">
            <h3 className="text-2xl sm:text-3xl font-bold">{profile.name}</h3>
            <span className="text-xl sm:text-2xl font-light mb-0.5">
              {profile.age}
            </span>
          </div>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            {profile.bio}
          </p>

          {profile.isTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs">Baru saja aktif</span>
            </motion.div>
          )}
        </div>

        {/* "Verified" badge for target */}
        {profile.isTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute top-4 left-4 bg-blue-500/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 z-20"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Terverifikasi
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function SwipeGame() {
  const { targetPhoto, setCurrentPhase } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [rejectCount, setRejectCount] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );

  const profiles: Profile[] = [
    ...FAKE_PROFILES.map((p) => ({ ...p, isTarget: false })),
    {
      name: "Seseorang yang Spesial",
      age: 23,
      bio: "Seseorang yang udah curi perhatianmu sejak lama... Kamu yakin mau nolak?",
      color: "from-rose-400 to-pink-500",
      emoji: "?",
      isTarget: true,
      image: targetPhoto,
    },
  ];

  const currentProfile = profiles[currentIndex];
  const isFinalCard = currentIndex === profiles.length - 1;

  const handleReject = useCallback(() => {
    if (isFinalCard) return;
    setExitDirection("left");
    setRejectCount((prev) => prev + 1);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setExitDirection(null);
    }, 100);
  }, [isFinalCard]);

  const handleAccept = useCallback(() => {
    if (!isFinalCard) return;
    setExitDirection("right");
    setTimeout(() => {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentPhase(4);
      }, 2000);
    }, 400);
  }, [isFinalCard, setCurrentPhase]);

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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3,
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-300/40"
            >
              <svg
                className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-2xl sm:text-3xl font-bold text-rose-700 mb-3 text-center"
            >
              Waktunya Mencari Pasangan!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-rose-500 mb-2 text-center px-4 max-w-sm"
            >
              Geser kartu atau tekan tombol untuk menentukan pilihanmu.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-rose-400 text-sm mb-8 text-center px-4"
            >
              Temukan orang yang benar-benar spesial untukmu!
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
              Mulai Geser
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -20 : 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-4 z-20 mt-8"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg
            className="w-5 h-5 text-rose-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <h1 className="text-lg sm:text-xl font-bold text-rose-700">
            LoveMatch
          </h1>
        </div>
        <p className="text-rose-400 text-xs">
          Profil {currentIndex + 1} dari {profiles.length}
        </p>
      </motion.div>

      {/* Card stack area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ delay: 0.4 }}
        className="relative w-full max-w-sm flex items-center justify-center z-10"
        style={{ height: "min(65vh, 480px)" }}
      >
        {/* Background cards for stack effect */}
        {currentIndex + 1 < profiles.length && (
          <motion.div
            className="absolute w-[95%] rounded-3xl bg-white/40 shadow-lg"
            style={{
              aspectRatio: "3/4",
              transform: "scale(0.95) translateY(10px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}

        <AnimatePresence mode="wait">
          {currentProfile && !showTransition && (
            <ProfileCard
              key={currentIndex}
              profile={currentProfile}
              onSwipeLeft={handleReject}
              onSwipeRight={handleAccept}
              isFinal={isFinalCard}
              direction={exitDirection}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showIntro || showTransition ? 0 : 1,
          y: showIntro || showTransition ? 20 : 0,
        }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-6 mt-6 z-20"
        style={{ minHeight: 80 }}
      >
        {isFinalCard ? (
          <>
            <RunawayButton
              key={`runaway-nope-${currentIndex}`}
              label="Tidak Tertarik"
              variant="not-interested"
            />
            <NormalButton
              label="Tertarik"
              onClick={handleAccept}
              variant="interested"
            />
          </>
        ) : (
          <>
            <NormalButton
              label="Tidak Tertarik"
              onClick={handleReject}
              variant="not-interested"
            />
            <RunawayButton
              key={`runaway-like-${currentIndex}`}
              label="Tertarik"
              variant="interested"
            />
          </>
        )}
      </motion.div>

      {/* Reject counter hint */}
      <AnimatePresence>
        {!showIntro && rejectCount > 0 && rejectCount < 3 && (
          <motion.p
            key={`hint-${rejectCount}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-rose-400 text-xs mt-3 z-10"
          >
            Hmm, belum ketemu yang cocok ya? Masih ada{" "}
            {3 - rejectCount} profil lagi...
          </motion.p>
        )}
        {!showIntro && rejectCount === 3 && !showTransition && (
          <motion.p
            key="hint-final"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-rose-500 text-xs mt-3 z-10 font-medium"
          >
            Ini dia yang terakhir... Lihat baik-baik!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Transition overlay */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-rose-100/95 via-pink-50/95 to-rose-100/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ duration: 0.7, times: [0, 0.6, 1] }}
              className="text-rose-500 mb-4"
            >
              <svg
                className="w-20 h-20 sm:w-24 sm:h-24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-rose-700 mb-2"
            >
              Kamu Tertarik!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-rose-400 text-sm"
            >
              Mari kita lihat apakah kalian cocok...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
