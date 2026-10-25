import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import style from "./QuizQuestion.module.css";
import Timer from "../Timer";
import YouTubeVideo from "../YouTubeVideo";
import BuzzQueue from "../BuzzQueue";
import playersActions from "../../redux/actions";
import { getScorerId } from "../../redux/selectors";
import { useHostRoom } from "../../room/HostRoom";

function QuizQuestion({ point, images, showScore }) {
  const [status, setStatus] = useState("cost");
  const [showModal, setShowModal] = useState(true);
  const [timerStatus, setTimerStatus] = useState("idle");
  // points already awarded via a player's buzzer
  const [isAwarded, setIsAwarded] = useState(false);

  const playersList = useSelector((state) => state.playersList);
  const dispatch = useDispatch();
  const { setBuzzerOpen, resetRound } = useHostRoom();

  const isAsking = status === "question" && showModal;

  // buzzers are open while the timer runs
  useEffect(() => {
    if (isAsking) {
      setBuzzerOpen(timerStatus === "running");
    }
  }, [isAsking, timerStatus, setBuzzerOpen]);

  useEffect(() => {
    if (isAsking) {
      return resetRound;
    }
  }, [isAsking, resetRound]);

  const awardPlayer = (playerId) => {
    const scorerId = getScorerId(playersList, playerId);

    if (scorerId) {
      dispatch(playersActions.increaseScore(1, scorerId));
    }
    setIsAwarded(true);
    setStatus("answer");
  };

  const { cost, question, answer, img, questionImg, questionVideo } = point;

  if (status === "cost") {
    return (
      <td onClick={() => setStatus("question")}>
        <div className={style.cost}>{cost}</div>
      </td>
    );
  }

  if (status === "question") {
    return (
      <>
        <td></td>

        {showModal && (
          <Modal
            onClose={() => {
              const isOk = window.confirm(
                "Пропустити це питання? (воно буде прибране і бали не зарахуються нікому)"
              );
              if (isOk) {
                setShowModal(false);
              }
            }}
          >
            <div className={style.container}>
              <div className={style.questionContainer}>
                <p className={style.textMain}>{question}</p>
                {questionImg && (
                  <img
                    className={style.image}
                    src={images[questionImg]}
                    alt="Ілюстрація до питання"
                  />
                )}
                {questionVideo && (
                  <YouTubeVideo
                    videoId={questionVideo}
                    timerStatus={timerStatus}
                    onStart={() => setTimerStatus("running")}
                  />
                )}
              </div>

              <BuzzQueue onCorrect={awardPlayer} />

              <Timer
                status={timerStatus}
                onStatusChange={setTimerStatus}
                handleAnswer={() => {
                  setStatus("answer");
                }}
              />
            </div>
          </Modal>
        )}
      </>
    );
  }

  if (status === "answer") {
    return (
      <>
        <td></td>

        {showModal && (
          <Modal
            onClose={() =>
              isAwarded
                ? setShowModal(false)
                : alert("Тицьни на кнопку 'Зарахувати бали'")
            }
          >
            <div className={style.container}>
              <p className={style.textMain}>
                <span className={style.textComment}>Відповідь:</span>
                {answer}
                {img && (
                  <img
                    className={style.image}
                    src={images[img]}
                    alt="Ілюстрація до питання"
                  />
                )}
              </p>
              <div className="modal-button-container">
                {isAwarded ? (
                  <button onClick={() => setShowModal(false)}>Далі</button>
                ) : (
                  <button
                    onClick={() => {
                      showScore();
                      setShowModal(false);
                    }}
                  >
                    Зарахувати бали
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

export default QuizQuestion;
