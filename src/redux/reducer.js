import { combineReducers, createReducer } from "@reduxjs/toolkit";

import playersActions, { gameActions } from "./actions";

const players = createReducer([], (builder) => {
  builder
    .addCase(playersActions.addPlayer, (state, { payload }) => [
      ...state,
      payload,
    ])
    .addCase(playersActions.deletePlayer, (state, { payload }) =>
      state.filter((player) => player !== payload)
    );
});

const score = createReducer([], (builder) => {
  builder
    .addCase(playersActions.createStartScore, (_, { payload }) =>
      payload.map(() => 0)
    )
    .addCase(playersActions.increasePlayerScore, (state, { payload }) =>
      state.map((playerScore, index) =>
        index === payload.index ? playerScore + payload.value : playerScore
      )
    );
});

const selectedId = createReducer(null, (builder) => {
  builder.addCase(gameActions.selectGame, (_, { payload }) => payload);
});

const playersFromReducer = combineReducers({ players, score });

export const gameReducer = combineReducers({ selectedId });

export default playersFromReducer;
