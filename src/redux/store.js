import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import playersFromReducer, { gameReducer } from "./reducer";

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
];

const persistConfig = {
  key: "players",
  storage,
  // blacklist: ["score"], // kept persisted to see past results
};

const gamePersistConfig = {
  key: "game",
  storage,
};

const rootReducer = combineReducers({
  playersList: persistReducer(persistConfig, playersFromReducer),
  game: persistReducer(gamePersistConfig, gameReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV === "development",
});

const persistor = persistStore(store);

const reduxStore = { store, persistor };

export default reduxStore;
