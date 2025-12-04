import { useState } from "react";
import Modal from "../../components/Modal";
import Quiz from "../../components/Quiz/Quiz";
import Navigation from "../../components/Navigation/Navigation";
import ScoreEdit from "../../components/ScoreEdit";
import style from "./PlayingField.module.css";

function PlayingField({ game, backToMenu }) {
  const { name, categories } = game;
  const [playersControllerModal, setPlayersControllerModal] = useState(false);
  const [doneQuestions, setDoneQuestions] = useState([]);
  const [playersScoreModal, setPlayersScoreModal] = useState(false);
  const [costOfQuestion, setCostOfQuestion] = useState(null);

  const showScore = ({ question, cost }) => {
    setPlayersScoreModal(!playersScoreModal);
    setCostOfQuestion(null);

    if (doneQuestions.includes(question)) {
      return;
    }

    setDoneQuestions((prevQuestion) => [...prevQuestion, question]);
    setCostOfQuestion(cost);
  };

  return (
    <div className={style.container}>
      <Navigation
        name={name}
        backToMenu={backToMenu}
        createPlayersList={() =>
          setPlayersControllerModal(!playersControllerModal)
        }
      />

      <Quiz
        categories={categories}
        showScore={showScore}
        doneQuestions={doneQuestions}
      />

      {playersScoreModal && (
        <Modal onClose={() => alert("Вкажи хто правильно відповів")}>
          <ScoreEdit
            costOfQuestion={costOfQuestion}
            closeModal={() => setPlayersScoreModal(!playersScoreModal)}
          />
        </Modal>
      )}
    </div>
  );
}

export default PlayingField;
