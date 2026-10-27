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
import { celebrate } from "../../effects/celebrate";

// onDone: called once, when the question card is closed for good
function QuizQuestion({ point, images, showScore, onDone }) {
  const [status, setStatus] = useState("cost");
  const [showModal, setShowModal] = useState(true);
  const [timerStatus, setTimerStatus] = useState("idle");
  // points already awarded via a player's buzzer
  const [isAwarded, setIsAwarded] = useState(false);

  const playersList = useSelector((state) => state.playersList);
  const dispatch = useDispatch();
  const { round, setBuzzerOpen, resetRound } = useHostRoom();

  const isAsking = status === "question" && showModal;
  const hasAnswerer = round.queue.length > 0;

  // buzzers stay open while someone answers, so others can queue up
  useEffect(() => {
    if (isAsking) {
      setBuzzerOpen(timerStatus === "running" || timerStatus === "paused");
    }
  }, [isAsking, timerStatus, setBuzzerOpen]);

  // pause while someone answers, resume once the queue is empty
  useEffect(() => {
    if (!isAsking) {
      return;
    }

    if (timerStatus === "running" && hasAnswerer) {
      setTimerStatus("paused");
    }
    if (timerStatus === "paused" && !hasAnswerer) {
      setTimerStatus("running");
    }
  }, [isAsking, timerStatus, hasAnswerer]);

  useEffect(() => {
    if (isAsking) {
      return resetRound;
    }
  }, [isAsking, resetRound]);

  const closeQuestion = () => {
    setShowModal(false);
    onDone();
  };

  const awardPlayer = (playerId) => {
    const scorerId = getScorerId(playersList, playerId);

    if (scorerId) {
      const { players, teams } = playersList;
      const scorer = [...players, ...teams].find(({ id }) => id === scorerId);

      dispatch(playersActions.increaseScore(1, scorerId));
      celebrate({ name: scorer.name });
    }
    setIsAwarded(true);
  };

  const awardAndShowAnswer = (playerId) => {
    awardPlayer(playerId);
    setStatus("answer");
  };

  // timer stops and buzzers close, the video keeps playing
  const awardAndWatch = (playerId) => {
    awardPlayer(playerId);
    resetRound();
    setTimerStatus("watching");
  };

  const {
    cost,
    question,
    answer,
    img,
    questionImg,
    questionVideo,
    videoStart,
  } = point;

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
                closeQuestion();
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
                    start={videoStart}
                    timerStatus={timerStatus}
                    onStart={() => setTimerStatus("running")}
                  />
                )}
              </div>

              {!isAwarded && (
                <BuzzQueue
                  onCorrect={awardAndShowAnswer}
                  onCorrectWatch={questionVideo ? awardAndWatch : null}
                />
              )}

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
                ? closeQuestion()
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
                  <button onClick={closeQuestion}>Далі</button>
                ) : (
                  <button
                    onClick={() => {
                      showScore();
                      closeQuestion();
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
