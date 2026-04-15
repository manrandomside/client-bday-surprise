"use client";

import { useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type TargetAndTransition,
} from "framer-motion";
import { useGame } from "./GameContext";

interface Profile {
  name: string;
  age: number;
  bio: string;
  color: string;
  emoji: string;
  isTarget: boolean;
  image: string;
  rejectMessage: string;
  rejectEmoji: string;
}

const PROFILES_DATA: Profile[] = [
  {
    name: "Mas Amba Loh Yah",
    age: 25,
    bio: "Hobi nongkrong di warung sambil sok filosofis. Sering ngomong 'amba loh yah' tanpa alasan jelas. Kalau kamu suka cowok misterius tapi agak aneh, ini orangnya.",
    color: "from-blue-400 to-cyan-300",
    emoji: "A",
    isTarget: false,
    image: "/game-photos/match1.png",
    rejectMessage: "AMBA SEDIH :(",
    rejectEmoji: "T_T",
  },
  {
    name: "Windut Kicidut",
    age: 22,
    bio: "Self-proclaimed 'content creator' padahal follower cuma 47 (30-nya akun bot). Jago masak tapi cuma bisa bikin Indomie. Mencari seseorang yang mau dengerin curhatnya 24/7.",
    color: "from-amber-400 to-orange-300",
    emoji: "W",
    isTarget: false,
    image: "/game-photos/match2.png",
    rejectMessage: "WINDUT NGAMBEK!",
    rejectEmoji: ">:(",
  },
  {
    name: "Zigma",
    age: 99,
    bio: "Sigma male grindset. Bangun jam 3 pagi, mandi air es, lari 10 km, terus tidur lagi. Portfolio: 0 pacar, 0 pengalaman, tapi confidence level 999. Jangan tanya kenapa umurnya 99.",
    color: "from-emerald-400 to-teal-300",
    emoji: "Z",
    isTarget: false,
    image: "/game-photos/match3.png",
    rejectMessage: "ZIGMA GAK BUTUH KAMU",
    rejectEmoji: "B)",
  },
  {
    name: "CEO Google",
    age: 23,
    bio: "Bukan Sundar Pichai, tapi jauh lebih keren. Punya senyum yang bisa bikin server Google down. Kalau kamu nolak, sayang banget... Gaji 1 milyar per bulan loh~",
    color: "from-rose-400 to-pink-500",
    emoji: "?",
    isTarget: true,
    image: "/game-photos/match4.png",
    rejectMessage: "",
    rejectEmoji: "",
  },
];

const RUNAWAY_MESSAGES_TARGET = [
  "Nolak CEO Google?!",
  "Gaji 1M per bulan loh!",
  "Kamu yakin banget?!",
  "Pikir lagi deh...",
  "Rugi banget sumpah!",
  "Dia udah suka kamu loh!",
  "JANGAN DITOLAK!",
  "Kamu jahat banget!",
];

interface RejectReaction {
  profileIndex: number;
  isActive: boolean;
}

function RunawayButton({
  label,
  variant,
  messages,
}: {
  label: string;
  variant: "interested" | "not-interested";
  messages?: string[];
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [runCount, setRunCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const displayMessages = messages || [
    "Hehe, kena deh!",
    "Gak bisa dong~",
    "Coba lagi!",
    "Terlalu lambat!",
  ];

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
            {displayMessages[runCount % displayMessages.length]}
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
          rotate: { type: "tween", duration: 0.4 },
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

function ShrinkingButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = useCallback(() => {
    if (clickCount < 2) {
      setClickCount((prev) => prev + 1);
    } else {
      onClick();
    }
  }, [clickCount, onClick]);

  const scale = Math.max(0.4, 1 - clickCount * 0.25);
  const messages = [
    "",
    "Yakin nih?",
    "Beneran yakin?!",
  ];

  return (
    <div className="relative" style={{ minHeight: 60 }}>
      <AnimatePresence>
        {clickCount > 0 && (
          <motion.p
            key={clickCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute left-1/2 -translate-x-1/2 -top-6 text-rose-500 text-xs font-medium whitespace-nowrap z-10"
          >
            {messages[clickCount]}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        whileTap={{ scale: scale * 0.9 }}
        onClick={handleClick}
        className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-300/40 rounded-full font-semibold cursor-pointer"
      >
        {label}
      </motion.button>
    </div>
  );
}

function SpinningButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [spinning, setSpinning] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = useCallback(() => {
    if (clickCount < 1) {
      setSpinning(true);
      setClickCount(1);
      setTimeout(() => {
        setSpinning(false);
      }, 1500);
    } else {
      onClick();
    }
  }, [clickCount, onClick]);

  return (
    <div className="relative" style={{ minHeight: 60 }}>
      <AnimatePresence>
        {spinning && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute left-1/2 -translate-x-1/2 -top-6 text-rose-500 text-xs font-medium whitespace-nowrap z-10"
          >
            Windut pusing!
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        animate={{
          rotate: spinning ? [0, 360, 720, 1080] : 0,
          scale: spinning ? [1, 0.8, 1.1, 1] : 1,
        }}
        transition={{
          duration: spinning ? 1.5 : 0.3,
          ease: "easeInOut",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-300/40 rounded-full font-semibold cursor-pointer"
      >
        {spinning ? "AAAAAA!" : label}
      </motion.button>
    </div>
  );
}

function ZigmaButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [phase, setPhase] = useState(0);

  const handleClick = useCallback(() => {
    if (phase < 2) {
      setPhase((prev) => prev + 1);
    } else {
      onClick();
    }
  }, [phase, onClick]);

  const texts = [label, "Zigma gak peduli", "OK bye."];
  const colors = [
    "from-gray-400 to-gray-500",
    "from-gray-600 to-gray-700",
    "from-gray-800 to-black",
  ];

  return (
    <div className="relative" style={{ minHeight: 60 }}>
      <AnimatePresence>
        {phase > 0 && (
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 -top-6 text-rose-500 text-xs font-medium whitespace-nowrap z-10"
          >
            {phase === 1 ? "Zigma gak butuh validasi" : "Zigma walk away..."}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        animate={{
          x: phase === 2 ? [-5, 5, -3, 3, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`px-8 py-3 bg-gradient-to-r ${colors[phase]} text-white shadow-lg rounded-full font-semibold cursor-pointer transition-all`}
      >
        {texts[phase]}
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
  rejectReaction,
}: {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isFinal: boolean;
  direction: "left" | "right" | null;
  rejectReaction: RejectReaction | null;
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
        if (isFinal) onSwipeRight();
      } else if (info.offset.x < -threshold || info.velocity.x < -vel) {
        if (!isFinal) onSwipeLeft();
      }
    },
    [isFinal, onSwipeLeft, onSwipeRight]
  );

  const exitVariants: Record<number, TargetAndTransition> = {
    0: {
      x: -400,
      y: 200,
      rotate: -45,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeIn" },
    },
    1: {
      x: -300,
      rotate: [0, 180, 360, 540],
      opacity: 0,
      scale: 0.3,
      transition: { duration: 0.8, ease: "easeIn" },
    },
    2: {
      x: -500,
      y: -50,
      rotate: 0,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 1.0, ease: [0.25, 0.1, 0.25, 1] },
    },
    3: {
      x: 400,
      opacity: 0,
      rotate: 25,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  const profileIndex = PROFILES_DATA.findIndex(
    (p) => p.name === profile.name
  );
  const exitAnim =
    direction !== null
      ? exitVariants[profileIndex] || { x: -400, opacity: 0 }
      : {};

  const isShowingReaction =
    rejectReaction?.isActive && rejectReaction.profileIndex === profileIndex;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={exitAnim}
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
        <img
          src={profile.image}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

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

        {/* Reject reaction overlay */}
        <AnimatePresence>
          {isShowingReaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-30"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-5xl sm:text-6xl mb-2 select-none"
              >
                {profile.rejectEmoji}
              </motion.span>
              <motion.p
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                className="text-white font-bold text-lg sm:text-xl text-center px-4"
              >
                {profile.rejectMessage}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Verified badge for target */}
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
            CEO Terverifikasi
          </motion.div>
        )}

        {/* Funny badge for match3 (Zigma) */}
        {profileIndex === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="absolute top-4 left-4 bg-gray-800/90 text-white text-xs px-2.5 py-1 rounded-full z-20"
            style={{ backdropFilter: "blur(4px)" }}
          >
            Sigma Male
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function SwipeGame() {
  const { setCurrentPhase } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [rejectCount, setRejectCount] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [exitDirection, setExitDirection] = useState<
    "left" | "right" | null
  >(null);
  const [rejectReaction, setRejectReaction] = useState<RejectReaction | null>(
    null
  );

  const currentProfile = PROFILES_DATA[currentIndex];
  const isFinalCard = currentIndex === PROFILES_DATA.length - 1;

  const handleReject = useCallback(() => {
    if (isFinalCard) return;

    setRejectReaction({ profileIndex: currentIndex, isActive: true });

    setTimeout(() => {
      setExitDirection("left");
      setRejectCount((prev) => prev + 1);
      setTimeout(() => {
        setRejectReaction(null);
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
      }, 150);
    }, 1200);
  }, [isFinalCard, currentIndex]);

  const handleAccept = useCallback(() => {
    if (!isFinalCard) return;
    setExitDirection("right");
    setTimeout(() => {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentPhase(4);
      }, 2500);
    }, 400);
  }, [isFinalCard, setCurrentPhase]);

  const rejectHints: Record<number, string> = {
    1: "Mas Amba udah nangis tuh... Masih ada 2 profil lagi.",
    2: "Windut ngambek parah! Masih ada 1 profil lagi...",
    3: "Zigma bilang dia gak peduli (padahal sedih). Ini yang terakhir!",
  };

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
          Profil {currentIndex + 1} dari {PROFILES_DATA.length}
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
        {currentIndex + 1 < PROFILES_DATA.length && (
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
              rejectReaction={rejectReaction}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action buttons - unique per profile */}
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
            {/* Final card: "Tidak Tertarik" runs away */}
            <RunawayButton
              key={`runaway-nope-final`}
              label="Tidak Tertarik"
              variant="not-interested"
              messages={RUNAWAY_MESSAGES_TARGET}
            />
            <NormalButton
              label="Tertarik"
              onClick={handleAccept}
              variant="interested"
            />
          </>
        ) : (
          <>
            {/* Each profile gets a unique reject button */}
            {currentIndex === 0 && (
              <ShrinkingButton
                key="shrink-0"
                label="Tidak Tertarik"
                onClick={handleReject}
              />
            )}
            {currentIndex === 1 && (
              <SpinningButton
                key="spin-1"
                label="Tidak Tertarik"
                onClick={handleReject}
              />
            )}
            {currentIndex === 2 && (
              <ZigmaButton
                key="zigma-2"
                label="Tidak Tertarik"
                onClick={handleReject}
              />
            )}
            <RunawayButton
              key={`runaway-like-${currentIndex}`}
              label="Tertarik"
              variant="interested"
              messages={[
                "Hehe, gak bisa!",
                "Yang bener aja!",
                "Nggak cocok!",
                "Cari yang lain!",
              ]}
            />
          </>
        )}
      </motion.div>

      {/* Reject hints */}
      <AnimatePresence>
        {!showIntro &&
          rejectCount > 0 &&
          rejectCount <= 3 &&
          !rejectReaction?.isActive && (
            <motion.p
              key={`hint-${rejectCount}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-xs mt-3 z-10 ${
                rejectCount === 3
                  ? "text-rose-500 font-medium"
                  : "text-rose-400"
              }`}
            >
              {rejectHints[rejectCount]}
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
              Akhirnya Tertarik Juga!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-rose-400 text-sm text-center px-4"
            >
              CEO Google sudah menunggumu... Mari kita lihat hasilnya!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
