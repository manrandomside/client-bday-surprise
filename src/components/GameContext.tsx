"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Phase = 1 | 2 | 3 | 4;

interface GameState {
  currentPhase: Phase;
  uploadedPhoto: string | null;
  targetPhoto: string;
  setCurrentPhase: (phase: Phase) => void;
  setUploadedPhoto: (photo: string | null) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentPhase, setCurrentPhase] = useState<Phase>(1);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  return (
    <GameContext.Provider
      value={{
        currentPhase,
        uploadedPhoto,
        targetPhoto: "/game-photos/1.jpeg",
        setCurrentPhase,
        setUploadedPhoto,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
