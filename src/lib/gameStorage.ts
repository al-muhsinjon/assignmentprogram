// export interface CurrentGame {
//   playerName: string;
//   score: number;
//   questionIndex: number;
// }

// export interface GameResult {
//   playerName: string;
//   score: number;
// }

// export const saveCurrentGame = (game: CurrentGame) => {
//   localStorage.setItem("currentGame", JSON.stringify(game));
// };

// export const getCurrentGame = (): CurrentGame | null => {
//   const game = localStorage.getItem("currentGame");
//   return game ? JSON.parse(game) : null;
// };

// export const clearCurrentGame = () => {
//   localStorage.removeItem("currentGame");
// };

// export const saveGameResult = (playerName: string, score: number) => {
//   const history = getGameHistory();
//   const existingPlayerIndex = history.findIndex(
//     (result) => result.playerName === playerName
//   );

//   if (existingPlayerIndex !== -1) {
//     if (history[existingPlayerIndex].score < score) {
//       history[existingPlayerIndex].score = score;
//     }
//   } else {
//     history.push({ playerName, score });
//   }

//   localStorage.setItem("gameHistory", JSON.stringify(history));
// };

// export const getGameHistory = (): GameResult[] => {
//   const history = localStorage.getItem("gameHistory");
//   return history ? JSON.parse(history) : [];
// };

export interface CurrentGame {
  playerName: string;
  score: number;
  questionIndex: number;
}

export interface GameResult {
  playerName: string;
  score: number;
}

export const saveCurrentGame = (game: CurrentGame) => {
  try {
    localStorage.setItem("currentGame", JSON.stringify(game));
  } catch (error) {
    console.error("Error saving currentGame to localStorage:", error);
  }
};

export const getCurrentGame = (): CurrentGame | null => {
  const game = localStorage.getItem("currentGame");
  if (!game) return null;
  try {
    return JSON.parse(game);
  } catch (error) {
    console.error("Error parsing currentGame from localStorage:", error);
    return null;
  }
};

export const clearCurrentGame = () => {
  localStorage.removeItem("currentGame");
};

export const saveGameResult = (playerName: string, score: number) => {
  const history = getGameHistory();
  const existingPlayerIndex = history.findIndex(
    (result) => result.playerName === playerName
  );

  if (existingPlayerIndex !== -1) {
    if (history[existingPlayerIndex].score < score) {
      history[existingPlayerIndex].score = score;
    }
  } else {
    history.push({ playerName, score });
  }

  try {
    localStorage.setItem("gameHistory", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving gameHistory to localStorage:", error);
  }
};

export const getGameHistory = (): GameResult[] => {
  const history = localStorage.getItem("gameHistory");
  if (!history) return [];
  try {
    return JSON.parse(history);
  } catch (error) {
    console.error("Error parsing gameHistory from localStorage:", error);
    return [];
  }
};
