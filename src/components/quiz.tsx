"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CurrentGame, saveCurrentGame } from "@/lib/gameStorage";

interface QuizProps {
  questions: QuizQuestion[];
  currentGame: CurrentGame | null;
  onComplete: (finalScore: number) => void;
  onRestart: () => void;
}

export default function Quiz({
  questions,
  currentGame,
  onComplete,
  onRestart,
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const username = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    if (currentGame) {
      setCurrentQuestion(currentGame.questionIndex);
      setScore(currentGame.score);
    }
  }, [currentGame]);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setTimeout(goToNextQuestion, 1000);
  };

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    setTimeout(goToNextQuestion, 1000);
  };

  const goToNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
      if (currentGame) {
        saveCurrentGame({
          ...currentGame,
          questionIndex: nextQuestion,
          score: score,
        });
      }
    } else {
      setShowScore(true);
      onComplete(score);
    }
  };

  const getButtonColor = (answer: string) => {
    if (!isAnswered) return "bg-indigo-100 hover:bg-indigo-200";
    if (answer === questions[currentQuestion].correct_answer)
      return "bg-green-500 text-white";
    if (answer === selectedAnswer) return "bg-red-500 text-white";
    return "bg-indigo-100";
  };

  const getFeedbackMessage = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return "Siz dahosiz!";
    if (percentage >= 70) return "Ajoyib natija!";
    if (percentage >= 50) return "Yaxshi urinish!";
    return "Keyingi safar ko'proq harakat qiling!";
  };

  if (questions.length === 0) {
    return (
      <div className="text-center mt-10 text-white text-2xl">Loading...</div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full transition-all duration-300 ease-in-out">
      {!showScore ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">
            Quiz Completed!
          </h2>
          <p className="text-2xl mb-6 text-gray-700">
            You scored{" "}
            <span className="font-bold text-indigo-600">{score}</span> out of{" "}
            <span className="font-bold text-indigo-600">
              {questions.length}
            </span>
          </p>
          <p className="text-xl mb-6 text-indigo-600 font-semibold">
            {getFeedbackMessage(score)}
          </p>
          <button
            onClick={onRestart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out hover:scale-105 mr-4"
          >
            Play Again
          </button>
          <button
            onClick={onRestart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out hover:scale-105"
          >
            New Game
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <div className="text-2xl font-bold mb-4 text-indigo-700">
              Question {currentQuestion + 1}/{questions.length}
            </div>
            <div className="mb-4 flex justify-center">
              <Image
                src={questions[currentQuestion].flag || "/placeholder.svg"}
                alt={`Flag of ${questions[currentQuestion].question}`}
                width={200}
                height={100}
                className="rounded-lg shadow-md"
              />
            </div>
            <p className="text-xl text-gray-700 mb-4">
              What is the capital of {questions[currentQuestion].question}?
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              ></div>
            </div>
            <p className="text-lg font-semibold text-indigo-600">
              Time left: {timeLeft} seconds
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questions[currentQuestion].all_answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                className={`${getButtonColor(
                  answer
                )} text-indigo-700 font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out`}
                disabled={isAnswered}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
