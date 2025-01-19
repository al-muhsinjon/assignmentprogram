"use client";

import { useState, useEffect } from "react";
import { getCurrentGame } from "@/lib/gameStorage";

interface QuizCustomizationssProps {
  handleStart: (playerName: string) => void;
  questions: QuizQuestion[];
}

const QuizCustomizationss: React.FC<QuizCustomizationssProps> = ({
  handleStart,
  questions,
}) => {
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  console.log(questions);

  useEffect(() => {
    const currentGame = getCurrentGame();
    if (currentGame) {
      setName(currentGame.playerName);
      setShowModal(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      handleStart(name);
    }
  };

  const handleNewGame = () => {
    setShowModal(false);
    handleStart(name);
  };

  const handleContinueGame = () => {
    setShowModal(false);
    handleStart(name);
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to the World Capitals Quiz!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your name to start the quiz
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Quiz
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Previous Game Found</h3>
            <p className="mb-4">
              You have an unfinished game. Do you want to continue or start a
              new game?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleContinueGame}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Continue
              </button>
              <button
                onClick={handleNewGame}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCustomizationss;
