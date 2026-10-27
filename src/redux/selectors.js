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

// Scorers grouped by score, best first; equal scores share a place.
export const selectRanking = createSelector(selectScorers, (scorers) => {
  const groups = [];

  [...scorers]
    .sort((a, b) => b.score - a.score)
    .forEach((scorer) => {
      const last = groups[groups.length - 1];

      if (last && last.score === scorer.score) {
        last.scorers.push(scorer);
        return;
      }

      groups.push({
        place: groups.length + 1,
        score: scorer.score,
        scorers: [scorer],
      });
    });

  return groups;
});

// Who gets points for a player's correct answer (null — nobody).
export const getScorerId = ({ mode, players }, playerId) => {
  if (mode !== "teams") {
    return playerId;
  }

  const player = players.find(({ id }) => id === playerId);
  return player ? player.teamId : null;
};
