import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import reduxStore from "./redux/store";
import "./index.css";
import App from "./components/App";
import PlayerPage from "./pages/PlayerPage";
import { HostRoomProvider } from "./room/HostRoom";
import { getRoomFromUrl } from "./room/room";

const root = ReactDOM.createRoot(document.getElementById("root"));

// ?room=CODE in the URL means a player's device, otherwise the host screen
const roomCode = getRoomFromUrl();

root.render(
  <React.StrictMode>
    {roomCode ? (
      <PlayerPage roomCode={roomCode.toUpperCase()} />
    ) : (
      <Provider store={reduxStore.store}>
        <PersistGate loading={null} persistor={reduxStore.persistor}>
          <HostRoomProvider>
            <App />
          </HostRoomProvider>
        </PersistGate>
      </Provider>
    )}
  </React.StrictMode>
);
