import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Quiz from "../../components/Quiz/Quiz";
import Navigation from "../../components/Navigation/Navigation";
import ScoreEdit from "../../components/ScoreEdit";
import Leaderboard from "../../components/Leaderboard";
import style from "./PlayingField.module.css";

function PlayingField({ game }) {
  const { categories } = game.data;
  const [playersScoreModal, setPlayersScoreModal] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const questionsCount = categories.reduce(
    (sum, { points }) => sum + points.length,
    0
  );

  // last question closed and its points awarded: show the winners
  useEffect(() => {
    if (doneCount === questionsCount && !playersScoreModal) {
      setShowLeaderboard(true);
    }
  }, [doneCount, questionsCount, playersScoreModal]);

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
        onQuestionDone={() => setDoneCount((prev) => prev + 1)}
      />

      <button
        className={`button-secondary ${style.finishButton}`}
        onClick={() => setShowLeaderboard(true)}
      >
        🏆 Фінал
      </button>

      {playersScoreModal && (
        <Modal onClose={() => alert("Вкажи хто правильно відповів")}>
          <ScoreEdit closeModal={() => setPlayersScoreModal(false)} />
        </Modal>
      )}

      {showLeaderboard && (
        <Modal onClose={() => setShowLeaderboard(false)}>
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        </Modal>
      )}
    </div>
  );
}

export default PlayingField;
