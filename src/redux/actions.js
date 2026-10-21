import { createAction } from "@reduxjs/toolkit";

const addPlayer = createAction("players/addPlayer");
const deletePlayer = createAction("players/deletePlayer");

const createStartScore = createAction("players/createStartScore");
const increasePlayerScore = createAction(
  "players/increasePlayerScore",
  (value, index) => ({
    payload: {
      value,
      index,
    },
  })
);

const selectGame = createAction("game/selectGame");

const playersActions = {
  addPlayer,
  deletePlayer,
  createStartScore,
  increasePlayerScore,
};

export const gameActions = { selectGame };

export default playersActions;
