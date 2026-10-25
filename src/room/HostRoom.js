import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Peer from "peerjs";
import { useDispatch, useSelector } from "react-redux";

import playersActions, { gameActions } from "../redux/actions";
import { selectScorers } from "../redux/selectors";
import { createRoomCode, hostPeerId, RETRY_DELAY } from "./room";

const HostRoomContext = createContext(null);

export const useHostRoom = () => useContext(HostRoomContext);

const emptyRound = { open: false, queue: [] };

// Who can buzz: in team mode only players assigned to a team.
const canBuzz = ({ mode, players }, playerId) => {
  const player = players.find(({ id }) => id === playerId);

  if (!player) {
    return false;
  }

  return mode !== "teams" || Boolean(player.teamId);
};

export function HostRoomProvider({ children }) {
  const dispatch = useDispatch();
  const roomCode = useSelector((state) => state.game.roomCode);
  const playersList = useSelector((state) => state.playersList);
  const scorers = useSelector(selectScorers);

  // "connecting" | "ready" | "error"
  const [status, setStatus] = useState("connecting");
  const [online, setOnline] = useState([]);
  // queue: buzz order, the first one answers now
  const [round, setRound] = useState(emptyRound);

  // conn -> player id
  const connectionsRef = useRef(new Map());
  const playersListRef = useRef(playersList);
  playersListRef.current = playersList;

  const { players, mode } = playersList;

  const stateMessage = {
    type: "state",
    mode,
    open: round.open,
    queue: round.queue.map((id) => ({
      id,
      name: players.find((player) => player.id === id)?.name || "?",
    })),
    eligible: players
      .filter(({ id }) => canBuzz(playersList, id))
      .map(({ id }) => id),
    scoreboard: scorers,
  };
  const stateMessageRef = useRef(stateMessage);
  stateMessageRef.current = stateMessage;

  useEffect(() => {
    if (!roomCode) {
      dispatch(gameActions.setRoomCode(createRoomCode()));
    }
  }, [roomCode, dispatch]);

  useEffect(() => {
    if (!roomCode) {
      return;
    }

    const connections = connectionsRef.current;
    let peer;
    let retryId;
    let isStopped = false;

    const updateOnline = () =>
      setOnline([...new Set(connections.values())].filter(Boolean));

    const handleMessage = (conn, message) => {
      if (message.type === "hello") {
        const name = String(message.name || "").trim().slice(0, 30);

        if (!message.id || !name) {
          return;
        }

        // same player from another tab — drop the old connection
        connections.forEach((playerId, otherConn) => {
          if (playerId === message.id && otherConn !== conn) {
            connections.delete(otherConn);
            otherConn.close();
          }
        });

        dispatch(playersActions.addPlayer(name, message.id));
        connections.set(conn, message.id);
        updateOnline();
        conn.send(stateMessageRef.current);
        return;
      }

      if (message.type === "buzz") {
        const playerId = connections.get(conn);

        if (!canBuzz(playersListRef.current, playerId)) {
          return;
        }

        setRound((prev) => {
          if (!prev.open || prev.queue.includes(playerId)) {
            return prev;
          }

          return { ...prev, queue: [...prev.queue, playerId] };
        });
      }
    };

    const start = () => {
      setStatus("connecting");
      peer = new Peer(hostPeerId(roomCode));

      peer.on("open", () => setStatus("ready"));

      peer.on("connection", (conn) => {
        conn.on("open", () => connections.set(conn, null));
        conn.on("data", (message) => handleMessage(conn, message));
        conn.on("close", () => {
          connections.delete(conn);
          updateOnline();
        });
      });

      peer.on("disconnected", () => {
        if (!isStopped) {
          peer.reconnect();
        }
      });

      peer.on("error", (err) => {
        // after a reload the server holds the old id for a few seconds — retry
        if (err.type === "unavailable-id" || err.type === "server-error") {
          peer.destroy();
          retryId = setTimeout(start, RETRY_DELAY);
          return;
        }

        if (err.type === "network" || err.type === "socket-error") {
          setStatus("error");
        }
      });
    };

    start();

    return () => {
      isStopped = true;
      clearTimeout(retryId);
      connections.clear();
      peer.destroy();
    };
  }, [roomCode, dispatch]);

  const messageJson = JSON.stringify(stateMessage);

  useEffect(() => {
    connectionsRef.current.forEach((playerId, conn) => {
      if (playerId && conn.open) {
        conn.send(stateMessageRef.current);
      }
    });
  }, [messageJson]);

  const kick = (playerId) => {
    connectionsRef.current.forEach((id, conn) => {
      if (id === playerId) {
        conn.send({ type: "kicked" });
        connectionsRef.current.delete(conn);
        setTimeout(() => conn.close(), 500);
      }
    });
    setOnline((prev) => prev.filter((id) => id !== playerId));
  };

  const setBuzzerOpen = useCallback(
    (open) => setRound((prev) => ({ ...prev, open })),
    []
  );

  // the player may buzz again for another try
  const markWrong = useCallback(
    () => setRound((prev) => ({ ...prev, queue: prev.queue.slice(1) })),
    []
  );

  const resetRound = useCallback(() => setRound(emptyRound), []);

  const value = {
    roomCode,
    status,
    online,
    round,
    kick,
    setBuzzerOpen,
    markWrong,
    resetRound,
  };

  return (
    <HostRoomContext.Provider value={value}>{children}</HostRoomContext.Provider>
  );
}
