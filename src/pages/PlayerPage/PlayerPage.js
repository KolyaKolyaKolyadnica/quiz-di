import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { nanoid } from "@reduxjs/toolkit";

import { hostPeerId, RETRY_DELAY } from "../../room/room";
import style from "./PlayerPage.module.css";

const ID_KEY = "quiz-di-player-id";
const NAME_KEY = "quiz-di-player-name";

// persistent device id so the host recognizes the player after a reload
const getPlayerId = () => {
  let id = localStorage.getItem(ID_KEY);

  if (!id) {
    id = nanoid();
    localStorage.setItem(ID_KEY, id);
  }
  return id;
};

const statusText = {
  connecting: "Підключаюсь…",
  waiting: "Чекаю на ведучого…",
  connected: "Підключено",
  kicked: "Ведучий прибрав тебе з гри",
};

function PlayerPage({ roomCode }) {
  const [playerId] = useState(getPlayerId);
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || "");
  const [isJoined, setIsJoined] = useState(false);
  // "connecting" | "waiting" | "connected" | "kicked"
  const [status, setStatus] = useState("connecting");
  const [game, setGame] = useState(null);
  const connRef = useRef(null);

  useEffect(() => {
    if (!isJoined) {
      return;
    }

    const peer = new Peer();
    let retryId;
    let isStopped = false;

    const retry = () => {
      clearTimeout(retryId);

      if (!isStopped) {
        retryId = setTimeout(connect, RETRY_DELAY);
      }
    };

    const connect = () => {
      if (peer.disconnected) {
        peer.reconnect();
        retry();
        return;
      }

      const conn = peer.connect(hostPeerId(roomCode), { reliable: true });
      connRef.current = conn;

      conn.on("open", () => {
        setStatus("connected");
        conn.send({ type: "hello", id: playerId, name });
      });

      conn.on("data", (message) => {
        if (message.type === "state") {
          setGame(message);
        }

        if (message.type === "kicked") {
          isStopped = true;
          setStatus("kicked");
          setGame(null);
        }
      });

      conn.on("close", () => {
        if (connRef.current !== conn || isStopped) {
          return;
        }
        setStatus("waiting");
        setGame(null);
        retry();
      });
    };

    peer.on("open", connect);

    peer.on("error", (err) => {
      // host hasn't opened the game yet or is reloading
      if (err.type === "peer-unavailable") {
        setStatus("waiting");
      }
      retry();
    });

    return () => {
      isStopped = true;
      clearTimeout(retryId);
      connRef.current = null;
      peer.destroy();
    };
  }, [isJoined, roomCode, playerId, name]);

  const queuePosition = game
    ? game.queue.findIndex(({ id }) => id === playerId)
    : -1;
  const isEligible = Boolean(game && game.eligible.includes(playerId));
  const teamName = game?.playerTeams?.[playerId];
  const canPress =
    status === "connected" &&
    isEligible &&
    game.open &&
    queuePosition === -1;

  const buzz = () => {
    if (canPress) {
      connRef.current.send({ type: "buzz" });
    }
  };

  const buzzRef = useRef(buzz);
  buzzRef.current = buzz;

  // Space works as the buzzer on desktop
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        buzzRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!isJoined) {
    return (
      <div className={style.container}>
        <form
          className={style.joinForm}
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = name.trim();

            if (!trimmed) {
              return;
            }
            localStorage.setItem(NAME_KEY, trimmed);
            setName(trimmed);
            setIsJoined(true);
          }}
        >
          <h1 className={style.title}>Кімната {roomCode}</h1>
          <input
            type="text"
            placeholder="Твоє ім'я…"
            value={name}
            maxLength={30}
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
          <button>Приєднатись</button>
        </form>
      </div>
    );
  }

  let buttonText = "Чекай на питання";
  let hint = "";

  if (game && !isEligible && game.mode === "teams") {
    hint = "Ведучий ще не додав тебе до команди";
  } else if (queuePosition === 0) {
    buttonText = "Відповідай!";
  } else if (queuePosition > 0) {
    buttonText = `Ти ${queuePosition + 1}-й у черзі`;
    hint = `Зараз відповідає ${game.queue[0].name}`;
  } else if (canPress) {
    buttonText = "Тисни!";
  }

  if (game && queuePosition === -1 && game.queue.length > 0 && !hint) {
    hint = `Відповідає ${game.queue[0].name}`;
  }

  const buttonClassName = [
    style.buzzer,
    canPress && style.buzzerActive,
    queuePosition === 0 && style.buzzerAnswering,
    queuePosition > 0 && style.buzzerQueued,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.who}>
          <span className={style.name}>{name}</span>
          {teamName && (
            <span key={teamName} className={style.team}>
              Команда: {teamName}
            </span>
          )}
        </div>
        <span
          className={`${style.status} ${
            status === "connected" ? style.statusOk : ""
          }`}
        >
          {statusText[status]}
        </span>
      </header>

      {status !== "kicked" && (
        <>
          <button
            className={buttonClassName}
            disabled={!canPress}
            onClick={buzz}
          >
            {buttonText}
          </button>

          <p className={style.hint}>{hint}</p>
        </>
      )}

      {game && game.scoreboard.length > 0 && (
        <ol className={style.scoreboard}>
          {game.scoreboard.map(({ id, name, score }) => (
            <li key={id}>
              {name}
              <span>{score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default PlayerPage;
