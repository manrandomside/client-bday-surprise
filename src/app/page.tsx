"use client";

import { GameProvider, useGame } from "@/components/GameContext";
import FloatingHearts from "@/components/FloatingHearts";
import MatchingGame from "@/components/MatchingGame";
import PhotoUpload from "@/components/PhotoUpload";
import SwipeGame from "@/components/SwipeGame";

function PhaseRouter() {
  const { currentPhase } = useGame();

  switch (currentPhase) {
    case 1:
      return <MatchingGame />;
    case 2:
      return <PhotoUpload />;
    case 3:
      return <SwipeGame />;
    case 4:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-rose-500 text-xl">Phase 4 - Coming Soon</p>
        </div>
      );
    default:
      return null;
  }
}

export default function Home() {
  return (
    <GameProvider>
      <FloatingHearts />
      <PhaseRouter />
    </GameProvider>
  );
}
