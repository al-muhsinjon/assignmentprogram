import React from "react";

interface ModalStore {
  onClose: () => void;
  viewLeaderBoard: boolean;
  players: Record<string, number>;
}

const LeaderBoardModal: React.FC<ModalStore> = ({
  viewLeaderBoard,
  onClose,
  players,
}) => {
  return (
    <>
      {viewLeaderBoard && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
        >
          <div
            className="mt-8 max-w-md w-full bg-white rounded-xl shadow-2xl px-4 py-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Previous Players:
            </h3>
            <div className="text-sm flex justify-between sticky top-0 bg-white px-3 py-1 text-gray-600 ">
              <span className="font-semibold">Rank</span>
              <span className="font-semibold">Player</span>
              <span className="ml-2 font-semibold">Score</span>
            </div>
            <ul className="space-y-2 px-2 overflow-y-scroll h-48 scrolled divide-gray-300 divide-y-2">
              {Object.entries(players).map(([player, score], index) => (
                <li
                  key={player}
                  className="text-sm px-2 flex justify-between py-1 text-gray-600 "
                >
                  <span>{index + 1}</span>
                  <span>{player}</span>
                  <span className="ml-2">{score || "0"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderBoardModal;
