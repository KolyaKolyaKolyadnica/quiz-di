import { useState } from "react";
import "./App.css";

import series from "../data/series.json";
import PlayingField from "../pages/PlayingField";
import Modal from "./Modal";
import PlayersController from "./PlayersController";
import { useDispatch, useSelector } from "react-redux";

import playersActions from "../redux/actions";
import Logo from "../assets/photo_5319271719010766001_x.jpg";

const pages = {
  MENU: "menu",
  CREATE: "create",
  PLAY: "play",
};

function App() {
  const [page, setPage] = useState(pages.MENU);
  const [showModal, setShowModal] = useState(false);

  const players = useSelector((state) => state.playersList.players);

  const dispatch = useDispatch();

  const startGame = () => {
    if (players.length === 0) {
      alert("Ну хочаб одного гравця введи :(");
      return;
    }
    setPage(pages.PLAY);

    setShowModal(!showModal);

    dispatch(playersActions.createStartScore(players));
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
              <button onClick={() => setShowModal(!showModal)}>
                <img src={Logo} />
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
      <>
        <PlayingField
          game={series}
          backToMenu={() => setPage(pages.MENU)}
          players={players}
        />
      </>
    );
  }
}

export default App;
