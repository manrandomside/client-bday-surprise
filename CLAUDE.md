# Project Context: client-bday-surprise

## Project Overview

This is a web-based birthday surprise application for a client's friend, designed as an interactive and romantic prank. The application consists of 4 sequential phases: a matching photo game, a photo upload feature, a rigged "dating app" swipe game, and a final birthday celebration screen.

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animation: Framer Motion

## Global Rules (STRICTLY ENFORCED)

1. Language: All user-facing interfaces (UI) MUST be in Bahasa Indonesia. All source code, variables, functions, and comments MUST be in English.
2. Emojis: NO emojis are allowed anywhere inside the source code files.
3. Responsiveness: The design MUST be fully responsive (Mobile-first approach, scaling perfectly to Desktop).
4. Aesthetic: The UI and animations must be smooth, premium, and aesthetically pleasing using Framer Motion.
5. Execution: Do NOT execute all tasks at once. You must complete ONE task, push to GitHub, and WAIT for user confirmation before proceeding to the next task.

## Git Workflow (CRITICAL)

After completing EACH task below, you MUST execute the following git commands to maintain a clean history using Conventional Commits:
`git add .`
`git commit -m "<type>: <description>"` (e.g., feat: complete phase 1 matching game)
`git push`
Wait for the user to say "lanjut" (continue) before starting the next task.

---

## Task Breakdown & Execution Steps

### TASK 1: Phase 1 - Heart-Shaped Matching Game

- Feature: Create a memory matching card game.
- Assets: Use the `.jpeg` images located in `public/game-photos/`.
- Layout: The grid/arrangement of the cards MUST form the shape of a heart.
- Logic: Standard matching game logic. Once all cards are successfully matched, automatically transition to Phase 2.
- Action: Complete code -> Commit -> Push -> STOP.

### TASK 2: Phase 2 - Photo Upload Interface

- Feature: Create a sleek UI asking the user to upload a photo of themselves.
- Logic: The uploaded image must be saved in the application state/context so it can be retrieved and displayed in Phase 3 and Phase 4.
- Action: Complete code -> Commit -> Push -> STOP.

### TASK 3: Phase 3 - The "Rigged" Swipe Game (The Prank)

- Feature: Build a Tinder/Bumble-like card swipe interface.
- Attempt 1, 2, and 3:
  - Display random or funny placeholder images.
  - The "Tertarik" (Interested) button MUST be disabled, or use Framer Motion to make it run away/dodge when hovered.
  - The user is FORCED to click the "Tidak Tertarik" (Not Interested) button 3 times.
- Attempt 4 (The Climax):
  - Display the target photo (the client's friend).
  - The "Tidak Tertarik" button MUST disappear or run away when hovered.
  - The user is FORCED to click the "Tertarik" button.
- Action: Complete code -> Commit -> Push -> STOP.

### TASK 4: Phase 4 - Grand Finale & Celebration

- Feature: A smooth transition from Phase 3 into a birthday celebration page.
- Visuals:
  - Display a "Match" animation using the photo uploaded in Phase 2 and the photo from Phase 3.
  - Include beautiful confetti animations.
  - Display a sweet, customizable birthday greeting message in Bahasa Indonesia.
- Action: Complete code -> Commit -> Push -> STOP.

### TASK 5: Vercel Deployment Preparation

- Feature: Review the entire codebase for build errors (`npm run build`). Ensure all TypeScript interfaces are correct and no linting errors exist.
- Action: Guide the user on how to link their GitHub repository to Vercel for immediate deployment.
