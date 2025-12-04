import { useState } from "react";
import Modal from "../Modal";
import style from "./QuizQuestion.module.css";

function QuizQuestion({ point, showScore }) {
  const [status, setStatus] = useState("cost");
  const [showModal, setShowModal] = useState(true);

  const { cost, question, answer } = point;

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

        <Modal onClose={() => alert("Тицьни на кнопку 'Дізнатись відповідь'")}>
          <div className={style.container}>
            <p className={style.textMain}>{question}</p>
            <button className="greenBtn" onClick={() => setStatus("answer")}>
              Дізнатись відповідь
            </button>
          </div>
        </Modal>
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
              </p>
              <button
                className="greenBtn"
                onClick={() => {
                  showScore({ question, cost });
                  setShowModal(false);
                }}
              >
                Зарахувати бали.
              </button>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

export default QuizQuestion;
