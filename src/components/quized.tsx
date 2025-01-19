"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface QuizProps {
  questions: QuizQuestion[];
  restartQuiz: () => void;
  playerName: string;
}

interface QuizQuestion {
  question: string;
  correct_answer: string;
  all_answers: string[];
  flag: string;
}

export default function Quiz({
  questions,
  restartQuiz,
  playerName,
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [players, setPlayers] = useState<Record<string, number>>({});

  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      try {
        const parsedPlayers = JSON.parse(storedPlayers);
        setPlayers(parsedPlayers);
      } catch (error) {
        console.error("Error parsing players from localStorage:", error);
        setPlayers({});
      }
    }
  }, []);

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
      setScore((prevScore) => prevScore + 1);
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
    } else {
      setShowScore(true);
      setScore((prevScore) => {
        const finalScore = prevScore;
        setTimeout(() => updatePlayerScore(), 0);
        return finalScore;
      });
    }
  };

  const updatePlayerScore = () => {
    const updatedPlayers = { ...players };
    const finalScore = score; // Capture the final score
    if (
      !updatedPlayers[playerName] ||
      updatedPlayers[playerName] < finalScore
    ) {
      updatedPlayers[playerName] = finalScore;
      setPlayers(updatedPlayers);
      localStorage.setItem("players", JSON.stringify(updatedPlayers));
    }
  };

  const restartCountryQuiz = () => {
    restartQuiz();
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(15);
  };

  const getButtonColor = (answer: string) => {
    if (!isAnswered) return "bg-indigo-100 hover:bg-indigo-200";
    if (answer === questions[currentQuestion].correct_answer)
      return "bg-green-500 text-white";
    if (answer === selectedAnswer) return "bg-red-500 text-white";
    return "bg-indigo-100";
  };

  if (questions.length === 0) {
    return (
      <div className="text-center mt-10 text-white text-2xl">Loading...</div>
    );
  }

  return (
    <>
      {showScore ? (
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full transition-all duration-300 ease-in-out">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-indigo-700">
                Quiz Completed!
              </h2>
              <p className="text-2xl mb-6 text-gray-700">
                You scored{" "}
                <span className="font-bold text-indigo-600">{score}</span> out
                of{" "}
                <span className="font-bold text-indigo-600">
                  {questions.length}
                </span>
              </p>
              <button
                onClick={restartCountryQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
          <div className="mt-8 max-w-2xl w-full bg-white rounded-xl shadow-2xl px-4 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Leaderboard:
            </h3>
            <div className="text-sm flex justify-between sticky top-0 bg-white px-3 py-1 text-gray-600">
              <span className="font-semibold">Rank</span>
              <span className="font-semibold">Player</span>
              <span className="ml-2 font-semibold">Score</span>
            </div>
            <ul className="space-y-2 px-2 overflow-y-scroll h-48 scrolled divide-gray-300 divide-y-2">
              {Object.entries(players).length > 0 ? (
                Object.entries(players)
                  .sort(([, a], [, b]) => b - a)
                  .map(([player, score], index) => (
                    <li
                      key={player}
                      className="text-sm px-2 flex justify-between py-1 text-gray-600"
                    >
                      <span>{index + 1}</span>
                      <span>{player}</span>
                      <span className="ml-2">{score}</span>
                    </li>
                  ))
              ) : (
                <li className="text-sm px-2 py-1 text-gray-600">
                  No one has played yet
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full transition-all duration-300 ease-in-out">
          <div className="mb-8">
            <div className="text-2xl flex justify-between font-bold mb-4 text-indigo-700">
              <h2>
                Question {currentQuestion + 1}/{questions.length}
              </h2>
              <h2>{playerName}</h2>
              <h2>Score: {score}</h2>
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
              What is the capital of{" "}
              <b>{questions[currentQuestion].question}</b>?
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
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
    </>
  );
}
