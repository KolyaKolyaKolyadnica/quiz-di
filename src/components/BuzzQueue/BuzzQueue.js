import { useSelector } from "react-redux";
import { useHostRoom } from "../../room/HostRoom";
import style from "./BuzzQueue.module.css";

// Buzz queue: the first one answers, "wrong" passes the turn to the next.
function BuzzQueue({ onCorrect }) {
  const { online, round, markWrong } = useHostRoom();
  const { players, teams, mode } = useSelector((state) => state.playersList);

  if (online.length === 0 && round.queue.length === 0) {
    return null;
  }

  const describe = (playerId) => {
    const player = players.find(({ id }) => id === playerId);

    if (!player) {
      return "?";
    }

    const team = teams.find(({ id }) => id === player.teamId);
    return mode === "teams" && team
      ? `${player.name} (${team.name})`
      : player.name;
  };

  if (round.queue.length === 0) {
    return (
      <p className={style.waiting}>
        {round.open
          ? "Чекаємо, хто натисне першим…"
          : "Кнопки гравців увімкнуться, коли піде час"}
      </p>
    );
  }

  const [answeringId, ...restIds] = round.queue;

  return (
    <div className={style.container}>
      <div className={style.answering}>
        <span className={style.label}>Відповідає:</span>
        <span className={style.name}>{describe(answeringId)}</span>

        <div className={style.buttons}>
          <button
            className={style.correct}
            onClick={() => onCorrect(answeringId)}
          >
            Вірно
          </button>
          <button className={style.wrong} onClick={markWrong}>
            Невірно
          </button>
        </div>
      </div>

      {restIds.length > 0 && (
        <ol className={style.queue} start={2}>
          {restIds.map((id) => (
            <li key={id}>{describe(id)}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default BuzzQueue;
