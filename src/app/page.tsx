"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import getQuestions from "@/lib/get-questions";
import Quiz from "@/components/quized";
import QuizCustomizations from "@/components/QuizCustomizationss";

export default function Home() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const handleStartQuiz = useCallback((name: string) => {
    if (name.trim()) {
      setPlayerName(name);
      setIsStarted(true);
      localStorage.setItem("username", name);
    }
  }, []);

  const getCountryQuestions = useCallback(async () => {
    const newQuestions = await getQuestions();
    setQuestions(newQuestions);
  }, []);

  useEffect(() => {
    getCountryQuestions();
  }, []);

  const restartQuiz = useCallback(() => {
    setIsStarted(false);
    getCountryQuestions();
  }, [getCountryQuestions]);

  const memoizedQuestions = useMemo(() => questions, [questions]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 py-12 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {isStarted ? (
        <Quiz
          questions={memoizedQuestions}
          restartQuiz={restartQuiz}
          playerName={playerName}
        />
      ) : (
        <QuizCustomizations handleStart={handleStartQuiz} />
      )}
    </main>
  );
}
