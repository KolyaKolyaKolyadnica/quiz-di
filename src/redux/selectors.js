import { createSelector } from "@reduxjs/toolkit";

const selectPlayersList = (state) => state.playersList;

// Who gets points: players or teams, depending on the mode.
export const selectScorers = createSelector(
  selectPlayersList,
  ({ mode, players, teams, score }) =>
    (mode === "teams" ? teams : players).map(({ id, name }) => ({
      id,
      name,
      score: score[id] || 0,
    }))
);

// Who gets points for a player's correct answer (null — nobody).
export const getScorerId = ({ mode, players }, playerId) => {
  if (mode !== "teams") {
    return playerId;
  }

  const player = players.find(({ id }) => id === playerId);
  return player ? player.teamId : null;
};
