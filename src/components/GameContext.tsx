"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Phase = 1 | 2 | 3 | 4;

interface GameState {
  currentPhase: Phase;
  uploadedPhoto: string | null;
  targetPhoto: string;
  targetName: string;
  senderName: string;
  isStarted: boolean;
  setCurrentPhase: (phase: Phase) => void;
  setUploadedPhoto: (photo: string | null) => void;
  setIsStarted: (started: boolean) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentPhase, setCurrentPhase] = useState<Phase>(1);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  return (
    <GameContext.Provider
      value={{
        currentPhase,
        uploadedPhoto,
        targetPhoto: "/game-photos/match4.png",
        targetName: "Dian Nafisa",
        senderName: "Pacarmu",
        isStarted,
        setCurrentPhase,
        setUploadedPhoto,
        setIsStarted,
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
