import { useEffect, useState } from "react";
import "./App.css";

import games, { getGameById } from "../data/games";
import PlayingField from "../pages/PlayingField";
import Modal from "./Modal";
import PlayersController from "./PlayersController";
import { useDispatch, useSelector } from "react-redux";

import playersActions, { gameActions } from "../redux/actions";

const pages = {
  MENU: "menu",
  PLAY: "play",
};

function App() {
  const [page, setPage] = useState(pages.MENU);
  const [showModal, setShowModal] = useState(false);

  const { players, teams, mode } = useSelector((state) => state.playersList);
  const selectedGameId = useSelector((state) => state.game.selectedId);
  const game = getGameById(selectedGameId);

  const dispatch = useDispatch();

  useEffect(() => {
    Object.entries(game.theme).forEach(([name, value]) =>
      document.documentElement.style.setProperty(name, value)
    );
  }, [game]);

  const startGame = () => {
    if (players.length === 0) {
      alert("Ну хочаб одного гравця введи :(");
      return;
    }

    if (mode === "teams") {
      if (teams.length === 0) {
        alert("Створи хоча б одну команду");
        return;
      }

      const teamless = players.filter((player) => !player.teamId);
      if (teamless.length > 0) {
        alert(
          `Розподіли по командах: ${teamless.map(({ name }) => name).join(", ")}`
        );
        return;
      }
    }

    setPage(pages.PLAY);

    setShowModal(!showModal);

    const scorers = mode === "teams" ? teams : players;
    dispatch(playersActions.createStartScore(scorers.map(({ id }) => id)));
  };

  const closeModal = () => {
    setShowModal(!showModal);
  };

  if (page === pages.MENU) {
    return (
      <>
        {!showModal && (
          <>
            <div className="startMenuContainer">
              <div className="gameSelect">
                {games.map(({ id, title }) => (
                  <button
                    key={id}
                    className={id === game.id ? "gameSelectActive" : ""}
                    onClick={() => dispatch(gameActions.selectGame(id))}
                  >
                    {title}
                  </button>
                ))}
              </div>

              <button
                className="logoButton"
                onClick={() => setShowModal(!showModal)}
              >
                <img src={game.logo} alt={game.title} />
              </button>
            </div>
          </>
        )}

        {showModal && (
          <Modal onClose={closeModal}>
            <PlayersController onClickStartGame={() => startGame()} />
          </Modal>
        )}
      </>
    );
  }

  if (page === pages.PLAY) {
    return (
      <PlayingField game={game} />
    );
  }
}

export default App;
