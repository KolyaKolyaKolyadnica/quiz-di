import { useState } from "react";
import Modal from "../Modal";
import Score from "../Score";
import style from "./Navigation.module.css";

function Navigation({ name, backToMenu, players, playersScore }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className={style.navigation}>
        <button
          type="button"
          onClick={() => setShowModal(!showModal)}
          className={style.btn}
        >
          Перевірити результат
        </button>

        <button type="button" onClick={backToMenu} className={style.btn}>
          На головну
        </button>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(!showModal)}>
          <Score players={players} playersScore={playersScore} />
        </Modal>
      )}
    </>
  );
}

export default Navigation;
