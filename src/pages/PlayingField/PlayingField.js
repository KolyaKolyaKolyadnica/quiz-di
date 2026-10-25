import { useState } from "react";
import Modal from "../../components/Modal";
import Quiz from "../../components/Quiz/Quiz";
import Navigation from "../../components/Navigation/Navigation";
import ScoreEdit from "../../components/ScoreEdit";
import style from "./PlayingField.module.css";

function PlayingField({ game }) {
  const { categories } = game.data;
  const [playersScoreModal, setPlayersScoreModal] = useState(false);

  return (
    <div
      className={style.container}
      style={{
        backgroundImage: `url(${game.background})`,
        backgroundSize: game.backgroundSize,
      }}
    >
      <Navigation />

      <Quiz
        categories={categories}
        images={game.images}
        showScore={() => setPlayersScoreModal(true)}
      />

      {playersScoreModal && (
        <Modal onClose={() => alert("Вкажи хто правильно відповів")}>
          <ScoreEdit closeModal={() => setPlayersScoreModal(false)} />
        </Modal>
      )}
    </div>
  );
}

export default PlayingField;
