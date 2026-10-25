import { createAction, nanoid } from "@reduxjs/toolkit";

// id is passed for players joining from their device, otherwise generated
const addPlayer = createAction("players/addPlayer", (name, id = nanoid()) => ({
  payload: { id, name },
}));
const deletePlayer = createAction("players/deletePlayer");
const setPlayerTeam = createAction(
  "players/setPlayerTeam",
  (playerId, teamId) => ({
    payload: { playerId, teamId },
  })
);

const addTeam = createAction("players/addTeam", (name) => ({
  payload: { id: nanoid(), name },
}));
const deleteTeam = createAction("players/deleteTeam");

// "solo" — everyone for themselves, "teams" — points go to the player's team
const setMode = createAction("players/setMode");

const createStartScore = createAction("players/createStartScore");
const increaseScore = createAction(
  "players/increaseScore",
  (value, scorerId) => ({
    payload: {
      value,
      scorerId,
    },
  })
);

const selectGame = createAction("game/selectGame");
const setRoomCode = createAction("game/setRoomCode");

const playersActions = {
  addPlayer,
  deletePlayer,
  setPlayerTeam,
  addTeam,
  deleteTeam,
  setMode,
  createStartScore,
  increaseScore,
};

export const gameActions = { selectGame, setRoomCode };

export default playersActions;
