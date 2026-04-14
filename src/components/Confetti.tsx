"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotateEnd: number;
  shape: "square" | "circle" | "heart";
  drift: number;
}

const COLORS = [
  "#f43f5e",
  "#ec4899",
  "#f472b6",
  "#fb7185",
  "#fda4af",
  "#fbbf24",
  "#a78bfa",
  "#60a5fa",
  "#34d399",
  "#f9a8d4",
];

export default function Confetti({ count = 80 }: { count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const shapes: ConfettiPiece["shape"][] = ["square", "circle", "heart"];
    const generated: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 3,
      rotateEnd: Math.random() * 1080 - 540,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      drift: (Math.random() - 0.5) * 200,
    }));
    setPieces(generated);
  }, [count]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.shape === "heart" ? piece.size * 0.9 : piece.size,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, x: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 1, 0.8, 0],
            rotate: piece.rotateEnd,
            x: piece.drift,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        >
          {piece.shape === "heart" ? (
            <span
              style={{ color: piece.color, fontSize: piece.size * 1.5 }}
            >
              &#9829;
            </span>
          ) : piece.shape === "circle" ? (
            <div
              className="rounded-full w-full h-full"
              style={{ backgroundColor: piece.color }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                backgroundColor: piece.color,
                borderRadius: 1,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
