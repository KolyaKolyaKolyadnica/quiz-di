import { useState } from "react";
import Modal from "../Modal";
import style from "./QuizQuestion.module.css";
import Timer from "../Timer";
import YouTubeVideo from "../YouTubeVideo";

function QuizQuestion({ point, images, showScore }) {
  const [status, setStatus] = useState("cost");
  const [showModal, setShowModal] = useState(true);
  const [timerStatus, setTimerStatus] = useState("idle");

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
          <Modal onClose={() => alert("Тицьни на кнопку 'Зарахувати бали'")}>
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
                <button
                  onClick={() => {
                    showScore();
                    setShowModal(false);
                  }}
                >
                  Зарахувати бали
                </button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

export default QuizQuestion;
