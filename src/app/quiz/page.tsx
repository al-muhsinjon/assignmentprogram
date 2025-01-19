"use client";

import { useEffect, useState } from "react";
import QuizCustomizations from "@/components/QuizCustomizations";
import Leaderboard from "@/components/Leaderboard";

import {
  saveGameResult,
  getCurrentGame,
  clearCurrentGame,
  CurrentGame,
} from "@/lib/gameStorage";
import getQuestions from "@/lib/get-questions";
import Quiz from "@/components/quiz";

export default function Home() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentGame, setCurrentGame] = useState<CurrentGame | null>(null);

  useEffect(() => {
    const storedGame = getCurrentGame();
    if (storedGame) {
      setCurrentGame(storedGame);
      setIsStarted(true);
    }
  }, []);

  const handleStartQuiz = async (playerName: string) => {
    const newQuestions = await getQuestions();
    setQuestions(newQuestions);
    setIsStarted(true);
    setCurrentGame({ playerName, score: 0, questionIndex: 0 });
  };

  const handleQuizComplete = (finalScore: number) => {
    if (currentGame) {
      saveGameResult(currentGame.playerName, finalScore);
      clearCurrentGame();
      setCurrentGame(null);
    }
  };

  const handleRestartQuiz = () => {
    setIsStarted(false);
    setCurrentGame(null);
    clearCurrentGame();
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-6 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {!isStarted ? (
        <>
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            World Capitals Quiz
          </h1>
          <QuizCustomizations handleStart={handleStartQuiz} />
          <button
            onClick={toggleLeaderboard}
            className="mt-4 bg-white text-indigo-600 font-bold py-2 px-4 rounded hover:bg-indigo-100 transition duration-300"
          >
            {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
          </button>
          {showLeaderboard && <Leaderboard />}
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            World Capitals Quiz
          </h1>
          <Quiz
            questions={questions}
            currentGame={currentGame}
            onComplete={handleQuizComplete}
            onRestart={handleRestartQuiz}
          />
        </>
      )}
    </main>
  );
}
