import { useState } from "react";
import { IconContext } from "react-icons";
import { AiFillPlusCircle } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import playersActions from "../../redux/actions";
import { useHostRoom } from "../../room/HostRoom";
import { joinUrl } from "../../room/room";
import style from "./PlayersController.module.css";

const roomStatusText = {
  connecting: "підключення…",
  ready: "гравці можуть заходити",
  error: "немає зв'язку з сервером PeerJS",
};

export default function PlayersController({ onClickStartGame }) {
  const [value, setValue] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const { players, teams, mode } = useSelector((state) => state.playersList);
  const { roomCode, status, online, kick } = useHostRoom();

  const dispatch = useDispatch();

  const addNewPlayer = (e) => {
    e.preventDefault();

    if (!value.trim()) {
      return;
    }

    setValue("");

    dispatch(playersActions.addPlayer(value.trim()));
  };

  const addNewTeam = (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      return;
    }

    setTeamName("");

    dispatch(playersActions.addTeam(teamName.trim()));
  };

  const deletePlayer = (id) => {
    kick(id);
    dispatch(playersActions.deletePlayer(id));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl(roomCode)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    });
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Запиши усіх гравців.</h2>

      <div className={style.room}>
        <div>
          Кімната <b className={style.roomCode}>{roomCode}</b>
          <span
            className={`${style.roomStatus} ${
              status === "ready" ? style.roomStatusOk : ""
            }`}
          >
            {roomStatusText[status]}
          </span>
        </div>
        <button className="button-secondary" onClick={copyLink}>
          {isCopied ? "Скопійовано!" : "Посилання для гравців"}
        </button>
      </div>

      <div className={style.modeSelect}>
        <button
          className={mode === "solo" ? style.modeActive : ""}
          onClick={() => dispatch(playersActions.setMode("solo"))}
        >
          Кожен сам за себе
        </button>
        <button
          className={mode === "teams" ? style.modeActive : ""}
          onClick={() => dispatch(playersActions.setMode("teams"))}
        >
          Команди
        </button>
      </div>

      {mode === "teams" && (
        <>
          <form onSubmit={addNewTeam} className={style.form}>
            <input
              type="text"
              placeholder=" Назва команди..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button className={`${style.btn} ${style.green}`}>
              <IconContext.Provider value={{ size: "30px" }}>
                <AiFillPlusCircle />
              </IconContext.Provider>
            </button>
          </form>

          {teams.length > 0 && (
            <ul className={style.teams}>
              {teams.map((team) => (
                <li key={team.id} className={style.team}>
                  {team.name}
                  <button
                    className={`${style.btn} ${style.red}`}
                    onClick={() => dispatch(playersActions.deleteTeam(team.id))}
                  >
                    <IconContext.Provider value={{ size: "24px" }}>
                      <IoIosCloseCircle />
                    </IconContext.Provider>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <form onSubmit={addNewPlayer} className={style.form}>
        <input
          type="text"
          placeholder=" Введіть ім'я..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className={`${style.btn} ${style.green}`}>
          <IconContext.Provider value={{ size: "30px" }}>
            <AiFillPlusCircle />
          </IconContext.Provider>
        </button>
      </form>

      <div className={style.listContainer}>
        <ol className={style.list}>
          {players.map((player) => (
            <li key={player.id} className={style.listItem}>
              <div className={style.listItemContentContainer}>
                <span className={style.playerName}>
                  <span
                    className={`${style.dot} ${
                      online.includes(player.id) ? style.dotOnline : ""
                    }`}
                    title={
                      online.includes(player.id)
                        ? "Підключений зі свого пристрою"
                        : "Не підключений"
                    }
                  />
                  {player.name}
                </span>

                <span className={style.playerActions}>
                  {mode === "teams" && (
                    <select
                      className={style.teamSelect}
                      value={player.teamId || ""}
                      onChange={(e) =>
                        dispatch(
                          playersActions.setPlayerTeam(
                            player.id,
                            e.target.value || null
                          )
                        )
                      }
                    >
                      <option value="">— без команди —</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    className={`${style.btn} ${style.red}`}
                    onClick={() => deletePlayer(player.id)}
                  >
                    <IconContext.Provider value={{ size: "30px" }}>
                      <IoIosCloseCircle />
                    </IconContext.Provider>
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="modal-button-container">
        <button onClick={onClickStartGame} className={style.startButton}>
          Поїхали!
        </button>
      </div>
    </div>
  );
}
