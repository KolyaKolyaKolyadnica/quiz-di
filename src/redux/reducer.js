import { combineReducers, createReducer } from "@reduxjs/toolkit";

import playersActions, { gameActions } from "./actions";

// player: { id, name, teamId }
const players = createReducer([], (builder) => {
  builder
    .addCase(playersActions.addPlayer, (state, { payload }) => {
      const existing = state.find((player) => player.id === payload.id);

      if (existing) {
        existing.name = payload.name;
        return;
      }

      state.push({ ...payload, teamId: null });
    })
    .addCase(playersActions.deletePlayer, (state, { payload }) =>
      state.filter((player) => player.id !== payload)
    )
    .addCase(playersActions.setPlayerTeam, (state, { payload }) => {
      const player = state.find(({ id }) => id === payload.playerId);

      if (player) {
        player.teamId = payload.teamId;
      }
    })
    .addCase(playersActions.deleteTeam, (state, { payload }) =>
      state.map((player) =>
        player.teamId === payload ? { ...player, teamId: null } : player
      )
    );
});

const teams = createReducer([], (builder) => {
  builder
    .addCase(playersActions.addTeam, (state, { payload }) => [
      ...state,
      payload,
    ])
    .addCase(playersActions.deleteTeam, (state, { payload }) =>
      state.filter((team) => team.id !== payload)
    );
});

const mode = createReducer("solo", (builder) => {
  builder.addCase(playersActions.setMode, (_, { payload }) => payload);
});

// { [player or team id]: points }
const score = createReducer({}, (builder) => {
  builder
    .addCase(playersActions.createStartScore, (_, { payload }) =>
      Object.fromEntries(payload.map((scorerId) => [scorerId, 0]))
    )
    .addCase(playersActions.increaseScore, (state, { payload }) => {
      state[payload.scorerId] = (state[payload.scorerId] || 0) + payload.value;
    });
});

const selectedId = createReducer(null, (builder) => {
  builder.addCase(gameActions.selectGame, (_, { payload }) => payload);
});

// persisted so players' links survive a host page reload
const roomCode = createReducer(null, (builder) => {
  builder.addCase(gameActions.setRoomCode, (_, { payload }) => payload);
});

const playersFromReducer = combineReducers({ players, teams, mode, score });

export const gameReducer = combineReducers({ selectedId, roomCode });

export default playersFromReducer;
